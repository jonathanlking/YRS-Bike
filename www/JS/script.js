$("#searchButton").click(function(e){
e.preventDefault();
$.get( "test.txt", function( data ) {
  alert( "Data Loaded: " + data );
});

});