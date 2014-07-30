var express = require('express');
var app = express();

app.get('/nearest/stations', function(request, responce){
	
	console.log(request.param("latitude") + " " + request.param("longitude"));
	responce.send('nearest station are...');
});

app.get('/nearest/bikes', function(request, responce){
	
	console.log(request.param("latitude") + " " + request.param("longitude"));
	responce.send('nearest bikes are...');
});

app.get('/nearest/docks', function(request, responce){
	
	console.log(request.param("latitude") + " " + request.param("longitude"));
	responce.send('nearest docks are...');
});

app.get('/', function(request, responce){
	
	responce.send('Please use a supported endpoint. </br></br> Documentation can be found at http://github.com/jonathanlking/YRS-Bike/blob/master/TFL.md');
});

var server = app.listen(3000, 'localhost', function() {
    console.log('Listening on port %d', server.address().port);
});