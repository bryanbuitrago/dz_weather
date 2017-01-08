$(document).ready(function() {
console.log("ready!");
//   var getWeather = function(){
//     return $.ajax({
//       method: 'GET',
//       url: '/search/:state/:city'
//     }).done(function(data){
//       // console.log(data);
//       event.preventDefault();
//     });
//   };
//   getWeather();
// });

var addAJAXFunction = function() {
     $("#skysTheLimit").click(function(event){
      console.log("dropzone");
       sendSearchData("PA/East_Stroudsburg");
       event.preventDefault();
     })
   };

addAJAXFunction();


// var addAJAXFunction = function() {
//      $('#skysTheLimit').click(function(event){
//        var dropzone = this.text();
//       console.log(dropzone);
//        getData(dropzone);
//        event.preventDefault();
//      })
//    };
// addAJAXFunction();

var sendSearchData = function(zone){
  var data = {"zone":zone}
     $.ajax({
      url: '/search',
      data: data,
      method: 'POST'
    }).done(function(data){
      // parseData(data);
      console.log(data);
    });
  };

  var deleteUser = function(){
  $('#delete').on('click', function(){
    $.ajax({
      url: '/delete',
      method: 'POST'
    }).done(function(){
      console.log('Your Account has been deleted!! Thank you for using our services!!');
    })
  });
};
deleteUser();

});

