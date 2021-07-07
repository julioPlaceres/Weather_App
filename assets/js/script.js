// HTML ELemnets 
// var formEl = $("#weatherForm")
var cityNameEl = $('input[name="city-name"]');
var displayBtn = $("#displayBtn");
var displayAreaEl = $("#displayResults");
var clearBtn = $(".clearBtn");
var historyBtn = $("#historyBtns");
var weatherHistory = [];

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
displayBtn.on("click", makeApiCalls);  // Starts when user clicks on search 
clearBtn.on("click", clearList);       // Starts when user click to clear search history
historyBtn.on("click", displayTarget); // Start when user click buttons from previous buttons

// Initiates when page loads and display the list of history searched saved
// in the local storage
displayMyList();

function displayMyList() {
  weatherHistory = JSON.parse(localStorage.getItem("cityName")) || [];
  // Clear content to avoid duplication
  $("#historyBtns").text("");
  // Check if there's data saved, if there's will loop through items
  // and call function add name to create buttons for each
  if (weatherHistory.length > 0) {
    for (let i = 0; i < weatherHistory.length; i++) {
      addName(weatherHistory[i]);
    }
  }
}

function addName(cityName) {
  // Creates button and adds the city name as text
  var btn = $("<button>").text(cityName);
  // Set some properties for styling
  btn.attr("class", "btn btn-secondary my-2");
  // Append button to the page
  $("#historyBtns").append(btn);
}

// When user click on searched history buttons will trigger API calls based on 
// the value specifed on the target text
function displayTarget(event) {
  var cityClicked = event.target.innerHTML;
  getCityData(cityClicked);
}

// Clear the search history
function clearList() {
  if (weatherHistory.length > 0) {
    localStorage.removeItem("cityName");
    location.reload();
  }
}

// Will make the necesary API calls, sort and assign data to the proper fields 
function makeApiCalls(event) {
  event.preventDefault();

  if (displayBtn.val() == null) { return; }

  getCityData(cityNameEl.val());
}

