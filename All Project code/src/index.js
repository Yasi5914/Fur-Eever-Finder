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
    console.error('ERROR:', error.message || error);
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
  res.status(200).redirect('/login');
});
app.get('/register', (req, res) => {
  res.status(200).render('pages/register');
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
    if(req.query.error)
    {
      return res.render('pages/register', {message: decodeURI(error)})
    }
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
    res.status(200).redirect('/login/?success=true');
  } catch (error) {
    // If the insert fails, redirect to the registration page
    console.error('Registration error:', error);
    res.redirect('/register/?error=' + encodeURI(error));
  }
});

app.get('/login', (req, res) => {
  
  if(req.query.success)
  {
    res.status(200).render("pages/login", {message: "Registration Successful!"});
  }
  res.status(200).render("pages/login");
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
      return res.render('pages/login', {message: "Account not found. Perhaps you need to register?"});
    }
    // if the user is found, check if the password entered matches the database.
    const match = await bcrypt.compare(req.body.hashPW, user.hashpw);
    // if there is a match, let them login and be redirected to the explore page
    if (match) {
      req.session.user = user;
      req.session.save();
      return res.status(200).redirect('/explore/?login=true');
    }
    // otherwise, re-render the login and notify them of the incorrect password
    else {
      res.status(401)
      return res.render('pages/login', {
        message: "Wrong password!"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500)
    return res.render('pages/login', {
      message: "An error occurred during login"
    });
  }
});

const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.status(200).redirect('/login');
  }
  next();
};
// Authentication Required
app.use(auth);

app.get('/petpage_boulder',async(req,res)=>{
  const query = `SELECT * FROM PetInfo WHERE petID = $1`;
  let pet_id = parseInt(req.query.pet_id);
  db.any(query,pet_id)
      .then( pet =>{
        res.render('pages/boulderpetpage', {pet});
      })
      // if query execution fails
      // send error message
      .catch(err=> {
        return console.error(err);
      });
})
app.get('/petpage', async (req,res)=> {
  let pet_id = parseInt(req.query.pet_id);
  const pet_name = req.query.pet_name;
  const client_id =  'iUSzx8lrO7uNYganTX2SV1TG11esryZBqCQZw4H64m4UhQqN1h';
  const secret = "ooYSIMotLjQ4pcei3HCwrJd6F44G5LGgaLgBLEN4";
  const token_response = await axios.post(
      `https://api.petfinder.com/v2/oauth2/token`,
      `grant_type=client_credentials&client_id=${client_id}&client_secret=${secret}`,
  );
  const key = token_response.data.access_token;
  const header = { 'Authorization': `Bearer ${key}` };
  
  axios({
    url: `https://api.petfinder.com/v2/animals/${pet_id}`,
    method: 'GET',
    headers:header,
  })
      .then(results =>{
         res.render('pages/pet_page',{
          results
        })
      })
      .catch(err =>{
        console.error(err);
      });

})

