  var mapObject = null;

  setupMap();

  $("#searchButton").click(function(event)
  {
  	console.log("click");
  	event.stopPropagation();

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

  			$.get(url, function(json)
  			{
  				var data = JSON.parse(json);

  				// Handle the returned data and use it to update the website.
  				// Display the map
  				/* document.getElementById("map").style.display = "block"; */

  				addPlacesToMap(data.stations);
  				addStartEndToMap(data.start, data.end);
  				var directions = writtenDirections(data.stations);
  				displayDirections(directions);

  			});

  		});

  	});

  });

  function setupMap()
  {
	  document.getElementById("map").style.display = "block";
  	london = new google.maps.LatLng(51.5073509, -0.127758299);

  	var myOptions = {
  		zoom: 13,
  		center: london,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
  	}

  	mapObject = new google.maps.Map(document.getElementById("map"), myOptions);

  }

  function displayDirections(directions)
  {

  	// Clear any previous directions
  	$('#directions').empty();

  	// Write the new ones
  	for (var i = 0; i < directions.length; i++)
  	{
  		$('#directions').append('<li> ' + directions[i] + '</li>');
  	}
  }

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

  function geoLocateUser()
  {
  	if (navigator.geolocation)
  	{
  	
  		$('#getLocation').text("Determining location");
  		var positionOptions = {
  			enableHighAccuracy: true,
  			timeout: 10 * 1000 // 10 seconds
  		};
  		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
  	}
  	else
  	{
  		 $('#getLocation').text("Your browser does not support geolocation");
  	}
  }

  function geolocationSuccess(position)
  {
  	var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  	writeAddressName(userLatLng);

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
  			$('#start-position').val(results[0].formatted_address);
  			$('#getLocation').text("Get your location");
  		}
  		else $('#getLocation').text("Unable to retrieve your address");
  	});
  }

  function addStartEndToMap(start, end)
  {

  	start_position = new google.maps.LatLng(start.latitude, start.longitude);
  	end_position = new google.maps.LatLng(end.latitude, end.longitude);
  	
  	console.log(start_position);
  	console.log(end_position);
  	
  	
  	var image = 'walk.png';

  	new google.maps.Marker(
  	{
  		map: mapObject,
  		position: start_position,
  		title: 'Origin',
  		icon: image
  	});

  	new google.maps.Marker(
  	{
  		map: mapObject,
  		position: end_position,
  		title: 'Destination',
  		icon: image
  	});
  }

  function addPlacesToMap(places)
  {
  
  	var image = 'station.png';
  	
  	for (var i = 0; i < places.length; i++)
  	{
  		var place = places[i];
  		position = new google.maps.LatLng(place.latitude, place.longitude);
  		name = place.name;

  		new google.maps.Marker(
  		{
  			map: mapObject,
  			position: position,
  			title: name,
  			icon: image
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
  $('#getLocation').click(function()
  {
  	geoLocateUser();
  });