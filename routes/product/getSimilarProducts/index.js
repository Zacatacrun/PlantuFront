var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/getSimilarProducts', function(req, res, next) {
    res.render('index', { title: 'getSimilarProducts' });
});
module.exports = router;