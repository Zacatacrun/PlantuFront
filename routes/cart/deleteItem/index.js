var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/deleteItem', function(req, res, next) {
    res.render('index', { title: 'deleteItem' });
});
module.exports = router;