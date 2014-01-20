var express = require('express');
var http = require('http');
var path = require('path');
var stream = require('./routes/streams');
//var data = require('./routes/data');

var app = express();

app.configure('development', function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.set('port', process.env.PORT || 80);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.errorHandler());
});

// development only
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
};*/

app.get('/streams', stream.findAll);
app.get('/streams/:id', stream.findById);
app.post('/streams', stream.addStream);
app.put('/streams/:id', stream.updateStream);
app.delete('/streams/:id', stream.deleteStream);

app.get('/data/streams', stream.findAll);
app.get('/data/streams/:id', stream.findById);
app.post('/data/streams', stream.rawAddStream);
app.put('/data/streams/:id', stream.updateStream);
app.delete('/data/streams/:id', stream.deleteStream);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
