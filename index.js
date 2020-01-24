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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

/************ API Endpoints ****************/
// Use prefix "/api/" on api endpoints
  // Hello World example endpoint
app.get('/api/helloworld', (req, res) => {
  var message = "Hello World!";

  res.json(message);
});

// Endpoint - Create new user
app.post('/api/create/user', (req, res) => {
  const { name } = request.body;  
  db.query('INSERT INTO Users (username) VALUES ($1)', [name], (err, result) => {
    if (err) throw err;
    res.status(201).send(`User added with username: ${reqUsername}`);
  });
});

// Endpoint - Create new vote
app.post('/api/create/vote', (req, res) => {
  const { user, video, label } = request.body;
  db.query('INSERT INTO Votes (labelId, userId, videoId) VALUES ((SELECT id FROM Labels WHERE labelTitle = $1), (SELECT id FROM Users WHERE username = $2), (SELECT id FROM Videos WHERE fileTitle = $3));', [label, user, video], (err, result) => {
    if (err) throw err;
    res.status(201).send(`Vote added with username ${user} video title ${video} and label ${label}`);
  });
});

// Endpoint - Read users
app.get('/api/names/users', (req, res) => {
  db.query('SELECT username FROM Users;', (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows.map(entry => entry.username));
  });
});

// Endpoint - Read labels
app.get('/api/names/labels', (req, res) => {
  db.query('SELECT labelTitle FROM Labels;', (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows.map(entry => entry.labeltitle));
  });
});

// Endpoint - Select next video
app.get('/api/videos/select', (req, res) => {
  res.end(); // replace with db query(ies) and api logic
});


// express static does this for us.


// /************ Client Endpoints *************/
// // Catch-all to serve React's index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });


// Listen
const port = process.env.PORT || 9000;
app.listen(port);
console.log(`App listening on ${port}`);
