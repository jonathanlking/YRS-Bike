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
  	 
  	 var distance = distanceBetweenCoordinates (51.535630782,-0.155715844,51.500645178,-0.124572515);
  	 
  	 console.log(data.stations.$.lastUpdate);
  	 responce.end("Distance from London Zoo to Big Ben is " + distance + "m"); 
  });

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');



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