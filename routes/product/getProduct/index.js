var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/getProduct', function(req, res, next) {
    res.render('index', { title: 'getProduct' });
});
module.exports = router;