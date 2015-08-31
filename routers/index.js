var express = require('express');
var router = express.Router();

router.get('/', function onIndex(req, res){
    var renderData = {};
    // res.locals
    res.render('index', renderData);
});

router.get('/about', function(req, res){
    res.send('About page');
});

module.exports = router;

