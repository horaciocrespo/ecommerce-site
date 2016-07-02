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
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');

// connection to mongoose

mongoose.connect(secret.database, function(err) {
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
  secret: secret.secretKey,
  store: new MongoStore({url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function(req, res, next) {
  Category.find({}, function(err, categories) {
    if(err)
      return next(err);

    res.locals.categories = categories;
    next();
  });
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

// routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

var server = http.createServer(app);

server.listen(secret.port, function(err) {
  if(err) throw err;
  console.log('server is running on port ' + secret.port);
});