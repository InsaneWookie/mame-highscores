var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var pg = require('pg');
var db = require('./db');

//CREATE USER "mame-highscores" WITH PASSWORD 'mame-highscores';
//create database "mame-highscores" with owner "mame-highscores";

//TODO: use an ORM like http://sequelizejs.com/
var connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/mame-highscores";


var routes = require('./routes');
var users = require('./routes/user');
var scores = require('./routes/score');

var app = express();
 

db.query('SELECT * FROM scores', [], function(err, result) {
    console.log(result.rows);
});


//console.log(connectionString);
/*
var client = new pg.Client(connectionString);
client.connect();

var query = client.query("SELECT * FROM scores");
query.on("row", function (row, result) {
    result.addRow(row);
});
query.on("end", function (result) {
    console.log("some rows:");
    console.log(JSON.stringify(result.rows, null, "    "));
    client.end();
});
*/
/*
pg.connect(connectionString, function(err, client, done) {
  client.query('SELECT * FROM scores', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log(result.rows);
  });
});
*/



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(express.multipart());

//needed for file uploads
app.use(express.methodOverride());
app.use(express.bodyParser({keepExtensions: true, uploadDir: '/tmp'}));
app.use(express.limit('1mb')); //max upload size (NOTE: this has been deprecated)

app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);
app.get('/scores', scores.list);
app.get('/scores/:game', scores.game);
app.post('/scores/upload', scores.upload);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
