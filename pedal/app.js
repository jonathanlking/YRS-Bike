var express = require('express');
var app = express();
var get_request = require('request');

var server = app.listen(3000, 'localhost', function() {
    console.log('Listening on port %d', server.address().port);
});

console.log('Server running.');

var error = 400;

app.get('/', function(request, responce)
{

/*
	var from_latitude = request.param("from_latitude");
	var from_longitude = request.param("from_longitude");
	var to_latitude = request.param("to_latitude");
	var to_longitude = request.param("to_longitude");

	if (!from_latitude || !from_longitude || !to_latitude || !to_longitude) responce.send(error);

	else
	{
		// Find nearest stations near your current location.
		
		var requestString = 'http://tfl.jlk.co/nearest/bikes/?latitude='+from_latitude+'&longitude='+from_longitude;
		get_request(requestString, function(error, response, body)
		{
			if (!error && response.statusCode == 200)
			{
				console.log("Nearest station has id "+jQuery.parseJSON(body)[0].stationId);
			}
			
			else {
				
				console.log(error);
			}
		});

		
		
		responce.send("Happy!");
	}
*/

	// Load from file
	fileStream.readFile('sample.json', 'utf8', function(error, file)
	{
		if (error) console.log(error);
		else
		{
			responce.send(file);
	
		}
	});

});