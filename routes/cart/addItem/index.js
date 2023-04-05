var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/addItem', function(req, res, next) {
    res.render('index', { title: 'addItem' });
});
module.exports = router;