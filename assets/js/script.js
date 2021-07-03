var cityName = $("#cityName").text;

$("#btnSave").on("click", displayValues);

function displayValues(){

  console.log(cityName);

  var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=2e370526086d5f8b1a8a2f455e36dc61";

  fetch(weatherApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });

}