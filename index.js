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


// express is used to connect .css and .js files
app.use(express.static(path.join(__dirname, '/client/build')));


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
  console.log(user,video,label);
  res.status(200).json({success:`Vote added with username ${user} video title ${video} and label ${label}`});

  // when we know the api is correctly getting votes and the
  // select video route is working then we will have these uncomments
  // db.query('INSERT INTO Votes (labelId, userId, videoId) VALUES ((SELECT id FROM Labels WHERE labelTitle = $1), (SELECT id FROM Users WHERE username = $2), (SELECT id FROM Videos WHERE fileTitle = $3));', [label, user, video], (err, result) => {
  //   if (err) {
  //     res.status(500).json({content: "SQL Error while attempting to create vote in database."});
  //     console.log(err);
  //   }
  //   else
  //     res.status(200).json({success:`Vote added with username ${user} video title ${video} and label ${label}`});
  // });
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


// const google = `http://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;
// maybe for performance we can host it as a CDN
var VIDEO_SERVER_ID = -1; //intially its -1 becaus the very first call itbecomes 0;
const NUMBER_SERVERS = 2;
//to be honest i think the cctv link is the more reliable, i did a folder upload and it was
// about and hour faster than uploading 1112 files
const SERVERS=[
  "https://quick-start-xandr-videohost.s3-us-west-2.amazonaws.com/",
  "https://crowd-source-circuit-tv.s3-us-west-1.amazonaws.com/dev_splits_complete/"
]

const dummylist = [
 "dia0_utt0.mp4",
 "dia103_utt1.mp4",
 "dia104_utt1.mp4",
 "dia104_utt14.mp4",
 "dia104_utt2.mp4",
 "dia104_utt7.mp4",
]

// round robin load balancer
function getServerIndex(){
// global yes indeed
  VIDEO_SERVER_ID = (VIDEO_SERVER_ID+1)%NUMBER_SERVERS;
  return VIDEO_SERVER_ID;

}
// Endpoint - Select next video
app.get('/api/videos/select', (req, res) => {
    const server =SERVERS[getServerIndex()];
    const fileid =dummylist[Math.floor(100*Math.random()%dummylist.length)];

    const resp = {
      url: server+fileid,
      fileid
    }
    console.log("==Serving CDN: ", server)
  // its a string
  res.status(200).json(resp); // replace with db query(ies) and api logic
});

// /************ Client Endpoints *************/
// // Catch-all to serve React's public files.


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
