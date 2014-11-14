var express = require('express'),
    //api     = require('./api'),
    users   = require('./accounts'),
    app     = express();

app
    
     //.use(express.static('./public'))

    //  .get('/login', function (req, res) {
    //     console.log( 'cccc' );
    //     res.sendfile('public/login.html');     
    // })

    .use(users)

    //.use('/api', api)
    .get('*', function (req, res) {

        //res.send( 'xxsss' );

        if (!req.user) {
            res.redirect('/login');
        } else {
            res.sendfile('public/main.html');
        }


    })
    .listen(5000);
