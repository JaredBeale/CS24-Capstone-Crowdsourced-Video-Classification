var router1 = require('express').Router()

// middleware that is specific to this router
router1.use(function timeLog (req, res, next) {
  console.log('Requested URI Path : ', req.url)
  next()
})


module.exports = router1
