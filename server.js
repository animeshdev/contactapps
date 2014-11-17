var express = require('express'),
    api     = require('./api'),
    users   = require('./accounts'),
    app     = express();

app

    .use(express.static('./public'))

    .use(users)

    .use('/api', api)
    .get('*', function (req, res) {

        //res.send( 'xxsss' );

        if (!req.user) {
            res.redirect('/login');
        } else {
            res.sendfile('index.html');
        }


    })
    .listen(5000);
