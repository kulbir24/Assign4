var LocalStrategy = require('passport-local').Strategy;
var mongojs = require('mongojs');//.connect('mongodb://sidhu:sidhu@ds041157.mongolab.com:41157/emerging');
//var User = mongojs.collection('Login');

//var Doctor = mongojs.collection('Doctor');

var User = mongojs('login', ['login']);
//Database For doctors
var Doctor = mongojs('doctors', ['doctors']);
var bCrypt = require('bcrypt-nodejs');

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


module.exports = function (passport) {
    
    passport.use('signup', new LocalStrategy(
        function (username, password, done) {
            
            firstname = "Aa"; lastname = "Zz";
            // find a user in Mongo with provided username
            User.login.findOne({ userid : username }, function (err, user) {
                // In case of any error, return using the done method
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }
                
                
                // already exists
                if (user) {
                    console.log('User already exists with username: ' + username);
                    return done(null, false);
                } 
                
                else {
                    
                    var pass = createHash(password);
                    
                    // save the user
                    User.login.save({ userid: username, password: pass,type:'doctor' }, function (Error, docs) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, user);
                    });
                    

                    
                }
            });
        })
    );
    
}
