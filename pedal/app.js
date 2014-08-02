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
					var endStationObject = JSON.parse(data)[0];
					console.log(endStationObject);
					var endStationLocation = {
						latitude: endStationObject.latitude,
						longitude: endStationObject.longitude
					};
					var endStation = {
						id: endStationObject.id,
						name: endStationObject.name,
						latitude: endStationLocation.latitude,
						longitude: endStationLocation.longitude,
						duration: 0,
					};

					timeFromTo(startStationLocation, endStationLocation, 'bicycling', function(time, distance)
					{

						// The time from the start station to the end station
						// If the time between stations is greater than 30 minutes, use another station in between them
						
						var timeAtEndStation = new Date(timeAtFirstStation.getTime() + (time * 1000));
						endStation.time = timeAtEndStation;
						
						if (time > 30 * 60)
						{

							// Do some linear interpolation stuff
							// You know the distance from the start to the end
							// You know the time from the start to the end
							// You can therefore guess the distace at 30 minutes
							// The guess distance
							var ratio = ((30 * 60) / time);
							// Guess the coordinates
							var d_lat = parseFloat(endStationLocation.latitude) - parseFloat(startStation.latitude);
							var d_long = parseFloat(endStationLocation.longitude) - parseFloat(startStation.longitude);

							var guessLat = parseFloat(startStation.latitude) + ratio * d_lat;
							var guessLong = parseFloat(startStation.longitude) + ratio * d_long;

							nearestStationTo(guessLat, guessLong, function(station)
							{

								// The nearest station
								var middleStation = JSON.parse(station)[0];
								console.log(middleStation);

								var middleStationLocation = {
									latitude: middleStation.latitude,
									longitude: middleStation.longitude
								};

								console.log("Actual - Lat: " + middleStationLocation.latitude + " Long: " + middleStationLocation.longitude);
								timeFromTo(startStationLocation, middleStationLocation, "bicycling", function(time, distance)
								{

									console.log("Actual time: " + time);

									// We now have the middle station and the time it takes to get there 
									// We now need the time from this station to the end station
									// We can now finish the first station object
									firstStation.duration = time / 60;
									
									var timeAtMiddle = new Date(timeAtFirstStation.getTime() + (time * 1000));
									middleStation.time = timeAtMiddle;
									
									firstStation.distance = distance;
									stations.push(firstStation);


									timeFromTo(middleStationLocation, endStationLocation, 'bicycling', function(time, distance)
									{

										console.log("Time from middle to end station: " + time);

										middleStation.duration = time / 60;
										middleStation.distance = distance;
										stations.push(middleStation);

										timeFromTo(endStationObject, end, 'walking', function(time, distance)
										{

											// Get walking time from the station to the destination
											
											endStation.distance = distance;
											endStation.duration = time/60;
											
											var timeAtEnd = new Date(timeAtEndStation.getTime() + (time * 1000));
											end.time = timeAtEnd;

											
											stations.push(endStation);
											responce_data.stations = stations;
											responce_data.end = end;
	
											responce.send(JSON.stringify(responce_data));
										});

									});

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
	console.log(requestString);
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