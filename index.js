const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// Use prefix "/api/" on api endpoints
app.get('/api/helloworld', (req, res) => {
  var message = "Hello World!";

  res.json(message);
});

// Catch-all to serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 9000;
app.listen(port);

console.log(`App listening on ${port}`);
