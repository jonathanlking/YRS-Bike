var express = require('express');
var app = express();

var server = app.listen(3000, 'localhost', function() {
    console.log('Listening on port %d', server.address().port);
});

console.log('Server running.');

var error = 400;

app.get('/', function(request, responce)
{

	var from_latitude = request.param("from_latitude");
	var from_longitude = request.param("from_longitude");
	var to_latitude = request.param("to_latitude");
	var to_longitude = request.param("to_longitude");

	if (!from_latitude || !from_longitude || !to_latitude || !to_longitude) responce.send(error);

	else
	{
		responce.send("Happy!");
	}

});