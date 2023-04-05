var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/getItems', function(req, res, next) {
    res.render('index', { title: 'getItems' });
});
module.exports = router;