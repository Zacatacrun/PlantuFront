var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/singIn', function(req, res, next) {
  res.render('index', { title: 'singIn' });
});

module.exports = router;
