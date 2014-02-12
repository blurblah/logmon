
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/logmon', function(req, res) {
	res.render('index');
});

app.post('/collector', function(req, res) {
	var data = req.body.params;
	console.log('Received data:' + JSON.stringify(data));
	io.sockets.emit('appendLog', data);
	res.json(200, {received: data});
});

io.sockets.on('connection', function(socket) {
	console.log('Client connected!');
	socket.on('disconnect', function() {
		console.log('Client disconnected!');
	});
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
