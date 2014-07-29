var http = require('http');

var request = require('request');
var fileStream = require('fs');
var parseString = require('xml2js').parseString;

http.createServer(function (request, responce) {
  responce.writeHead(200, {'Content-Type': 'text/plain'});
  
  cacheXML();
  cycleData(function(data){
  	 // The data is provided in a closure, as it is read from file.
  	 
  	 console.log(data.stations.$.lastUpdate);
  	 responce.end("Working fine."); 
  });

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

function cycleData(callback) {
	
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