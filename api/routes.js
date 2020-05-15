const express = require('express');
const router = express.Router();
const db = require('./dbcon');

/***** Helping Functions and Variables *****/
// LABEL_MAX is the number of labels a video needs to be considered fully labeled
const LABEL_MAX = 5;

// TIMEOUT is how long a video may be checked out in milliseconds (first number is minutes, 60000 converts to ms)
const TIMEOUT = 10 * 60000;

// Checked out videos used to prevent videos from exceeding LABEL_MAX in db by simultaneous viewing
var checkedOutVideos = [];

// Create flatMap function to use in array processing for videos
const myConcat = (x, y) =>
  x.concat(y);
const myFlatMap = (f, xs) =>
  xs.map(f).reduce(myConcat, []);
Array.prototype.myFlatMap = function(f) {
  return myFlatMap(f, this)
}

// Servers and load balancing
var VIDEO_SERVER_ID = -1; // initially -1 because it's incremented to 0 on first call
const NUMBER_SERVERS = 2;
const SERVERS = [
  "https://quick-start-xandr-videohost.s3-us-west-2.amazonaws.com/",
  "https://crowd-source-circuit-tv.s3-us-west-1.amazonaws.com/dev_splits_complete/"
]
//  round robin load balancer
function getServerIndex() {
  VIDEO_SERVER_ID = (VIDEO_SERVER_ID + 1) % NUMBER_SERVERS;
  return VIDEO_SERVER_ID;
}


/************ API Endpoints ****************/
// Endpoint - Create new user
router.post('/create/user', (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO Users (username) VALUES ($1)", [name], (err, result) => {
    if (err) {
      res.status(400).json({content: `User already exists with username: ${name}`});
      console.log(err);
    }
    else
      res.status(200).json({success:`User added with username: ${name}`});
  });
});

// Endpoint - Create new vote
router.post('/create/vote', (req, res) => {
  // Remove all videos that have been checked out for too long
  var now = Date.now()
  for (let i = checkedOutVideos.length - 1; i >= 0; i--) {
    if (now - checkedOutVideos[i].timeStamp > TIMEOUT)
      checkedOutVideos.splice(i, 1);
  }

  // Grab body info
  const { user, video, label } = req.body;

  // If video is checked out
  index = checkedOutVideos.map(entry => entry.video).indexOf(video);
  if (index > -1){
    //  Return the video
    checkedOutVideos.splice(index, 1);

    // Create the vote
    db.query("INSERT INTO Votes (labelId, userId, videoId) VALUES ((SELECT id FROM Labels WHERE labelTitle = $1), (SELECT id FROM Users WHERE username = $2), (SELECT id FROM Videos WHERE fileTitle = $3));", [label, user, video], (err, result) => {
      if (err) {
        res.status(500).json({content: "SQL Error while attempting to create vote in database."});
        console.log(err);
      }
      else
        res.status(200).json({success:`Vote added with username ${user} video title ${video} and label ${label}`});
    });
  }
  // Otherwise video is overdue
  else {
    db.query("SELECT Count(*) FROM Votes WHERE videoid = (SELECT id FROM Videos WHERE fileTitle = $1)", [video], (err, result) => {
      if (err) {
        res.status(500).json({content: "SQL Error while attempting to create vote in database."});
        console.log(err);
      }
      else {
        // If the video still needs votes
        if (result.rows[0].count < LABEL_MAX) {
          // Create the vote
          db.query("INSERT INTO Votes (labelId, userId, videoId) VALUES ((SELECT id FROM Labels WHERE labelTitle = $1), (SELECT id FROM Users WHERE username = $2), (SELECT id FROM Videos WHERE fileTitle = $3));", [label, user, video], (err, result) => {
            if (err) {
              res.status(500).json({content: "SQL Error while attempting to create vote in database."});
              console.log(err);
            }
            else
              res.status(200).json({success:`Vote added with username ${user} video title ${video} and label ${label}`});
          });
        }
        // Otherwise the video is no good. Send the 400 error message
        else {
          res.status(400).json({content: "Video timed out. Try again with another video."});
        }
      }
    })
  }
});

// Endpoint - Read users
router.get('/names/user/:username', (req, res) => {
  db.query('SELECT username FROM Users WHERE username = $1;', [req.params.username] , (err, result) => {
    if (err) {
      res.status(500).json({content: "Internal server error while fetching usernames."});
      console.log(err);
    }
    else
      res.status(200).json(result.rows.map(entry => entry.username));
  });
});

