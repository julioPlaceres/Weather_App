// HTML ELemnets 
var formEl = $("#weatherForm")
var cityNameEl = $('input[name="city-name"]');
var displayBtn = $("#displayBtn");
var displayAreaEl = $("#displayResults");
var clearBtn = $(".clearBtn");
var historyDiv = $("#historyBtns");
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



displayMyList();

// Event listeners
displayBtn.on("click", makeApiCalls);
clearBtn.on("click", clearList);
historyDiv.on("click", displayTarget);

function displayTarget(event){
  var cityClicked = event.target.innerHTML;
  getCordinates(cityClicked);
}

function clearList() {
  if (weatherHistory.length > 0) {
    localStorage.removeItem("cityName");
    location.reload();
  }
}

// Makes all api calls
function makeApiCalls(event) {
  event.preventDefault();

  getCordinates(cityNameEl.val());
}

function displayMyList() {
  weatherHistory = JSON.parse(localStorage.getItem("cityName")) || [];
  console.log(weatherHistory);
  $("#historyBtns").text("");
  if (weatherHistory.length > 0) {
    for (let i = 0; i < weatherHistory.length; i++) {
      console.log("Index: " + i);
      addName(weatherHistory[i]);
    }
  }
}

function addName(cityName) {
  var btn = $("<button>").text(cityName);
  btn.attr("class", "btn btn-secondary my-2");
  $("#historyBtns").append(btn);
  console.log(cityName);
}


// Retrieve some of the data based on city name 
// also get latitued and longitude needed for the next query
function getCordinates(searchInput) {

  let weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
    + searchInput + "&appid=" + apiKey + "&units=imperial";

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

          // Clear all cards before appending new ones
          $(".forecast").html("");

          // Create Card row - add attributes and append it to the card container
          card = $(".forecast");
          var cardRow = $("<div>").attr("class", "row text-center");
          card.append(cardRow);

          $(data2.daily).each(function (element) {
            if (element == 5) { return false }

            // Date & Time
            let dt = data2.daily[element].dt
            dt = new Date(dt * 1000);
            dt = moment(dt, "MM/DD/YYYY").format("(MM/DD/YYYY)");

            // Get icon code
            let iconCode = data2.daily[element].weather[0].icon;

            // concadenate it to the url
            let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

            let temp2 = data2.daily[element].temp.day;
            let wind2 = data2.daily[element].wind_speed;
            let humidity2 = data2.daily[element].humidity;

            let cardDay = $("<div>").attr("class", "col-md card ms-3 w-auto");
            let dateEl = $("<div>").text(dt);
            let tempEl = $("<div>").text("Temp: " + temp2);
            let windEl = $("<div>").text("Wind: " + wind2);
            let humidityEl = $("<div>").text("Humidity: " + humidity2);
            let weatherIcon = $("<div>").attr("id", "icon");
            let imageIcon = $("<img>");
            imageIcon.attr("id", "weatherIcon");
            imageIcon.attr("src", iconUrl);
            imageIcon.attr("alt", "Weather Icon");
            imageIcon.attr("width", "50px");

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