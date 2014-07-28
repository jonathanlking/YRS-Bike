var http = require('http');
var request = require('request');
var fileStream = require('fs');
var parseString = require('xml2js').parseString;

http.createServer(function (request, responce) {
  responce.writeHead(200, {'Content-Type': 'text/plain'});
  
  cacheXML();
  

  
/*
  var request = http.get("http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml", function(response) {
 
	  
  parseString(response, function (err, result) {
    console.dir(result);
	});
  
  });
*/
  
  responce.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');



var cacheXML = function () {
    
    // Download the data from TFL every 3 minutes and save to file
    
	request('http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			
			// Cache the data to file
			
			fileStream.writeFile("cache.xml", body, function(error) {
				if(error) console.log(error);
				else console.log("The file was saved!");
			}); 
			
		}
	});
    
/*
    var cache = fileStream.createWriteStream("cache.xml");
    var request = http.get("http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml", function(responce) {
		responce.pipe(cache);
		console.log(responce);
		console.log("Download complete!");
	});
*/
	
/*
	http.get("http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml", function(res) {
		
		console.log("Got response: " + res.statusCode);
		
		res.on("data", function(chunk) {
			console.log("BODY: " + chunk);
		});
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
	});
*/
	
	
	
    setTimeout(cacheXML,1000*60*3);
}