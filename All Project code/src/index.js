// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require('bcrypt');
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
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', (req, res) => {
    res.redirect('/login');
  });

  app.get('/register', (req, res) => {
    res.render('pages/register');
  });
  
  // Register
  app.post('/register', async (req, res) => {
    try {
      if (!req.body.username || !req.body.hashPW) {
        return res.redirect(301, '/register', {
          message: "Missing username or password. Failed to register"
        });
      }
      // Hash the password using bcrypt library
      const hash = await bcrypt.hash(req.body.hashPW, 10);
      // Insert the username and hashed password into the 'users' table
      const username = req.body.username;

      // Replace the following SQL query with the one that inserts data into your 'users' table
      const insertQuery = `
        INSERT INTO Users (username, hashPW)
        VALUES ($1, $2)
        RETURNING username
      `;
      
       const result = await db.one(insertQuery, [username, hash]);
  
      // Registration successful, redirect to the login page
      res.redirect('/login');
    } catch (error) {
      // If the insert fails, redirect to the registration page
      console.error('Registration error:', error);
      res.redirect('/register');
    }
  });
  
  app.get('/explore', (req, res) => {
    res.status(200)
    res.render("pages/explore");
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
    const match = await bcrypt.compare(req.body.hashPW, user.hashpw.trim());
    // if there is a match, let them login and be redirected to the explore page
    if (match) {
      req.session.user = user;
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
module.exports = app.listen(3000);
//app.listen(3000);
console.log("Listening on port 3000")
