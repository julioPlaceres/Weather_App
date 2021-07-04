// HTML ELemnets 
var formEl = $("#weatherForm")
var cityNameEl = $('input[name="city-name"]');
var displayBtn = $("#displayBtn");
var displayAreaEl = $("#displayResults");

// Object that will storage all data for the dashboard
var weather = {
  city: "",
  icon: "",
  temp: "",
  wind: "",
  humidity: "",
  latitude: "",
  longitude: ""
}

// Event listeners
displayBtn.on("click", makeApiCalls);

// Makes all api calls
function makeApiCalls(event) {
  event.preventDefault();

  getCordinates();
  // getDataByCordinates();
}

// Retrieve some of the data based on city name 
// also get latitued and longitude needed for the next query
function getCordinates() {
  // event.preventDefault();

  let weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
    + cityNameEl.val() + "&appid=" + apiKey + "&units=imperial";

  fetch(weatherApiUrl)
    .then(function (response) {
      if (!response.ok) {
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
      console.log(data);

      // Create a section for the header of the data
      var weatherHeader = $("<div>"); 
      weatherHeader.attr("class", "row"); // Need to center this
      weatherHeader.attr("id", "headerRow");

      // Create City Name and Time element
      var cityNameText = $("<div>");
      // Asign it some text
      cityNameText.text(weather.city + moment().format(" (MM/DD/YYYY) "));

      // Get icon code
      let iconCode = data.weather[0].icon;
      // concadenate it to the url
      let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"

      // Create icon element
      var weatherIcon = $("<div>");
      // Set ID for Weather Icon
      weatherIcon.attr("id", "icon");
      weatherIcon.attr("display", "flex");
      // Create Image inside the weather Icon Div
      var imageIcon = $("<img>");
      // Set properties for Image Icon
      imageIcon.attr("id", "weatherIcon");
      imageIcon.attr("src", iconUrl);
      imageIcon.attr("alt", "Weather Icon");
      imageIcon.attr("width", "50px");

      // Append elements to the DOM
      weatherHeader.append(cityNameText);
      weatherHeader.append(weatherIcon);
      weatherIcon.append(imageIcon);
      displayAreaEl.append(weatherHeader);
    });
}