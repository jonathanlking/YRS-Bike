var express = require('express');
var app = express();
var request = require('request');
var fileStream = require('fs');

var server = app.listen(3000, function()
{
	console.log('Listening on port %d', server.address().port);
});

console.log('Server running.');

var error = 400;

app.get('/api/', function(request, responce)
{

/*
	// Load from file
	fileStream.readFile('sample.json', 'utf8', function(error, file)
	{
		if (error) console.log(error);
		else
		{
			responce.send(file);
	
		}
	});
*/

	var from_latitude = request.param('from_latitude');
	var from_longitude = request.param('from_longitude');
	var to_latitude = request.param('to_latitude');
	var to_longitude = request.param('to_longitude');

	if (!from_latitude || !from_longitude || !to_latitude || !to_longitude) responce.send(error);

	else
	{
		// Responce data is the returned data
		var responce_data = {};
		var timestamp = new Date();
		responce_data.timestamp = timestamp;

		var start = {
			latitude: from_latitude,
			longitude: from_longitude,
			time: timestamp
		};
		var end = {
			latitude: to_latitude,
			longitude: to_longitude
		};

		responce_data.start = start;
		
		var stations = {};
		
		// FIRST STATION
		nearestStationTo(from_latitude, from_longitude, function(data)
		{

			// Find the start station
			var startStation = JSON.parse(data)[0];
			// Get the time from the start loction to the first station 
			var startStationLocation = {latitude : startStation.latitude, longitude : startStation.longitude};
			timeFromTo(start, startStationLocation, 'walking', function(time)
			{
				var timeAtFirstStation = new Date(timestamp.getTime()+(time*1000));
				var firstStation = {id : startStation.id, name : startStation.name, latitude : startStation.latitude, longitude : startStation.longitude, time : timeAtFirstStation};
				
				// Still need to get the duration and the distance  - but require the second station to do this 
				
				nearestStationTo(to_latitude, to_longitude, function (data) {
					
					// Find the end station
					var endStation = JSON.parse(data)[0];
					var endStationLocation = {latitude : startStation.latitude, longitude : startStation.longitude};
					
					
				});
				
				
				responce.send(time / 60 + " minutes from the start to the first station</br></br>");
				
			});


		});

		/* 		responce.send(JSON.stringify(responce_data)); */

	}

});

function nearestStationTo(latitude, longitude, callback)
{

	var requestString = 'http://tfl.jlk.co/nearest/bikes/?latitude=' + latitude + '&longitude=' + longitude + '&number=1';
	request(requestString, function(error, response, body)
	{
		if (!error && response.statusCode == 200)
		{
			callback(body);
		}

		else
		{
			console.log(error);
		}
	});

	return;

}

function timeFromTo(from, to, mode, callback)
{

	var r = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + from.latitude + "," + from.longitude + "&destinations=" + to.latitude + "," + to.longitude + "&mode="+mode;

	request(r, function(error, response, body)
	{
		if (!error && response.statusCode == 200)
		{
			// The time in seconds
			var time = JSON.parse(body).rows[0].elements[0].duration.value;
			callback(time);
		}

		else
		{
			console.log(error);
		}
	});

	return;

}