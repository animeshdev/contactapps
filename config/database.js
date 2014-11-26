var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10;

var uristring = 'mongodb://localhost/contact';

var mongoOptions = { };

mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Successfully connected to: ' + uristring);
  }
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true}
});



// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) 
    {

      console.log( 'bcrypt error' );
      return next(err);
    }
      

    bcrypt.hash(user.password, salt,null, function(err, hash) {
      if(err) {

        console.log( 'bcrypt error' );
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

//Password verification
User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};



var contactSchema = new Schema({

  _creator:{ type: Schema.ObjectId},
  name: {
    first: { type: String, default: '' },
    last: { type: String, default: '' },
    clean: { type: String, default: '', unique: true }
  },
  email: { type: String, default: '' },
  number: { type: String, default: '' },
  notes: { type: String, default: '' },
  added: Date
});

contactSchema
  // Index on important fields
  .index({ name: { last: 1, clean: 1 }, email: 1 })
  // Make sure document has 'added' field when first saved
  .pre('save', function (next) {
    if( !this.added ) this.added = new Date();
    this.name.clean = (this.name.first + '-' + this.name.last).toLowerCase();
    next();
  });

// Models

var contatcModel = mongoose.model('Contact', contactSchema);

var userModel = mongoose.model('User', User);


// Export Models
exports.userModel = userModel;

exports.Contact = contatcModel;