app.get('/explore', async (req, res) => {
  const petQuery = 'SELECT * FROM PetInfo;';
  const username = req.session.user.username;
  
  await db.any(petQuery)
    .then((PetInfo) => {
      if(req.query.login)
      {
        res.status(200).render("pages/explore", { PetInfo , username , page: "explore", message : "Login Successful!"});
      } else
      {
        res.status(200).render("pages/explore", { PetInfo , username , page: "explore"});
      }
    })
    .catch((error) => {
      console.error('Error fetching pet info:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/explore_anywhere', async (req, res) => {
  const species_param = req.query.species;
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
      breed: req.query.breed,
      age: req.query.age,
      gender: req.query.gender,
      size: req.query.pet_size,
      location: "80310",
      sort: "distance"
    },
  })
    .then(results => {
        res.render('pages/explore_anywhere',{
          results,
          filter,
          username: req.session.user.username,
          species_param,
        })
    })
    .catch(error => {
      // Handle errors

      //console.log(error);
      res.render('pages/explore_anywhere', {
        results: [],
        filter,
        species_param,
        username: req.session.user.username
        })
    });

});

app.post('/add_favorite_boulder', async (req, res) => {
  try {
    const username = req.session.user.username;
    const petID = req.body.petID;
    const name = req.body.name;
    const petQuery = await db.oneOrNone('SELECT name, age FROM petInfo where petID = $1 AND name = $2', [petID, name]);
    const existingFavorite = await db.oneOrNone('SELECT * FROM UserFavoritesBoulder WHERE username = $1 AND petID = $2 AND name = $3', [username, petID, name]);

    if (existingFavorite) {
      // The pet is already a favorite, handle this case as needed
      console.error('Pet is already a favorite.');
      res.json({ success: false, message: 'Pet is already a favorite.' });
    } else {
      // The pet is not in favorites, add it
      await db.none('INSERT INTO UserFavoritesBoulder (username, petID, name) VALUES($1, $2, $3)', [username, petID, name]);
      res.json({ success: true, message: 'Pet added to favorites.', petInfo: {name: petQuery.name, age:petQuery.age}, });
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/add_favorite_anywhere', async (req, res) => {
  try {
    const username = req.body.username;
    const petID = req.body.petID;
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;
    const petphoto = req.body.petphoto;

    await db.none('INSERT INTO petInfoAPI (petid, name, age, sex, petPhoto) VALUES ($1, $2, $3, $4, $5)',[petID, name, age, gender, petphoto]);
    const existingFavorite = await db.oneOrNone('SELECT * FROM UserFavoritesAnywhere WHERE username = $1 AND name = $2 AND petID = $3', [username, name, petID]);

    if (existingFavorite) {
      // The pet is already a favorite, handle this case as needed
      console.error('Pet is already a favorite.');
      res.json({ success: false, message: 'Pet is already a favorite.' });
    } else {
      // The pet is not in favorites, add it
      await db.none('INSERT INTO UserFavoritesAnywhere (username, petID, name, petPhoto) VALUES($1, $2, $3, $4)', [username, petID, name, petphoto]);
      res.json({ success: true, message: 'Pet added to favorites.'});
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

    // Check if the pet is in favorites for the user in UserFavoritesBoulder
    const existingFavoriteBoulder = await db.oneOrNone('SELECT * FROM UserFavoritesBoulder WHERE username = $1 AND petID = $2', [username, petID]);

    // Check if the pet is in favorites for the user in UserFavoritesAnywhere
    const existingFavoriteAnywhere = await db.oneOrNone('SELECT * FROM UserFavoritesAnywhere WHERE username = $1 AND petID = $2', [username, petID]);

    if (!existingFavoriteBoulder && !existingFavoriteAnywhere) {
      // The pet is not in favorites, handle this case as needed
      res.json({ success: false, message: 'Pet is not in favorites.' });
    } else {
      // The pet is in favorites, remove it from the appropriate table(s)
      if (existingFavoriteBoulder) {
        await db.none('DELETE FROM UserFavoritesBoulder WHERE username = $1 AND petID = $2', [username, petID]);
      }

      if (existingFavoriteAnywhere) {
        await db.none('DELETE FROM UserFavoritesAnywhere WHERE username = $1 AND petID = $2', [username, petID]);
      }

      res.json({ success: true, message: 'Pet removed from favorites.' });
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.get('/favorites', (req, res) => {
  const username = req.session.user.username;
  const favQuery = `
    SELECT fav_b.*, pi.name, pi.age::VARCHAR(45), pi.petphoto
    FROM UserFavoritesBoulder fav_b
    JOIN PetInfo pi ON fav_b.petID = pi.petID
    WHERE fav_b.username = $1
    UNION
    SELECT fav_a.*, pia.name, pia.age, pia.petphoto
    FROM UserFavoritesAnywhere fav_a
    JOIN petInfoAPI pia ON fav_a.petID = pia.petID
    WHERE fav_a.username = $1
  `;
  // Fetch favorite pet information for the logged-in user
  db.any(favQuery, [username])
    .then((FavPetInfo) => {
      // Render the favorites page with pet information
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
    console.error(error)
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
      return res.status(200).redirect('/login');
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

    // Render the my_posts page with pet information
    res.render('pages/my_posts', { petInfo });
  } catch (error) {
    console.error('Error fetching pet information:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/post_pets', (req, res) => {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.status(200).redirect('/login');
  }
  res.render('pages/post_pets');
});

app.post('/post_pets', async (req, res) => {
  try {
    // Extract data from the form submission
    const { name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto } = req.body;
    const username = req.session.user.username;

    // Insert the pet information into the database and return all columns for the newly inserted record
    const result = await db.one(`
      INSERT INTO PetInfo (name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto || null]);
    // Check if the result has the expected properties
    if ('petid' in result && 'name' in result) {
      // Link the user to the created pet
      const linkQuery = `
        INSERT INTO User_to_Pet (username, petID)
        VALUES ($1, $2)
      `;

      await db.none(linkQuery, [username, result.petid]);

      res.redirect('/my_posts');
    } else {
      console.error('Error creating post: Result does not have expected properties');
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login", {message: "Logout Successful!"});
});

//module.exports = app.listen(3000);
app.listen(3000);
console.log("Listening on port 3000")