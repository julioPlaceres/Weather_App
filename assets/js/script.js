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
}

// Retrieve some of the data based on city name 
// also get latitued and longitude needed for the next query
function getCordinates() {

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

      // Create a section for the header of the data
      var weatherHeader = $("<div>");
      weatherHeader.attr("class", "row h3 ml-1"); // Need to center this
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

      // Create an element for the content
      var displayData = $("<div>");
      displayData.attr("class", "col");

      // Create text elements and add text
      var temp = $("<p>");
      temp.text("Temp: " + weather.temp);
      var wind = $("<p>");
      wind.text("Wind: " + weather.wind);
      var humidity = $("<p>");
      humidity.text("Humidity: " + weather.humidity);

      // Clear Weather Header
      $("#displayResults").html("");

      // Append elements to the DOM
      weatherHeader.append(cityNameText);
      weatherHeader.append(weatherIcon);
      weatherIcon.append(imageIcon);
      displayAreaEl.append(weatherHeader);
      displayAreaEl.append(displayData);
      displayData.append(temp);
      displayData.append(wind);
      displayData.append(humidity);

      //===========================================================================================

      let weatherApiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?" +
        "lat=" + weather.latitude + "&lon=" + weather.longitude + "&exclude=" + "hourly" + "&units=imperial" + "&appid=" + apiKey

      fetch(weatherApiUrl2)
        .then(function (response2) {
          if (!response2.ok) {
            // TODO: complete this later by adding html with error handling
            console.error(response2.status);
            return;
          }
          return response2.json();
        })
        .then(function (data2) {
          //console.log(data2);
          //console.log(data2.daily);

          // Clear all cards before appending new ones
          $(".card").html("");

          $(data2.daily).each(function (element) {
            if (element == 5) { return false }

            // Date & Time
            var dt = data2.daily[element].dt
            dt = new Date(dt * 1000);
            dt = moment(dt, "MM/DD/YYYY").format("(MM/DD/YYYY)");

            // Get icon code
            var iconCode2 = data2.daily[element].weather[0].icon;
            // concadenate it to the url
            var iconUrl = "http://openweathermap.org/img/wn/" + iconCode2 + "@2x.png";

            var temp2 = data2.daily[element].temp.day;
            var wind2 = data2.daily[element].wind_speed;
            var humidity2 = data2.daily[element].humidity;

            // console.log(dt);
            // console.log(iconUrl);
            // console.log(temp2);
            // console.log(wind2);
            // console.log(humidity2);

            var cardDay = $("<div>").attr("class", "card-body");
            var cardTitle = $("<h5>").attr("class", "card-title");
            var cardText = $("<p>").attr("class", "card-text");

            cardTitle.text(dt);
            // Add icon
            cardText.text("Temp: " + temp2 + " Wind: " + wind2 + " Humidity: " + humidity2);

            card = $(".card");
            card.append(cardDay);
            cardDay.append(cardTitle);
            cardDay.append(cardText);

          });
        });
    });
}