// Retrieve some of the data based on city name 
// also get latitued and longitude needed for the next query
function getCityData(searchInput) {

  let weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
    + searchInput + "&appid=" + apiKey + "&units=imperial";

  fetch(weatherApiUrl)
    .then(function (response) {
      // Checks if there's any error and display to the page
      if (!response.ok) {
        let error = $(".errorHandling");
        let errorDescription = $("<div>").text(response.status + " " + response.statusText);
        error.append(errorDescription);
        return;
      }
      $(".errorHandling").text("");
      return response.json();
    })
    .then(function (data) {
      // Assign values from response to object properties
      weather.city = data.name;
      weather.temp = data.main.temp + " °F";
      weather.wind = data.wind.speed + " MPH";
      weather.humidity = data.main.humidity + " %";
      weather.latitude = data.coord.lat;
      weather.longitude = data.coord.lon;

      // Create a section for the header of the data
      let weatherHeader = $("<div>");
      weatherHeader.attr("class", "h3");

      // Create City Name and Time element
      let cityNameText = $("<div>");
      // Asign it some text
      cityNameText.text(weather.city + moment().format(" (MM/DD/YYYY) "));

      // Get icon code
      let iconCode = data.weather[0].icon;
      // concadenate it to the url
      let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"

      // Create icon element
      let weatherIcon = $("<div>");
      // Set ID for Weather Icon
      weatherIcon.attr("id", "icon");
      // Create Image inside the weather Icon Div
      let imageIcon = $("<img>");
      // Set properties for Image Icon
      imageIcon.attr("id", "weatherIcon");
      imageIcon.attr("src", iconUrl);
      imageIcon.attr("alt", "Weather Icon");
      imageIcon.attr("width", "50px");

      // Create an element for the content
      let displayData = $("<div>");
      displayData.attr("class", "py-1");

      // Create text elements and add text
      let temp = $("<p>");
      temp.text("Temp: " + weather.temp);
      let wind = $("<p>");
      wind.text("Wind: " + weather.wind);
      let humidity = $("<p>");
      humidity.text("Humidity: " + weather.humidity);

      // Create buttons
      let cityList = $("#cityList");
      let cityBtn = $("<button>");
      cityBtn.text(weather.city);
      cityBtn.attr("class", "cityBtn");

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
      cityList.append(cityBtn);

      //Save Data to local storage
      if (weatherHistory.indexOf(weather.city) == -1) {
        weatherHistory.push(weather.city);
        localStorage.setItem("cityName", JSON.stringify(weatherHistory)) || [];
        displayMyList(weather.city);
      }

      // Start Forecast Data API call
      //===========================================================================================

      let forecastApiUrl = "https://api.openweathermap.org/data/2.5/onecall?" +
        "lat=" + weather.latitude + "&lon=" + weather.longitude + "&exclude=" + "hourly" + "&units=imperial" + "&appid=" + apiKey

      fetch(forecastApiUrl)
        .then(function (forecastResponse) {
          if (!forecastResponse.ok) {
            var error = $(".errorHandling");
            var errorDescription = $("<div>").text(response.status + " " + response.statusText);
            error.append(errorDescription);
            return;
          }
          $(".errorHandling").text("");
          return forecastResponse.json();
        })
        .then(function (forecastData) {

          // create uv index element and assign the uv index value to it
          let uvIndex = $("<button>");
          uvIndex.text("uv Index: : " + forecastData.current.uvi);

          // If statements for the color of the uv Index
          let uv = forecastData.current.uvi;
          if (uv <= 2) {
            uvIndex.attr("class", "btn bg-success");
          }

          if (uv > 2 && uv < 8) {
            uvIndex.attr("class", "btn bg-warning");
          }

          if (uv > 7 && uv < 11) {
            uvIndex.attr("class", "btn bg-danger");
          }

          // Appends uv Index to page
          displayAreaEl.append(uvIndex);

          // Clear all cards before appending new ones
          $(".forecast").html("");

          // Create Card row - add attributes and append it to the card container
          card = $(".forecast");
          var cardRow = $("<div>").attr("class", "row text-center");
          card.append(cardRow);

          $(forecastData.daily).each(function (element) {
            if (element == 5) { return false }

            // Date & Time
            let dt = forecastData.daily[element].dt
            dt = new Date(dt * 1000);
            dt = moment(dt, "MM/DD/YYYY").format("(MM/DD/YYYY)");

            // Get icon code
            let iconCode = forecastData.daily[element].weather[0].icon;

            // concadenate it to the url
            let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

            // Gets All data for the forcast
            let forecastTemp = forecastData.daily[element].temp.day;
            let forecastWind = forecastData.daily[element].wind_speed;
            let forecastHumidity = forecastData.daily[element].humidity;

            // Create elements and assign values to it
            let cardDay = $("<div>").attr("class", "col-md card ms-3 w-auto");
            let dateEl = $("<div>").text(dt);
            let tempEl = $("<div>").text("Temp: " + forecastTemp);
            let windEl = $("<div>").text("Wind: " + forecastWind);
            let humidityEl = $("<div>").text("Humidity: " + forecastHumidity);
            let weatherIcon = $("<div>").attr("id", "icon");
            let imageIcon = $("<img>");
            imageIcon.attr("id", "weatherIcon");
            imageIcon.attr("src", iconUrl);
            imageIcon.attr("alt", "Weather Icon");
            imageIcon.attr("width", "50px");

            // Append created elements to the page
            cardRow.append(cardDay);
            cardDay.append(dateEl);
            weatherIcon.append(imageIcon);
            cardDay.append(weatherIcon);
            cardDay.append(tempEl);
            cardDay.append(windEl);
            cardDay.append(humidityEl);
          });
        });
    });
}