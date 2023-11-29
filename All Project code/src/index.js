// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require('bcrypt');
const axios = require('axios');
// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
app.use('/static', express.static('resources'))
// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

//test endpoint
app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {
  res.redirect('/login');
});
app.get('/register', (req, res) => {
  res.render('pages/register');
});
app.get('/admin_access', (req, res) => {
  res.render('pages/admin_access');
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});

// Register
app.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.username == '' || req.body.hashPW == '') {
      return res.render('pages/register', {
        message: "Missing username or password. Failed to register"
      });
    }

    const existingUser = await db.oneOrNone('SELECT * FROM Users WHERE username = $1', [req.body.username]);

    if (existingUser) {
      // Username already exists, display a message
      return res.render('pages/register', {
        message: "Username is already in use. Please choose a different username."
      });
    }

    // Hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.hashPW, 10);
    // Insert the username and hashed password into the 'users' table
    const username = req.body.username;
    const name = req.body.name;
    const address = req.body.address;
    const email = req.body.email;

    // Replace the following SQL query with the one that inserts data into your 'users' table
    const insertQuery =
        `INSERT INTO Users (username, hashPW, name, address, email)
        VALUES ($1, $2, $3, $4, $5)
      `;
    await db.none(insertQuery, [username, hash, name, address, email]);

    // Registration successful, redirect to the login page
    res.redirect('/login');
  } catch (error) {
    // If the insert fails, redirect to the registration page
    console.error('Registration error:', error);
    res.redirect('/register');
  }
});

app.get('/login', (req, res) => {
  res.status(200)
  res.render("pages/login");
});

app.post("/login", async (req, res) => {
  try {
    // if the username or password field is empty, notify the user
    if (!req.body.username || !req.body.hashPW) {
      res.status(401)
      return res.render('pages/login', {
        message: "Missing username or password"
      });
    }
    // query the Users table for the username entered
    const query = `SELECT * FROM Users WHERE username = $1 LIMIT 1;`;
    const user = await db.oneOrNone(query, [req.body.username]);
    // if the user is not found in the table, redirect to register page
    if (!user) {
      return res.redirect(301, '/register');
    }
    // if the user is found, check if the password entered matches the database.
    const match = await bcrypt.compare(req.body.hashPW, user.hashpw);
    // if there is a match, let them login and be redirected to the explore page
    if (match) {
      req.session.user = user;
      req.session.save();
      res.status(200)
      return res.redirect('/explore');
    }
    // otherwise, re-render the login and notify them of the incorrect password
    else {
      res.status(401)
      return res.render('pages/login', {
        message: "Wrong password!"
      });
    }
  } catch (error) {
    console.log("Login error:", error);
    res.status(500)
    return res.render('pages/login', {
      message: "An error occurred during login"
    });
  }
});

app.get('/petpage', async (req,res)=> {
  const pet_id = req.query.pet_id;
  const pet_name = req.query.pet_name;
  console.log(pet_id);
  console.log(pet_name);
  const client_id =  'iUSzx8lrO7uNYganTX2SV1TG11esryZBqCQZw4H64m4UhQqN1h';
  const secret = "ooYSIMotLjQ4pcei3HCwrJd6F44G5LGgaLgBLEN4";
  const token_response = await axios.post(
      `https://api.petfinder.com/v2/oauth2/token`,
      `grant_type=client_credentials&client_id=${client_id}&client_secret=${secret}`,
  );
  const key = token_response.data.access_token;
  const header = { 'Authorization': `Bearer ${key}` };

  axios({
    url: `https://api.petfinder.com/v2/animals`,
    method: 'GET',
    headers:header,
    params: {
      id: req.query.pet_id,
      name: req.query.pet_name,
      url: req.query.pet_url,
      age: req.query.pet_age,
      species: req.query.pet_species,
      type: req.query.pet_type,
      organization_id: req.query.pet_organization_id,
      gender: req.query.pet_gender,
      size: req.query.pet_size,
      limit: 1,
    },
  })
      .then(results =>{
         res.render('pages/pet_page',{
          results
        })
      })
      .catch(err =>{
        console.log("fuaashjkafs");
        console.log(err);
      });

})

