var router2 = require('express').Router()
const { decideNextClipWithUsername } = require("../models/movies.js")

function requireLogin(req,res,next){
  var isLoggedIn = req.get("Authentication");
  /// "Bearer jsonwebtoken"
  // or we could do in the body like a username password sign on
  if(1){
    next();
  }
}

// middleware that is specific to this router
router2.use(function timeLog (req, res, next) {
  console.log('Requested URI Path : ', req.url)
  next()
})

router2.get("/next-clip",requireLogin,function(req,res,next){
  decideNextClipWithUsername("test", function(movieID){
    if(movieID == 0){
      res.status(400).send("username doesnt exist")
    }
    else if(!movieID){
      res.status(300).send("server error")
    }
    else{
      res.status(200).send(movieID);
    }
  })

})

module.exports = router2
