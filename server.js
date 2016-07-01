var http = require('http');

var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

var User = require('./models/user');

// connection to mongoose

mongoose.connect('mongodb://jhonny:123456@ds011755.mlab.com:11755/amazon-clone', function(err) {
  if(err) 
    throw err;

  console.log('Connected to the database');
});

// middlewares
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "horacio"
}));
app.use(flash());
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);

var server = http.createServer(app);

server.listen(3000, function(err) {
  if(err) throw err;
  console.log('server is running on port 3000');
});