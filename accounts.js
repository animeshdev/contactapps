var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session    = require('express-session'),
    pass = require('./config/pass'),
    db = require('./config/database'),
    //Bourne     = require('bourne'),
    passport = require('passport'),
    crypto     = require('crypto');

var router = express.Router();
    //db     = new Bourne('users.json');

// function hash (password) {
//     return crypto.createHash('sha256').update(password).digest('hex');
// }

router
    
     .use(cookieParser())
     .use(bodyParser.json())
    .use(bodyParser.urlencoded())
            .use(session({ secret: '123' }))

     .use(passport.initialize())
     .use(passport.session())
     

    .get('/login', function (req, res) {
        console.log( 'cccc' );
        res.sendfile('public/login.html');     
    })

    .post('/login', function (req, res) {
        // var user = {
        //     username: req.body.username,
        //     password: hash(req.body.password)
        // };
        // db.findOne(user, function (err, data) {
        //     if (data) {
        //         req.session.userId = data.id;
        //         res.redirect('/');
        //     } else {
        //         res.redirect('/login');
        //     }
        // });

            // passport.authenticate('local', function(err, user, info) {
            //     if (err) { return next(err) }
            //     if (!user) {
            //       return res.json(400, {message: "Bad User"});
            //     }
            //     req.logIn(user, function(err) {
            //       if (err) { 

            //         //return next(err); 
            //         res.redirect('/');
            //         }
            //       //return res.send(user.username);

            //       res.redirect('/login');
            //     });
            //   })(req, res, next);

        passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true });
    

    })

    .post('/register', function (req, res) {


        // var user = {
        //     username: req.body.username,
        //     password: hash(req.body.password),
        //     options: {}
        // };

    var user = new db.userModel();
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
          console.log(err);
          res.redirect('/login');
        }else {

            console.log('user: ' + user.email + " saved.");
            req.login(user, function(err) {
                if (err) {
                  console.log(err);
                  res.redirect('/login');
                }
                return res.redirect('/');
            });
        }
    });




        // db.find({ username: user.username }, function (err, data) {
        //     if (!data.length) {
        //         db.insert(user, function (err, data) {
        //             req.session.userId = data.id;
        //             res.redirect('/');
        //         });
        //     } else {
        //         res.redirect('/login');
        //     }
        // });




            
    })
    .get('/logout', function (req, res) {
        // req.session.userId = null;
        
        req.session.destroy();
        req.logout();
        res.redirect('/');
    })

    // .use(function (req, res, next) {
    //     if (req.session.userId) {
    //         db.findOne({ id: req.session.userId }, function (err, data) {
    //             req.user = data;
    //         });
    //     }
    //     next();
    // })
    // .get('/options/displayed_fields', function (req, res) {
    //     if (!req.user) {
    //         res.json([]);
    //     } else {
    //         res.json(req.user.options.displayed_fields || []);
    //     }
    // })
    // .post('/options/displayed_fields', function (req, res) {
    //     req.user.options.displayed_fields = req.body.fields;   
    //     db.update({ id: req.user.id }, req.user, function (err, data) {
    //         res.json(data[0].options.displayed_fields);
    //     });
    // })

    
    ;

module.exports = router;
