$("#searchButton").click(function(){

var jqxhr = $.get( "pedal.jlk.co", function() {
  alert( "success" );
})
  .done(function() {
    alert( "second success" );
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
    alert( "finished" );
  });

});