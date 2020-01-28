const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');

// Start express
const app = express();

// Start body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Connect to db
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
db.connect();

/************ API Endpoints ****************/
// Use prefix "/api/" on api endpoints
  // Hello World example endpoint
app.get('/api/helloworld', (req, res) => {
  var message = "Hello World!";

  res.json(message);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// Endpoint - Create new user
app.post('/api/create/user', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO Users (username) VALUES ($1)', [name], (err, result) => {
    if (err) {
      res.status(400).json({content: `User already exists with username: ${name}`});
      console.log(err);
    }
    else
      res.status(200).json({success:`User added with username: ${name}`});
  });
});

// Endpoint - Create new vote
app.post('/api/create/vote', (req, res) => {
  const { user, video, label } = req.body;
  db.query('INSERT INTO Votes (labelId, userId, videoId) VALUES ((SELECT id FROM Labels WHERE labelTitle = $1), (SELECT id FROM Users WHERE username = $2), (SELECT id FROM Videos WHERE fileTitle = $3));', [label, user, video], (err, result) => {
    if (err) {
      res.status(500).json({content: "SQL Error while attempting to create vote in database."});
      console.log(err);
    }
    else
      res.status(200).json({success:`Vote added with username ${user} video title ${video} and label ${label}`});
  });
});

// Endpoint - Read users
app.get('/api/names/users', (req, res) => {
  db.query('SELECT username FROM Users;', (err, result) => {
    if (err) {
      res.status(400).json({content: `User does not exist with username: ${name}`});
      console.log(err);
    }
    else
      res.status(200).json(result.rows.map(entry => entry.username));
  });
});

// Endpoint - Read labels
app.get('/api/names/labels', (req, res) => {
  db.query('SELECT labelTitle FROM Labels;', (err, result) => {
    if (err) {
      res.status(500).json({content: 'Internal Server error while fetching labels.'});
      console.log(err);
    }
    else
      res.status(200).json(result.rows.map(entry => entry.labeltitle));
  });
});

// Endpoint - Select next video
app.get('/api/videos/select', (req, res) => {
  res.end(); // replace with db query(ies) and api logic
});


// /************ Client Endpoints *************/
// // Catch-all to serve React's public files.


// express is used to connect .css and .js files
app.use(express.static(path.join(__dirname, '/client/build')));

// if the client wanted to quickly go to one page they can.
// but the app will redirect them to the index page. and then react Router will render
// the correct page.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
  // res.status(304).send();
});


// Listen
const port = process.env.PORT || 9000;
app.listen(port);
console.log(`App listening on ${port}`);
