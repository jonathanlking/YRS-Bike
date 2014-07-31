  var mapObject = null;
  var markers = [];

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
  				var directions = writtenDirections(data);
  				displayDirections(directions);
  				zoomMap();

  			});

  		});

  	});

  });
  
  function zoomMap(){
	  
	  var bounds = new google.maps.LatLngBounds();
	  for(i=0;i<markers.length;i++) {
		  bounds.extend(markers[i].getPosition());
	}

	mapObject.fitBounds(bounds);
  }

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
  	
  	// Make visible
  	$(".direction-list").css("display", "block");
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
  	
  	var image = new google.maps.MarkerImage("location.png", null, null, null, new google.maps.Size(32,47));

  	// Place the marker on the map
  	var marker = new google.maps.Marker(
  	{
  		map: mapObject,
  		position: userLatLng,
  		icon: image
  	});
  	
  	markers.push(marker);
  	zoomMap();
  }

  function geolocationError(positionError)
  {
  	$('#getLocation').text("There was a problem. Click to try again.");
  	console.log("Error: " + positionError.message);
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
  	
  	
  	var image = new google.maps.MarkerImage("walk.png", null, null, null, new google.maps.Size(32,47));

  	var origin = new google.maps.Marker(
  	{
  		map: mapObject,
  		position: start_position,
  		title: 'Origin',
  		icon: image
  	});
  	
  	markers.push(origin);

  	var destination = new google.maps.Marker(
  	{
  		map: mapObject,
  		position: end_position,
  		title: 'Destination',
  		icon: image
  	});
  	
  	markers.push(destination);
  	
  }

  function addPlacesToMap(places)
  {
  
  	var image = new google.maps.MarkerImage("station.png", null, null, null, new google.maps.Size(32,47));
  	
  	for (var i = 0; i < places.length; i++)
  	{
  		var place = places[i];
  		position = new google.maps.LatLng(place.latitude, place.longitude);
  		name = place.name;

  		var marker = new google.maps.Marker(
  		{
  			map: mapObject,
  			position: position,
  			title: name,
  			icon: image
  		});
  		
  		markers.push(marker);

  	}
  }
  
  function formatDateForHoursAndMinutes(date) {
	  
	  //returns a formatted string
	  var date = new Date(date);
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  return hours + ":" + minutes;
  }
  
  function formatDateForHTML(date) {
	  
	  return "<strong> Leaving at "+formatDateForHoursAndMinutes(date)+"</strong>";
  }

  function writtenDirections(data)
  {

  	// Returns an array of directions
  	
  	var places = data.stations;
  	var directionsList = [];
  	var direction = formatDateForHTML(data.start.time) + ', go to the station at ' + places[0].name + ".";
  	directionsList.push(direction);

  	for (var i = 1; i < places.length; i++)
  	{
  		var station = places[i - 1];
  		var nextStation = places[i];
  		var direction = formatDateForHTML(station.time) + ", cycle to the station at " + nextStation.name + ", this should take " + station.duration + " minutes.";
  		directionsList.push(direction);
  	}
  	
  	// This is all a bit of a bodge - really needs neatening up... 
  	
  	directionsList.push(formatDateForHTML(places[places.length-1].time) + ", walk to your final destination.");
  	directionsList.push("<strong>Arrive at " + formatDateForHoursAndMinutes(data.end.time) + "</strong>");

  	return directionsList;
  }

   /*Click handlers*/
  $('#getLocation').click(function()
  {
  	geoLocateUser();
  });