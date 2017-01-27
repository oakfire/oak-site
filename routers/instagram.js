'use strict';
const express = require('express');
const router = express.Router();
const Instagram = require('instagram-node');
const path = require('path');
const config = require('../lib/config.js');
const logger = require('../lib/logger.js')('app');
const fs = require('fs');
const cache = require('../lib/cache.js');

const DATA_DIR = path.join(__dirname, '../data');
require('mkdirp').sync(DATA_DIR);
const AT_PATH = path.join(DATA_DIR, 'ins_access_token.json'); 

let ig = Instagram.instagram();
ig.use(config.instagram);


const REDIRECT_URI = 'http://joak.org/ins/';

router.get('/', function onInsIndex(req, res) {
    if(req.baseUrl === '/ins'){
        ig.authorize_user(req.query.code, REDIRECT_URI, function authorizeUserCB(err, result) {
            if (err) {
                logger.error('ins fail to auth, err:', err.body);
                res.send('error!, please retry.');
            } else {
                logger.info('ins access token:', result.access_token);
                let ato = { access_token: result.access_token };
                let fd = fs.openSync(AT_PATH, 'w');
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
    ig.user_self_media_recent({count:count}, function userSelfMediaRecentCB(err, medias, pagination, remaining, limit) {
        if(err) {
            logger.error('ins ajax img fail, err:', err.toString());
            cb(err);
            return;
        }

        //logger.info(JSON.stringify(medias));
        let infos = [];
        let images = [];
        medias.forEach(function forEachMediasCB(media){
            infos.push({id: media.id,
                url_low: '/cache/' + media.id + '_low.jpg',
                url_std: '/cache/' + media.id + '_standard.jpg',
                caption: media.caption ? media.caption.text : 'photo',
                created_time: media.caption ? media.caption.created_time : false
            });
            images.push({name: media.id + '_low.jpg', url: media.images.low_resolution.url });
            images.push({name: media.id + '_standard.jpg', url: media.images.standard_resolution.url }); 
        });
        cache.downloadAll(images)
        .then( () => {
            cb(null, infos);
        })
        .catch( err => cb(err));
    });
}

router.use('/ajax/:func', function onInsAjax(req, res){
    let func = req.params.func;
    if(req.method === 'POST') {
        let count = 16;

        if(func === 'headimg') {
            count = 1;
        }else if(func === 'recent'){
            count = 16;
        }else{
            res.json(false);
        }

        let accessToken = {};
        try {
            accessToken = require(AT_PATH);
        }catch(e) {}

        logger.debug(JSON.stringify(accessToken));
        if(!accessToken || !accessToken.access_token) {
            res.redirect('/ins/auth');
            return;
        }

        getInsImages(accessToken, count, function getInsImagesCB(err, infos){
            if(err){
                logger.error('getInsImages fail: ', err.toString());
                res.json(err);
                return;
            }

            if(func === 'headimg'){
                res.json({url: infos[0].url_std});
            }else if(func === 'recent'){
                res.json(infos);
            }
        });
    }
});

module.exports = router;

