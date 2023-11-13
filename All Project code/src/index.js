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
      // Hash the password using bcrypt library
      const hash = await bcrypt.hash(req.body.password, 10);
      console.log(hash);
      // Insert the username and hashed password into the 'users' table
      const username = req.body.username;
      
      // Replace the following SQL query with the one that inserts data into your 'users' table
      const insertQuery = `
        INSERT INTO Users (username, password)
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
  
  app.get('/home', (req, res) => {
    res.render("pages/home");
  });

  app.get('/login', (req, res) => {
    res.render("pages/login");
});

app.post("/login", async (req, res) => {
  console.log("request body:", req.body);
  try {
    if (!req.body.username || !req.body.password) {
      return res.render('pages/login', {
        message: "Missing username or password"
      });
    }

    const query = `SELECT * FROM Users WHERE username = $1 LIMIT 1;`;
    const user = await db.oneOrNone(query, [req.body.username]);
    const user_password = await bcrypt.hash(req.body.password, 10);
    console.log(user);
    if (user === null) {
      return res.render('pages/register', {
        message: "Please register an account."
      });
    }
    const match = await bcrypt.compare(req.body.password, user_password);

    if (match) {
      req.session.user = user;
      return res.redirect('/home');
    } else {
      return res.render('pages/login', {
        message: "Wrong password!"
      });
    }
  } catch (error) {
    console.log("Login error:", error);
    return res.render('pages/login', {
      message: "An error occurred during login"
    });
  }
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);

module.exports = app.listen(3000);
console.log("Listening on port 3000")
