var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/bulletin', function(req, res, next) {
    res.render('index', { title: 'Bulletin' });
});
module.exports = router;