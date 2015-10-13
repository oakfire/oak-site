var express = require('express');
var router = express.Router();
var Instagram = require('instagram-node');
var path = require('path');
var config = require('../lib/config.js');
var logger = require('../lib/logger.js')('app');
var fs = require('fs');
var cache = require('../lib/cache.js');

var DATA_DIR = path.join(__dirname, '../data');
require('mkdirp').sync(DATA_DIR);
var AT_PATH = path.join(DATA_DIR, 'ins_access_token.json'); 

var ig = Instagram.instagram();
ig.use(config.instagram);


var REDIRECT_URI = 'http://joak.org/ins/';

router.get('/', function onInsIndex(req, res) {
    if(req.baseUrl === '/ins'){
        ig.authorize_user(req.query.code, REDIRECT_URI, function(err, result) {
            if (err) {
                logger.error('ins fail to auth, err:', err.body);
                res.send('error!, please retry.');
            } else {
                logger.info('ins access token:', result.access_token);
                var ato = { access_token: result.access_token };
                var fd = fs.openSync(AT_PATH, 'w');
                fs.writeSync(fd, JSON.stringify(ato));
                fs.closeSync(fd);
                res.send('done!');
            }
        });
    }else { //photo
        res.render('photo', {page: 'photo'});
    }

});


router.get('/auth', function onInsAuth(req, res){
    res.redirect(ig.get_authorization_url(REDIRECT_URI, { scope: ['likes'], state: 'a state' }));

});

function getInsImages(accessToken, count, cb){
    ig.use({access_token: accessToken.access_token});
    ig.user_self_media_recent({count:count}, function(err, medias, pagination, remaining, limit) {
        if(err) {
            logger.error('ins ajax img fail, err:', err.toString());
            cb(err);
            return;
        }

        //logger.info(JSON.stringify(medias));
        var infos = [];
        var images = [];
        medias.forEach(function(media){
            infos.push({id: media.id,
                img_low: media.id + '_low.jpg',
                img_std: media.id + '_standard.jpg',
                caption: media.caption.text||'',
                created_time: media.caption.created_time
            });
            images.push({name: media.id + '_low.jpg', url: media.images.low_resolution.url });
            images.push({name: media.id + '_standard.jpg', url: media.images.standard_resolution.url }); 
        });
        cache.downloadAll(images).then(function(){
            cb(null, infos);
        }, cb);
    });
}

router.use('/ajax/:func', function onInsAjax(req, res){
    var func = req.params.func;
    if(req.method === 'POST') {
        var count = 16;

        if(func === 'headimg') {
            count = 1;
        }else if(func === 'recent'){
            count = 16;
        }else{
            res.json(false);
        }

        var accessToken = {};
        try {
            accessToken = require(AT_PATH);
        }catch(e) {}

        logger.debug(JSON.stringify(accessToken));
        if(!accessToken || !accessToken.access_token) {
            res.redirect('/ins/auth');
            return;
        }

        getInsImages(accessToken, count, function(err, infos){
            if(err){
                logger.error('getInsImages fail: ', err.toString());
                res.json(err);
                return;
            }

            if(func === 'headimg'){
                res.json({url: '/cache/' + infos[1].name});
            }else if(func === 'recent'){
                res.json(infos);
            }
        });
    }
});

module.exports = router;

