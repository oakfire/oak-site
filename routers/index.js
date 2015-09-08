var express = require('express');
var router = express.Router();
var cache = require('../lib/cache.js');

router.get('/', function onIndex(req, res){
    var renderData = {};
    // res.locals
    res.render('index', renderData);
});

router.get('/about', function(req, res){
    res.send('About page');
});

router.get('/cache/:name', function(req, res) {
    var name = req.params.name;
    var filePath = cache.find(name);
    if(!filePath) {
        res.sendStatus(404);
        return;
    }

    res.sendFile(filePath);
});

module.exports = router;

