var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/logout', function(req, res, next) {
  res.render('index', { title: 'logOut' });
});

module.exports = router;