// Endpoint - Read labels
router.get('/names/labels', (req, res) => {
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
router.get('/videos/select/username/:username', (req, res) => {
  // Remove all videos that have been checked out for too long
  var now = Date.now()
  for (let i = checkedOutVideos.length - 1; i >= 0; i--) {
    if (now - checkedOutVideos[i].timeStamp > TIMEOUT)
      checkedOutVideos.splice(i, 1);
  }

  // Declare helping variable
  var usableFileList = [];

  // Find partially completed videos not seen be user of form {filetitle: X, count: Y}
  db.query("SELECT V.fileTitle, COUNT(videoid) FROM Votes INNER JOIN Videos V ON V.id = videoid WHERE videoid NOT IN (SELECT videoid FROM Votes WHERE userid = (SELECT id FROM Users WHERE username = $1)) GROUP BY fileTitle HAVING COUNT(videoid) < $2 ORDER BY fileTitle;", [req.params.username, LABEL_MAX], (err, result) => {
    if (err) {
      res.status(500).json({content: `Error selecting partially voted video for user: ${req.params.username}`});
      console.log(err);
      return;
    }
    else {
      // Convert each entry from form {filetitle: X, count: Y} to form [X, X, X,... (LABEL_MAX - Y times)] and flatten the entries into a single array
      //   this is done because Y is the number of votes in the database, and LABEL_MAX - Y is the number of times that video is allowed to be checked out without exceeding LABEL_MAX
      usableFileList = result.rows.myFlatMap(entry => Array(LABEL_MAX - entry.count).fill(entry.filetitle));
      // Take only the videos in usable file list which are not checked out
      checkedOutVideos.map(entry => entry.video).forEach(video => {
        index = usableFileList.indexOf(video);
        if (index > -1)
          usableFileList.splice(index, 1);
      });

      // There are at least one partially complete videos unseen by the user, select one and send it
      if (usableFileList.length > 0) {
        const server = SERVERS[getServerIndex()];
        const fileid = usableFileList[Math.floor(100*Math.random() % usableFileList.length)];
        checkedOutVideos.push({'video': fileid, 'timeStamp': now});
        console.log(checkedOutVideos);

        const resp = {
          url: server + fileid,
          fileid
        }

        // console.log("==Serving CDN: ", server)
        res.status(200).json(resp);
      }
      // There are no partially completed videos unseen by the user
      else {
        // Find unseen videos
        db.query("SELECT fileTitle FROM Videos WHERE id NOT IN (SELECT videoid FROM Votes);", (err, result) => {
          if (err) {
            res.status(500).json({content: `Error selecting unseen video given user: ${req.params.username}`});
            console.log(err);
            return;
          }
          else {
            // Convert each entry from form {filetitle: X} to form [X, X, X,... (LABEL_MAX)] and flatten the entries into a single array
            //   this is done because Y is the number of votes in the database, and LABEL_MAX is the number of times that an unvoted video is allowed to be checked out without exceeding LABEL_MAX
            usableFileList = result.rows.myFlatMap(entry => Array(LABEL_MAX).fill(entry.filetitle));
            // Take only the videos in usable file list which are not checked out
            checkedOutVideos.map(entry => entry.video).forEach(video => {
              index = usableFileList.indexOf(video);
              if (index > -1)
                usableFileList.splice(index, 1);
            });

            // There are at least one unseen videos, select one and send it
            if (usableFileList.length > 0) {

              const server = SERVERS[getServerIndex()];
              const fileid = usableFileList[Math.floor(100*Math.random() % usableFileList.length)];
              checkedOutVideos.push({'video': fileid, 'timeStamp': now});
              console.log(checkedOutVideos);

              const resp = {
                url: server + fileid,
                fileid
              }

              console.log("==Serving CDN: ", server)
              res.status(200).json(resp);
            }
            // There are no unseen videos, the labeling task is done
            else {
              res.status(500).json({content: 'This labeling task has no more videos to watch.'});
            }
          }
        });
      }
    }
  });
});

// Endpoint - Get video count per user
router.get('/votes/count/:username', (req, res) => {

  db.query("SELECT COUNT(userid) from VOTES where userid = (SELECT id from USERS where username = $1)",[req.params.username], (err, result) => {
    if (err) {
      res.status(400).json({content: `Error with username search.`});
      console.log(err);
    }
    else{
      res.status(200).json(result.rows[0]['count']);
    }
  });
});

module.exports = {
  router,
  LABEL_MAX
};
