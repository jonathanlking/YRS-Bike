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
  	 nearestStation (51.535630782, -0.155715844, null);
  	 responce.end("Success");
  });

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

function nearestStation (latitude, longitude, callback) {
	
	cycleData (function(data) {
		
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
		
		distanceArray.sort(compareDistancesOfStations);
		var station = distanceArray[0]
		console.log(distanceArray);
		
	});
}

function distanceFromStation (latitude, longitude, station) {
	
	// Takes station object
	
	var string = JSON.stringify(station);
	var station_latitude = station.lat[0];
	var station_longitude = station.long[0];
	var distance = distanceBetweenCoordinates (latitude, longitude, station_latitude, station_longitude);
	return distance;
}

function stationForId (id, callback) {
	
	// The callack takes the returned station objects as its single parameter
	
	cycleData (function(data) {
		
		var station = data.stations.station[id-1];
		if (station.id[0] != id) throw "The bodge to find the station didn't work :("; 
		callback(station);
		
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

function cycleData (callback) {
	
	// Read the cached data
	
	fileStream.readFile('cache.xml', 'utf8', function (error,file) {
		if (error) console.log(error);
		else {
			
			// Read the cached data, convert it to json and return it.
			
			parseString(file, function (error, result) {
				callback(result);
			}); 
			
		}
	});
	
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
			});
			
		}
	});
    
    setTimeout(cacheXML,1000*60*3);
}