var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(()=>{
    res.redirect('/');
  });
});

module.exports = router;
