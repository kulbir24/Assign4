var http = require('http');
var express = require('express');
var mongojs = require('mongojs');//.connect('mongodb://sidhu:sidhu@ds041157.mongolab.com:41157/emerging');
var bodyParser = require('body-parser');
var favicon = require('static-favicon');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
//var session = require('express-session');//for session
//Database For patients
var db = mongojs('patientlist', ['patientlist']);
//Database For login
var dbLogin = mongojs('login', ['login']);
//Database For doctors
var dbDoctors = mongojs('doctors', ['doctors']);
var app = express();
var bodyParser = require('body-parser');
var httpServer = http.Server(app);
var server = require('http').createServer(app);
//For chatting
var io = require('socket.io')(server);
var port = process.env.port || 1337;
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');


//var db = mongojs.collection('Patients');
//var dbDoctors = mongojs.collection('Doctor');
//var dbLogin = mongojs.collection('Login');

//for passport puropse
require('./public/passport/index.js')(passport);

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user);       
        return next();
   
    }
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}


//app.engine('html', require('ejs').renderFile);//for session
//app.use(session({secret:'jagraj'}));//for session
app.use(express.static(__dirname + '/Public'));
app.set('views', path.join(__dirname, 'Public/Patients/Views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon());
app.use(expressSession({ secret: 'keyboard cat' }));
app.use(bodyParser.json());
//app.use('/', routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));


/* 
 * 
 * 
 * passport routes starts here
 * 
 * 
 * */

//Handle the POST from login button
app.post('/login',
    passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/#/login',
    failureFlash: true
})
);

// Handle the Signup POST 
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/#/login',
    failureRedirect: '/#/signup',
    failureFlash : true
}));

/* GET Home Page */
app.get('/getCurrentUser', isAuthenticated, function (req, res) {
    res.json({ user: req.user});
});

/* Handle Logout */
app.get('/signout', function (req, res) {
    req.logout();
    res.redirect('/#/login');
});


//To get all patients from database
app.get('/patientlist', function (request, response) {

    db.patientlist.find(function (err, docs) {
        response.json(docs);
    });
    //response.sendFile(__dirname + '/Public/Patients/Views/index.html');
});

//To get all doctors from database
app.get('/doctorList', function (request, response) {
    
    dbDoctors.doctors.find(function (err, docs) {
        response.json(docs);
    });
    
});
//To insert ne doctor into database
app.post('/doctorList', function (req, res) {
    console.log(req.body);
    dbDoctors.doctors.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

app.get('/patientlist/:id', function (req, res) {
    var id = req.params.id;
    db.patientlist.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    });
});

//For Login details fetching from mongdb
app.get('/login/:id', function (req, res) {
    var id = req.params.id;
    dbLogin.login.findOne({ userid: id }, function (err, doc) {
        res.json(doc);
    });
});

//To insert new patient
app.post('/patientlist', function (req, res) {
    console.log(req.body);  
    db.patientlist.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

//To delete patient
app.delete('/patientlist/:id', function (req, res) {
    var id = req.params.id;    
    db.patientlist.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    });
});

//To update patient record
app.put('/patientlist/:id', function (req, res) {
    var id = req.params.id;
   
    console.log(req.body); 
    db.patientlist.findAndModify({
        query: { _id: mongojs.ObjectId(id) },
        update: { $set: { firstname: req.body.firstname, lastname: req.body.lastname,age: req.body.age, phonenumber: req.body.phonenumber, lastvisitdate: req.body.lastvisitdate, status: req.body.status, doctorid: req.body.doctorid,visits: req.body.visits} },
        new: true
    }, function (err, doc) {
        res.json(doc);
    });
});

app.get('/', function (request, response) {
    
    response.sendFile(__dirname + '/Public/Patients/Views/index.html');
});

//server recieving the messages from client and replying
io.on('connection', function (socket) {
    
    socket.on('chat message', function (msg) {
        io.emit('ack', msg + ' Message received on' + ' ' + datetime);
    });
});
app.listen(port);
