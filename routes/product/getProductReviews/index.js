var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/getProductReviews', function(req, res, next) {
    res.render('index', { title: 'getProductReviews' });
});
module.exports = router;