app.get('/explore', (req, res) => {
  const petQuery = 'SELECT * FROM PetInfo;';
  const username = req.session.user.username;
  db.any(petQuery)
    .then((PetInfo) => {
      res.status(200).render("pages/explore", { PetInfo , username , page: "explore"});
    })
    .catch((error) => {
      console.error('Error fetching pet info:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/explore_anywhere', async (req, res) => {
  const species_param = req.query.species;
  console.log(species_param);
  const breed_param = req.query.breed;
  const age_param = req.query.age;
  const client_id =  'iUSzx8lrO7uNYganTX2SV1TG11esryZBqCQZw4H64m4UhQqN1h';
  const secret = "ooYSIMotLjQ4pcei3HCwrJd6F44G5LGgaLgBLEN4";
  const token_response = await axios.post(
    `https://api.petfinder.com/v2/oauth2/token`,
    `grant_type=client_credentials&client_id=${client_id}&client_secret=${secret}`,
  );
  const key = token_response.data.access_token;
  const header = { 'Authorization': `Bearer ${key}` };
  filtersDogs = [["Breeds","breed",["American Bulldog","American Staffordshire Terrier","Australian Cattle Dog / Blue Heeler","Australian Shepherd","Black Mouth Cur","Boxer","Chihuahua","Dachshund","German Shepherd Dog","Husky","Labrador Retriever","Mixed Breed","Pit Bull Terrier","Pointer","Retriever","Shephard","Terrier","Yorkshire Terrier"]],["Age","age",["Puppy","Young","Adult","Senior"]],["Size","size",["Small","Medium","Large","Extra Large"]],["Gender","gender",["Male","Female"]],["Good With","good_with",["Kids", "Other Dogs", "Cats"]],["Coat Length","coat_length",["Hairless","Short","Medium","Long"]],["Color","color",["Beige","Black"]], ["Care & Behavior","care_behavior",["House-trained","Special needs"]],["Days since posted","days",[1,2,3,4]]];
  filtersCats = [["Breeds","breed",["American Shorthair","British Shorthair","Burmese","Calico","Domestic Long Hair","Domestic Medium Hair","Domestic Short Hair","Maine Coon","Persian","Russian Blue","Siamese","Tabby","Tortoiseshell","Turkish Van","Tuxedo"]],["Age","age",["Kitten","Young","Adult","Senior"]],["Size","size",["Small","Medium","Large","Extra Large"]],["Gender","gender",["Male","Female"]],["Good With","good_with",["Kids", "Dogs", "Other Cats"]],["Coat Length","coat_length",["Hairless","Short","Medium","Long"]],["Color","color",["Beige","Black"]], ["Care & Behavior","care_behavior",["House-trained","Declawed","Special needs"]],["Days since posted","days",[1,2,3,4]]];  
  var filter = [];
  if(species_param == "dog"){
    filter = filtersDogs;
  }
  else if(species_param == "cat"){
    filter = filtersCats;
  }
  axios({
    url: `https://api.petfinder.com/v2/animals`,
    method: 'GET',
    headers: header,
    params: {
      limit: 100,
      type: species_param,
      breed: breed_param,
      age: age_param,
      location: "80310",
      sort: "distance"
    },
  })
    .then(results => {
      //console.log(results.data); // the results will be displayed on the terminal if the docker containers are running // Send some parameters
        res.render('pages/explore_anywhere',{
          results,
          filter,
          species_param
        })
    })
    .catch(error => {
      // Handle errors

      console.log(error);
      res.render('pages/explore_anywhere', {
        results: [],
        breeds,
        species_param
        })
    });

});

app.post('/add_favorite', async (req, res) => {
  try {
    const username = req.session.user.username;
    const petID = req.body.petID;
    const petQuery = await db.oneOrNone('SELECT name, age FROM petInfo where petID = $1', [petID]);
  
    const existingFavorite = await db.oneOrNone('SELECT * FROM UserFavoritesBoulder WHERE username = $1 AND petID = $2', [username, petID]);

    if (existingFavorite) {
      // The pet is already a favorite, handle this case as needed
      console.log('Pet is already a favorite.');
      res.json({ success: false, message: 'Pet is already a favorite.' });
    } else {
      // The pet is not in favorites, add it
      // all fields: username, petID, name, animalType, breed, size, age, sex, description, adoptionFee, photoURL
      await db.none('INSERT INTO UserFavoritesBoulder (username, petID) VALUES($1, $2)', [username, petID]);
      res.json({ success: true, message: 'Pet added to favorites.', petInfo: {name: petQuery.name, age:petQuery.age}, });
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Remove favorite
app.post('/remove_favorite', async (req, res) => {
  try {
    const username = req.session.user.username;
    const petID = req.body.petID;

    // Check if the pet is in favorites for the user
    const existingFavorite = await db.oneOrNone('SELECT * FROM UserFavoritesBoulder WHERE username = $1 AND petID = $2', [username, petID]);

    if (!existingFavorite) {
      // The pet is not in favorites, handle this case as needed
      console.log('Pet is not in favorites.');
      res.json({ success: false, message: 'Pet is not in favorites.' });
    } else {
      // The pet is in favorites, remove it
      await db.none('DELETE FROM UserFavoritesBoulder WHERE username = $1 AND petID = $2', [username, petID]);
      res.json({ success: true, message: 'Pet removed from favorites.' });
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/favorites', (req, res) => {
  const username = req.session.user.username;
  const favQuery = 'SELECT fav_b.*, pi.name, pi.age FROM UserFavoritesBoulder fav_b ' +
  'JOIN PetInfo pi ON fav_b.petID = pi.petID ' + 
  'WHERE fav_b.username = $1';
  // Fetch favorite pet information for the logged-in user
  db.any(favQuery, [username])
    .then((FavPetInfo) => {
      // Render the favorites page with pet information
      console.log(FavPetInfo);
      res.status(200).render("pages/favorites", { FavPetInfo, username: username, page: "favorites"});
    })
    .catch((error) => {
      console.error('Error fetching pet info:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/account', (req, res) => {
  res.status(200)
  res.render('pages/account', {
    username: req.session.user.username,
    name: req.session.user.name,
    address: req.session.user.address,
    adminID: req.session.user.adminID,
    photoURL: req.session.user.photoURL,
    page: "settings"
  });
});
app.post('/account', async (req, res) => {
  let query
  try {
    if (req.body.new_name)
    {
      req.session.user.name = req.body.new_name

      query = `UPDATE users SET
      name = '${req.body.new_name}'
      WHERE username = '${req.session.user.username}'`

      await db.none(query)
    }
    if (req.body.new_password)
    {
      const new_hash = await bcrypt.hash(req.body.new_password, 10)

      query = `UPDATE users SET
      hashpw = '${new_hash}'
      WHERE username = '${req.session.user.username}'`

      await db.none(query)
    }
    if (req.body.new_photoURL)
    {
      req.session.user.photoURL = req.body.new_photoURL

      query = `UPDATE users SET
      photoURL = '${req.body.new_photoURL}'
      WHERE username = '${req.session.user.username}'`

      await db.none(query)
    }
    if (req.body.new_address)
    {
      req.session.user.address = req.body.new_address

      query = `UPDATE users SET
      address = '${req.body.new_address}'
      WHERE username = '${req.session.user.username}'`

      await db.none(query)
    }
  } catch (error) {
    console.log(error)
  }
  res.render('pages/account', {
    username: req.session.user.username,
    name: req.session.user.name,
    address: req.session.user.address,
    adminID: req.session.user.adminID,
    photoURL: req.session.user.photoURL,
    message: "Information successfully updated!"
  });
});

app.get('/my_posts', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.user) {
      return res.redirect('/login');
    }

    // Fetch pet information for the logged-in user
    const username = req.session.user.username;

    // Query the database only if the user is logged in
    const petInfo = await db.any(`
      SELECT pi.*, u.username
      FROM PetInfo pi
      INNER JOIN User_to_Pet utp ON pi.petID = utp.petID
      INNER JOIN Users u ON utp.username = u.username
      WHERE u.username = $1
    `, [username]);

    console.log('Fetched Pet Info:', petInfo);

    // Render the my_posts page with pet information
    res.render('pages/my_posts', { petInfo , page: "posts_self"});
  } catch (error) {
    console.error('Error fetching pet information:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/post_pets', (req, res) => {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('pages/post_pets');
});

app.post('/post_pets', async (req, res) => {
  try {
    // Extract data from the form submission
    const { name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto } = req.body;
    const username = req.session.user.username;

    // Insert the pet information into the database
    const insertQuery = `
      INSERT INTO PetInfo (name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING petID
    `;

    const result = await db.one(insertQuery, [name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto]);

    // Link the user to the created pet
    const linkQuery = `
      INSERT INTO User_to_Pet (username, petID)
      VALUES ($1, $2)
    `;

    await db.none(linkQuery, [username, result.petID]);

    console.log('Post creation successful');
    res.redirect('/my_posts');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Internal Server Error');
  }
});

const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    res.status(200)
    return res.redirect('/login');
  }
  next();
};
// Authentication Required
app.use(auth);

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login");
});

//module.exports = app.listen(3000);
app.listen(3000);
console.log("Listening on port 3000")