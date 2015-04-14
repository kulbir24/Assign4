var login = require('./login.js');
var signup = require('./signup.js');
var mongojs = require('mongojs');
var db1 = mongojs('login', ['login']);
var User = db1.login;
var LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport) {
    
    
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ');
       
        console.log(user);
        done(null, user.userid);
    });
    
    passport.deserializeUser(function (user, done) {
        done(null, user);
        console.log('deserializing user:', user);
    });
    
    
    login(passport);
    signup(passport);

}