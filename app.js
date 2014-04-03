var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');
var scores = require('./routes/score');

var app = express();
 

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

var db = require('./db');
require('./game_mappings/gameInfos'); //creates a variable "gameInfos"
//on start up we load the games into the database for look up later
//console.log(db.connectionString);

var client = new pg.Client(db.connectionString);


//
for(i in gameInfos){
    //console.log(gameInfos[i]);

    client.query("INSERT INTO games (game_id, game_name, has_mapping) SELECT $1::varchar, $2::varchar, true WHERE NOT EXISTS (SELECT 1 FROM games WHERE game_id = $1)", 
        [gameInfos[i].name, gameInfos[i].fullName], function(err, result){
          //  done();
            if(err) { console.log(err); }
        });
/*
    query.on('end', function(result) {
      
    });
  */  

}

client.connect();



module.exports = app;
