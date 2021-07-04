// HTML ELemnets 
var formEl = $("#weatherForm")
var cityNameEl = $('input[name="city-name"]');
var displayBtn = $("#displayBtn");

// Object that will storage all data for the dashboard
var weather = {
  city: "",
  temp: "",
  wind: "",
  humidity: "",
  latitude: "",
  longitude: ""
}

// Event listeners
displayBtn.on("click", makeApiCalls);

// Makes all api calls
function makeApiCalls(event){
  event.preventDefault();

  getCordinates();
  // getDataByCordinates();
}

// Retrieve some of the data based on city name 
// also get latitued and longitude needed for the next query
function getCordinates() {
  // event.preventDefault();

  let weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
    + cityNameEl.val() + "&appid=" + apiKey +"&units=imperial";

  fetch(weatherApiUrl)
    .then(function (response) {
      if(!response.ok){
        // TODO: complete this later by adding html with error handling
        console.error(response.status);
        return;
      }
      return response.json();
    })
    .then(function (data) {
      weather.city = data.name;
      weather.temp = data.main.temp + " °F";
      weather.wind = data.wind.speed + " MPH";
      weather.humidity = data.main.humidity + " %";
      weather.latitude = data.coord.lat;
      weather.longitude = data.coord.lon;
      console.log(weather);
    });
}