var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/unsubscribe', function(req, res, next) {
  res.render('index', { title: 'Unsubscribe' });
});


module.exports = router;