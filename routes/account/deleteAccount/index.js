var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/deleteAccount', function(req, res, next) {
  res.render('index', { title: 'deleteAccount' });
});

module.exports = router;
