var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session    = require('express-session'),
    
    db = require('./config/database'),
    //Bourne     = require('bourne'),
    passport = require('passport'),

    crypto     = require('crypto');
    require('./config/pass');

var router = express.Router();

router
    
     .use(cookieParser())
     .use(bodyParser.json())
     .use(bodyParser.urlencoded())
     .use(session({ secret: '123' }))

     .use(passport.initialize())
     .use(passport.session())
     

    .get('/login', function (req, res) {
        //console.log( 'cccc' );
        res.sendfile('public/login.html');     
    })

    .post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' })
    )

    .post('/register', function (req, res) {
     

    var user = new db.userModel();
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        //var user = this;
        console.log(err);
        if (err) {

            throw err;

          console.log(err);
          res.redirect('/login');
        }else {

            console.log('user: ' + user.email + " saved.");

            console.log(user);
            //return res.redirect('/');
            req.login(user, function(err) {
                if (err) {
                  console.log(err);
                  res.redirect('/login');
                }
                return res.redirect('/');
            });
        }
    });

            
    })
    .get('/logout', function (req, res) {
        
        req.logout();

        //req.user = 1;
        console.log( req.user );
        res.redirect('/');
    });

module.exports = router;
