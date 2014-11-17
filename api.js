var express    = require('express'),
    //Bourne     = require('bourne'),
    bodyParser = require('body-parser'),

   db = require('./config/database'),
    router     = express.Router();

    var Contact = db.Contact;

router
    
     .use(bodyParser.json())
     //.use(bodyParser.urlencoded())
    .route('/contact')
        .get(function (req, res) {
             Contact
              .find(null, { _id: 0 })
              .sort('name.last')
              .exec(function (err, contacts) {
                if( err ) return res.send(500, err);
                if( !contacts ) return res.send(404, new Error("Contacts not found."));
                res.send(contacts);
            });
        })
        .post(function (req, res) {

            var contact = new Contact(req.body);

            console.log(req.body);

            contact.save(function (err, contact) {
              if( err ) return res.send(500, err);
              res.send(contact);
            });
            
        });

router
    // .param('id', function (req, res, next) {
    //     req.dbQuery = { id: parseInt(req.params.id, 10) };
    //     next();
    // })
    .route('/contact/:name')

        .get(function (req, res) {

                Contact
                  .findOne({ 'name.clean': req.params.name  }, { _id: 0 })
                  .exec(function (err, contact) {
                    if( err ) return res.send(500, err);
                    if( !contact ) return res.send(404, new Error("Contact not found."));
                    res.send(contact);
                });


        })


        .put(function (req, res) {


            // var contact = req.body;
            // delete contact.$promise;
            // delete contact.$resolved;
            // db.update(req.dbQuery, contact, function (err, data) {
            //     res.json(data[0]);
            // });

            var contact = new Contact(req.body);
            delete contact.$promise;
            delete contact.$resolved;
            contact.save(function (err, contact) {
              if( err ) return res.send(500, err);
              res.send(contact);
            });



        })
        .delete(function (req, res) {


            Contact
              .remove({ 'name.clean': req.params.name  } , function (err) {


                    if( err ) return res.send(500, err);
                    //if( !contact ) return res.send(404, new Error("Contact not found."));

                    res.json(null);

                })

              ;

            // db.delete(req.dbQuery, function () {
            //     res.json(null);
            // });


        });

module.exports = router;
