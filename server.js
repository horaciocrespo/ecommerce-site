var http = require('http');

var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');

// connection to mongoose

mongoose.connect('mongodb://jhonny:123456@ds011755.mlab.com:11755/amazon-clone', function(err) {
  if(err) 
    throw err;

  console.log('Connected to the database');
});

// middlewares

app.use(morgan('dev'));

var server = http.createServer(app);

app.get('/', function(req, res) {
  res.json({"message": "welcome to my website"});
});

server.listen(3000, function(err) {
  if(err) throw err;
  console.log('server is running on port 3000');
});