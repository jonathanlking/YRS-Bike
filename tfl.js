var http = require('http');

var request = require('request');
var fileStream = require('fs');
var parseString = require('xml2js').parseString;

function degreesToRadians(degrees) {
  return degrees * (Math.PI/180)
}

http.createServer(function (request, responce) {
  responce.writeHead(200, {'Content-Type': 'text/plain'});
  
  cacheXML();
  cycleData(function(data){
  	 // The data is provided in a closure, as it is read from file.
  	 
/*
	 nearestStations (51.535630782, -0.155715844, function (stations){
		 
		 console.log(stations);
		 
	 }, 3);
*/
/*
  	 distanceToNearestStation (51.535630782, -0.155715844, function (distance) {
  	 	console.log("Distance to station is " + distance + "m");
  	 });
*/
/*
  	 docksAvailableForStation (10, function(number){
	  	 console.log(number + " docks available");
  	 });
*/
/*
  	 bikesAvailableForStation (10, function(number){
	  	 console.log(number + " bikes available");
  	 });
*/

/*
	 distanceToNearestAvailableBike (51.535630782, -0.155715844, function (distance) {
  	 	console.log("Distance to nearest available bike is " + distance + "m");
  	 });
*/
/*
	 distanceToNearestAvailableDock (51.535630782, -0.155715844, function (distance) {
  	 	console.log("Distance to nearest available dock is " + distance + "m");
  	 });
*/
  	 
  	 responce.end("Success");
  });

}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

/*----------Main Functions----------*/

function distanceToNearestStation (latitude, longitude, callback) {

	// The callback will receive the distance in metres 
	
	nearestStations(latitude, longitude, function (stations){
		
		var nearestStationIdDistancePair = stations[0];
		var distance = nearestStationIdDistancePair[Object.keys(nearestStationIdDistancePair)[0]];
		callback(distance);
	});
}

function distanceToNearestAvailableBike (latitude, longitude, callback) {

	
	// The callback will receive the distance in metres to the nearest dock where there is a bike available
	
	nearestStations(latitude, longitude, function (stations){
		
		// Loop through, until a station with available bikes is found
		var abort = false;
		for (var i=0; i<stations.length && !abort; i++) {
		
			var nearestStationIdDistancePair = stations[i];
			var stationId = Object.keys(nearestStationIdDistancePair)[0];
			
			bikesAvailableForStation (stationId, function(bikes){
				
				if (bikes > 0) {
					
					// Use this station, as there are bikes available
					var distance = nearestStationIdDistancePair[stationId];
					callback(distance);
					// Used to escape the loop
					abort = true;
				}
				
				else {
					
					// Move on to the next station
					
					// Check that you haven't run out of stations - very unlikely...
					if (i == stations.length -1) callback(-1);
				}
			});
		}
	});
}

function distanceToNearestAvailableDock (latitude, longitude, callback) {

	
	// The callback will receive the distance in metres to the nearest dock where there is a bike available
	
	nearestStations(latitude, longitude, function (stations){
		
		// Loop through, until a station with available bikes is found
		var abort = false;
		for (var i=0; i<stations.length && !abort; i++) {
		
			var nearestStationIdDistancePair = stations[i];
			var stationId = Object.keys(nearestStationIdDistancePair)[0];
			
			docksAvailableForStation (stationId, function(docks){
				
				if (docks > 0) {
					
					// Use this station, as there are bikes available
					var distance = nearestStationIdDistancePair[stationId];
					callback(distance);
					// Used to escape the loop
					abort = true;
				}
				
				else {
					
					// Move on to the next station
					
					// Check that you haven't run out of stations - very unlikely...
					if (i == stations.length -1) callback(-1);
				}
			});
		}
	});
}

function nearestStations (latitude, longitude, callback, number) {

	// The callback receives an ordered array (in increasing distance) of {id : distance}
	
	cycleData(function(data) {
		
		var distanceArray = [];
		
		for (var i=0; i<data.stations.station.length; i++) {

			// Iterate through all the stations
			var name = JSON.stringify(data.stations.station[i].name[0]);
			var id = data.stations.station[i].id[0];
			var distance = distanceFromStation (latitude, longitude, data.stations.station[i]);
			
			var object  = {};
			object[id] = distance;
			distanceArray.push(object);
			
		}
		
		var sorted = distanceArray.sort(compareDistancesOfStations);
		if (number) callback(sorted.slice(0, number));
		else callback(sorted);
		
	});
}

function nearestStationsWithAvailableBikes (latitude, longitude, callback, number) {
	
		// The callback receives an ordered array (in increasing distance) of {id : distance}
	
	cycleData(function(data) {
		
		var distanceArray = [];
		
		for (var i=0; i<data.stations.station.length; i++) {

			// Iterate through all the stations
			var name = JSON.stringify(data.stations.station[i].name[0]);
			var id = data.stations.station[i].id[0];
			
			// Ignore this station and move onto the next
			var bikes = parseInt(station.nbBikes);
			if (bikes =< 0) continue; 
			
			var distance = distanceFromStation (latitude, longitude, data.stations.station[i]);
			
			var object  = {};
			object[id] = distance;
			distanceArray.push(object);
			
		}
		
		var sorted = distanceArray.sort(compareDistancesOfStations);
		if (number) callback(sorted.slice(0, number));
		else callback(sorted);
		
	});
}

function nearestStationsWithAvailableDocks (latitude, longitude, callback, number) {
	
		// The callback receives an ordered array (in increasing distance) of {id : distance}
	
	cycleData(function(data) {
		
		var distanceArray = [];
		
		for (var i=0; i<data.stations.station.length; i++) {

			// Iterate through all the stations
			var name = JSON.stringify(data.stations.station[i].name[0]);
			var id = data.stations.station[i].id[0];
			
			// Ignore this station and move onto the next
			var docks = parseInt(station.nbEmptyDocks);
			if (docks =< 0) continue; 
			
			var distance = distanceFromStation (latitude, longitude, data.stations.station[i]);
			
			var object  = {};
			object[id] = distance;
			distanceArray.push(object);
			
		}
		
		var sorted = distanceArray.sort(compareDistancesOfStations);
		if (number) callback(sorted.slice(0, number));
		else callback(sorted);
		
	});
}

function docksAvailableForStation (id, callback) {
	
	// The callback receives the number of docks available for a station id
	
	stationForId (id, function (station){
		var docks = parseInt(station.nbEmptyDocks)
		callback(docks);
	});
}

function bikesAvailableForStation (id, callback) {
	
	// The callback receives the number of bikes available for a station id
	
	stationForId (id, function (station){
		var bikes = parseInt(station.nbBikes);
		callback(bikes);
	});
}

/*----------*-----------*/

/*----------Helper Functions----------*/



function distanceFromStation (latitude, longitude, station) {
	
	// Takes station object
	
	var string = JSON.stringify(station);
	var station_latitude = station.lat[0];
	var station_longitude = station.long[0];
	var distance = distanceBetweenCoordinates (latitude, longitude, station_latitude, station_longitude);
	return distance;
}

function stationForId (id, callback) {
	
	// The callack takes the returned station objects id as its single parameter
	
	cycleData (function(data) {
		
		var array = data.stations.station;
		for (var i = 0, len = array.length; i < len; i++) {
			
			if (array[i].id == id) {
				
/* 				console.log("Found at index " + i); */
				callback(array[i]);
				break;
			}
			
		}	
		
	});
}

function compareDistancesOfStations(a,b) {
	
	// Get the key id for a and then find the associated value, the distance.
	distance_a = a[Object.keys(a)[0]];
	distance_b = b[Object.keys(b)[0]];
	
	if (distance_a < distance_b) return -1;
    if (distance_a > distance_b) return 1;
    return 0;
}

function distanceBetweenCoordinates (latitude_1,longitude_1,latitude_2,longitude_2) {
	
	var radius = 6371000; // *mean* radius of the earth in metres
	var deltaLatitude = degreesToRadians(latitude_2-latitude_1);
	var deltaLongitude = degreesToRadians(longitude_2-longitude_1);
	
	// Using the Haversine formula
	
	var a = Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2) + Math.cos(degreesToRadians(latitude_1)) * Math.cos(degreesToRadians(latitude_2)) * Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2)
	var b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return Math.round(radius * b); // Distance in metres, rounded to the nearest metre
}


// To save loading from file every time, we load into this variable.
var loadedData;

function cycleData (callback) {

	if (loadedData) {
		
		callback(loadedData);
	} 
	else {	
	 
		// Load from file
		
		fileStream.readFile('cache.xml', 'utf8', function (error,file) {
			if (error) console.log(error);
			else {
				
				// Read the cached data, convert it to json and return it.
				
				parseString(file, function (error, result) {
					loadedData = result;
					callback(loadedData);
				}); 
				
			}
		});
	}	
}

function cacheXML() {
    
    // Download the data from TFL every 3 minutes and save to file
    
	request('http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml', function (error, response, body) {
		if (!error && response.statusCode == 200) {
		
			console.log("File downloaded.");
			
			// Cache the data to file
			
			fileStream.writeFile('cache.xml', body, function(error) {
				if(error) console.log(error);
				else console.log("File cached.");
				loadedData = null;
			});
			
		}
	});
    
    setTimeout(cacheXML,1000*3*60);
}