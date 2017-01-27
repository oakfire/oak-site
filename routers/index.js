'use strict';
const express = require('express');
const router = express.Router();
const cache = require('../lib/cache.js');
const logger = require('../lib/logger.js')('app');

router.get('/', function onIndexN(req, res){
    let renderData = {};
    // res.locals
    res.render('index', renderData);
});

router.get('/about', function onAboutN(req, res){
    let renderData = {};
    res.render('about', renderData);
});

router.get('/cache/:name', function onCacheN(req, res) {
    let name = req.params.name;
    let infoo = cache.find(name);
    logger.info('request cache. name:', name? name: '', 'INFO:', infoo ? infoo : '');
    if(!infoo) {
        res.sendStatus(404);
        return;
    }

    res.sendFile(infoo.pathname);
});

module.exports = router;

