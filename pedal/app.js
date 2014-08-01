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

		var stations = [];

		// FIRST STATION
		nearestStationTo(from_latitude, from_longitude, function(data)
		{

			// Find the start station
			var startStation = JSON.parse(data)[0];
			// Get the time from the start loction to the first station 
			var startStationLocation = {
				latitude: startStation.latitude,
				longitude: startStation.longitude
			};
			timeFromTo(start, startStationLocation, 'walking', function(time)
			{
				var timeAtFirstStation = new Date(timestamp.getTime() + (time * 1000));
				var firstStation = {
					id: startStation.id,
					name: startStation.name,
					latitude: startStation.latitude,
					longitude: startStation.longitude,
					time: timeAtFirstStation
				};

				// Still need to get the duration and the distance  - but require the second station to do this 
				nearestStationTo(to_latitude, to_longitude, function(data)
				{

					// Find the end station
					var endStation = JSON.parse(data)[0];
					var endStationLocation = {
						latitude: endStation.latitude,
						longitude: endStation.longitude
					};

					timeFromTo(startStationLocation, endStationLocation, 'bicycling', function(time, distance)
					{

						// The time from the start station to the end station
						console.log(time);
						responce.send(time / 60 + " minutes from the start station to the end station</br></br>");

						firstStation.duration = time / 60;
						firstStation.distance = distance;
						stations.push(firstStation);

						// If the time between stations is greater than 30 minutes, use another station in between them
						if (time > 30 * 60)
						{

							// Do some linear interpolation stuff
							
							// You know the distance from the start to the end
							// You know the time from the start to the end
							// You can therefore guess the distace at 30 minutes
							
							// The guess distance
							var guess = ((15*60)/time)*distance;
							// Guess the coordinates
							var guessLat = ( parseFloat(endStationLocation.latitude)-parseFloat(startStation.latitude))*parseFloat((guess/distance)) + parseFloat(startStation.latitude);

							var guessLong = (parseFloat(endStationLocation.longitude)-parseFloat(startStation.longitude))*parseFloat((guess/distance)) + parseFloat(startStation.longitude);
							
							nearestStationTo(guessLat, guessLong, function (station) {
								
								console.log("Lat: "+guessLat+" Long: "+guessLong);
								console.log(station);
								var middleStation = JSON.parse(data)[0];
								var actualLocation = {latitude: middleStation.latitude, longitude: middleStation.longitude};
								timeFromTo(startStationLocation, actualLocation, "bicycling", function (time, distance){
									
									console.log("Actual time: "+time/60);
								});
							});
							
						}

						else
						{

							// Only one station - Happy days! (I hate that saying...) + why are they even using this website...!?

							
						}

					});


				});


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

	var r = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + from.latitude + "," + from.longitude + "&destinations=" + to.latitude + "," + to.longitude + "&mode=" + mode;

	request(r, function(error, response, body)
	{
		if (!error && response.statusCode == 200)
		{
			// The time in seconds
			var time = JSON.parse(body).rows[0].elements[0].duration.value;
			var distance = JSON.parse(body).rows[0].elements[0].distance.value;
			callback(time, distance);
		}

		else
		{
			console.log(error);
		}
	});

	return;

}