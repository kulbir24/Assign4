var LocalStrategy = require('passport-local').Strategy;
var mongojs = require('mongojs');//.connect('mongodb://sidhu:sidhu@ds041157.mongolab.com:41157/emerging');
//var User = mongojs.collection('Login');
var User = mongojs('login', ['login']);

var bCrypt = require('bcrypt-nodejs');

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}


module.exports = function (passport) {
    
    
    passport.use(new LocalStrategy(function (username, password, done) {
        
        // check in mongodb if a user with username exists or not
        User.login.findOne({ 'userid' : username }, 
                function (err, user) {
            // In case of any error, return using the done method
            if (err)
                return done(err);
            
            // Username does not exist, log the error and redirect back
            if (!user) {
                console.log('User Not Found with username ' + username);
                return done(new Error("No user found with those credentials"));
            }
            console.log(user);
            // User exists but wrong password, log the error 
            if (!isValidPassword(user, password)) {
                console.log('Invalid Password');
                return done(new Error("No user found with those credentials"));
            }
            
            // User and password both match, return user from done method
            // which will be treated like success
            return done(null, user);
        }
        );

    })
    );
    
    
}