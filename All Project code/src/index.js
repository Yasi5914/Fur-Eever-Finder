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
  const dbConfig = {
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
  };
  
  const db = pgp(dbConfig);

  pgp.end();



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
      const hash = await bcrypt.hash(req.body.hashPW, 10);
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

  //Query to check if the username from the input is inside the database
  const query = `SELECT * from Users where username = $1`;

  //Create a user obe
  var user = {
    username:undefined,
    hashPW:undefined
  }

  //run the query to retrive the user associated with the input username
  db.one(query,[req.body.username])

      //if username is in database then we update the user object.
      .then((data)=>{
        user.username = data.username;
        user.hashPW = data.hashpw;
      })

      //if username is not in database then we return a sutiable message to the client
      .catch((err)=>{

        console.log(err);

        return res.render('pages/login',{

          status : err,
          message : "The username you have entered is not registered. Please consider registering."

        });

      });

  //Check if the credentials are valid through bcrypt. If they are valid redirect to the home page. If not send a sutiable message to the client.
  try{

    const match = await bcrypt.compare(req.body.hashPW, user,hashPW, function(err, isValid) {

      if(isValid){

        req.session.user = user;
        req.session.save();
        res.redirect("/home");
      }

    });
  }

  catch{
    console.log(err);

    return res.render('pages/login',{

      status : err,
      message: "Incorrect Password"

    })
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
