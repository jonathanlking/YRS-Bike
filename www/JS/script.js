  $("#searchButton").click(function(event)
  {

  	// When the search button is pressed
  	// Cancel the request
  	event.preventDefault();

  	// Get the start location and the end location into strings
  	var start = $('#start-position').val();
  	var end = $('#end-position').val();

  	if (start.length == 0 || end.length == 0)
  	{

  		alert("Missing locations");
  		return;
  	}

  	// Use the google API to geocode the places
  	addressForlocation(start, function(start_address)
  	{
  		$('#start-position').val(start_address.name);

  		addressForlocation(end, function(end_address)
  		{
  			$('#end-position').val(end_address.name);

  			// Now create the URL for the request
  			var url = "/api/?from_latitude=" + start_address.latitude + "&from_longitude=" + start_address.longitude + "&to_latitude=" + end_address.latitude + "&to_longitude=" + end_address.longitude;

  			$.get(url, function(data)
  			{
	  			alert(data);
  			});

  		});

  	});

  	// Start with the start position

/*

 	$.get("/api/", function(data)
 	{
 		var parsed = JSON.parse(data);
 		addPlacesToMap(parsed.stations);
 		addStartEndToMap(parsed.start, parsed.end);
 		var directions = writtenDirections (parsed.stations);
 		for (var i = 0; i < directions.length; i++) {
	 	$('#directions').append('<li> '+ directions[i] +'</li>');	
 		}
 	});
*/

  });

  function addressForlocation(location, callback)
  {

  	// Callback with the longitude, latitude and name for a given address.
  	$.get("http://maps.google.com/maps/api/geocode/json", {
  		'address': location,
  		sensor: "false"
  	}).done(function(data)
  	{

  		var address = {
  			'latitude': data.results[0].geometry.location.lat,
  			'longitude': data.results[0].geometry.location.lng,
  			'name': data.results[0].formatted_address
  		};

  		callback(address);
  	});

  }


  var mapObject = null;

  function geoLocateUser()
  {
  	if (navigator.geolocation)
  	{
  		var positionOptions = {
  			enableHighAccuracy: true,
  			timeout: 10 * 1000 // 10 seconds
  		};
  		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
  	}
  	else
  	{
  		alert("Your browser does not support geolocation")
  	}
  }

  function geolocationSuccess(position)
  {
  	var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  	writeAddressName(userLatLng);
  	var myOptions = {
  		zoom: 16,
  		center: userLatLng,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
  	};

  	document.getElementById("map").style.display = "block";
  	mapObject = new google.maps.Map(document.getElementById("map"), myOptions);


  	var image = 'logo.png';

  	// Place the marker on the map
  	new google.maps.Marker(
  	{
  		map: mapObject,
  		position: userLatLng,
  		icon: image
  	});
  }

  function geolocationError(positionError)
  {
  	alert("Error: " + positionError.message);
  }

  function writeAddressName(latLng)
  {
  	var geocoder = new google.maps.Geocoder();
  	geocoder.geocode(
  	{
  		"location": latLng
  	}, function(results, status)
  	{
  		if (status == google.maps.GeocoderStatus.OK)
  		{
  			$('.start-position').val(results[0].formatted_address);
  		}
  		else alert("Unable to retrieve your address");
  	});
  }

  function addStartEndToMap(start, end)
  {

  	start_position = new google.maps.LatLng(start.latitude, start.longitude);
  	end_position = new google.maps.LatLng(end.latitude, end.longitude);

  	new google.maps.Marker(
  	{
  		map: mapObject,
  		position: start_position,
  		title: 'Origin'
  	});

  	new google.maps.Marker(
  	{
  		map: mapObject,
  		position: end_position,
  		title: 'Destination'
  	});
  }

  function addPlacesToMap(places)
  {
  	for (var i = 0; i < places.length; i++)
  	{
  		var place = places[i];
  		position = new google.maps.LatLng(place.latitude, place.longitude);
  		name = place.name;

  		new google.maps.Marker(
  		{
  			map: mapObject,
  			position: position,
  			title: name
  		});

  	}
  }

  function writtenDirections(places)
  {

  	// Returns an array of directions
  	var directionsList = [];
  	var direction = 'Go to the station at ' + places[0].name;
  	directionsList.push(direction);

  	for (var i = 1; i < places.length; i++)
  	{
  		var station = places[i - 1];
  		var nextStation = places[i];
  		var direction = "Cycle to the station at " + nextStation.name + " - this should take " + station.duration + " minutes.";
  		directionsList.push(direction);
  	}

  	return directionsList;
  }

   /*Click handlers*/
  $('.getLocation').click(function()
  {
  	geoLocateUser();
  });