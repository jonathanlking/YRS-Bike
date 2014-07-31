 
function geoLocateUser(){
	if(navigator.geolocation){
		var positionOptions = {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
          };
          navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
	}
	else {
		alert("Your browser does not support geolocation")
	}
}

function geolocationSuccess(position){
	    var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    writeAddressName(userLatLng);
	    var myOptions = {
          zoom : 16,
          center : userLatLng,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        document.getElementById("map").style.display = "block";
        var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
          // Place the marker on the map
        new google.maps.Marker({
          map: mapObject,
          position: userLatLng
        });
}

function geolocationError(positionError) {
       alert ("Error: " + positionError.message);
      }

      function writeAddressName(latLng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "location": latLng
        },
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK){
            $('.start-position').val(results[0].formatted_address);}
            else
            alert("Unable to retrieve your address");
        });
      }

 /*Click handlers*/
 $('.getLocation').click(function(){
 geoLocateUser();
});