var express = require('express');
var router = express.Router();
var cache = require('../lib/cache.js');
var logger = require('../lib/logger.js')('app');

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
    var infoo = cache.find(name);
    logger.info('request cache. name:', name? name: '', 'INFO:', infoo ? infoo : '');
    if(!infoo) {
        res.sendStatus(404);
        return;
    }

    res.sendFile(infoo.pathname);
});

module.exports = router;

