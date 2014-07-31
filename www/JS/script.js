$("#searchButton").click(function(e){
e.preventDefault();
$.get( "/api/", function( data ) {
  alert( "Data Loaded: " + data );
});

});