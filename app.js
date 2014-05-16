var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var stream = require('./routes/streams');
//var data = require('./routes/data');

//var jwt = require('jwt-simple');

//SSL
var options = {
  key: fs.readFileSync('ssl/ssl.key', 'utf8'),
  cert: fs.readFileSync('ssl/ssl.crt', 'utf8'),
  //requestCert: false,
  //rejectUnauthorized: false
};

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.configure('development', function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(allowCrossDomain);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.set('port', process.env.PORT || 80);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(allowCrossDomain);
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

app.get('/record', function(streamName) {
    var url = "http://flipitlive:webcast@live.soundcdn.com:8086/livestreamrecord?app=live&streamname=" + streamName + "_mid&action=startRecording"
    http.get(url, function(res) {
  console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});

});
//var httpsServer = https.createServer(credentials, app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
/* https.createServer(options, app).listen(443, function(){
  console.log('SECURED!!!');
}); */