const express = require('express');

const dbRoutes = require("./routes/database.js")
const loginRoutes = require("./routes/login.js")
const PORT = process.env.PORT || 3000;

var app = express();

app.use('/api/',dbRoutes,loginRoutes)


app.listen(PORT,function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("== server listening on PORT=",PORT)
  }
})
