var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/updateItem', function(req, res, next) {
    res.render('index', { title: 'updateItem' });
});
module.exports = router;