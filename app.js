const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./api/routes').router;

// Start express
const app = express();

// Start body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// express is used to connect .css and .js files
app.use(express.static(path.join(__dirname, '/client/build')));


/************ API Endpoints ****************/
app.use('/api', apiRoutes);


/************ Client Endpoints *************/
// Catch-all to send index which has the React router and will redirect the user correctly
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


/**************** Export ******************/
module.exports = app;
