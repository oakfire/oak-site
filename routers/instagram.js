var express = require('express');
var router = express.Router();
var Instagram = require('instagram-node');
var path = require('path');
var config = require('../lib/config.js');
var logger = require('../lib/logger.js')('app');
var fs = require('fs');

var DATA_DIR = path.join(__dirname, '../data');
require('mkdirp').sync(DATA_DIR);
var AT_PATH = path.join(DATA_DIR, 'ins_access_token.json'); 

/*
function _auth(code) {
    var ig = Instagram.instagram(); 
    ig.use(config.instagram);
    
}
*/

var ig = Instagram.instagram();
ig.use(config.instagram);


var REDIRECT_URI = 'http://joak.org/ins/';

router.get('/', function onInsIndex(req, res) {
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
});


router.get('/auth', function onInsAuth(req, res){
    res.redirect(ig.get_authorization_url(REDIRECT_URI, { scope: ['likes'], state: 'a state' }));

});

router.use('/ajax/:func', function onInsAjax(req, res){
    var func = req.params.func;
    if(req.method === 'POST') {
        if(func === 'headimg') {
            var accessToken = {};
            try {
                accessToken = require(AT_PATH);
            }catch(e) {}

            logger.debug(JSON.stringify(accessToken));
            if(!accessToken || !accessToken.access_token) {
                res.redirect('/ins/auth');
                return;
            }

            ig.use({access_token: accessToken.access_token});
            ig.user_self_media_recent({count:1}, function(err, medias, pagination, remaining, limit) {
                if(err) {
                    logger.error('ins ajax headimg fail, err:', err.toString());
                    res.json({err:err});
                    return;
                }

                logger.info(JSON.stringify(medias));

                res.send({url: medias[0].images.standard_resolution.url});
            });

            res.send(func);
        }
    }

});

module.exports = router;

