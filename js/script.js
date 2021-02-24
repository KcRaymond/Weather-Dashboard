$("#section").hide();
var m = moment().format("L");
var $cityName = $("#city-name");
var $cityTemp = $("#temperature");
var $cityHumid = $("#humidity");
var $cityWind = $("#wind-speed");
var $cityUV = $("#uv-index");
var $weatherIcon = $("#weather-icon");
var cityArray = [];
var cityLat = "";
var cityLon = "";
var historyEl = $("#history");
var historyItem = JSON.parse(localStorage.getItem("userInput"));

//Search Button
$("#search-button").click(function () {
  $("#section").show();
  var userInput = $("#city-input").val();
  if (localStorage.getItem("userInput") !== null) {
    cityArray = JSON.parse(localStorage.getItem("userInput"));
  }
  cityArray.push(userInput);
  localStorage.setItem("userInput", JSON.stringify(cityArray));
  getWeather(userInput);
  newHistory();
});

//Current Weather API Call
function getWeather(city) {
  $("#city-name").empty();
  $("#temperature").empty();
  $("#humidity").empty();
  $("#wind-speed").empty();
  $("#weather-icon").empty();
  $.ajax({
    type: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&APPID=1e3ad008e239358d0ab3741145b4b149",
    success: function (cityJSON) {
      var getFiveDayIcon = cityJSON.weather[0].icon;
      fiveDayIcon =
        "https://openweathermap.org/img/wn/" + getFiveDayIcon + "@2x.png";
      $cityName.append(
        "<h1>" +
          cityJSON.name +
          " " +
          "&#40;" +
          m +
          "&#41;" +
          "<img src=" +
          fiveDayIcon +
          ">" +
          "</h1>"
      );
      $cityTemp.append("<b>Temperature: </b>", cityJSON.main.temp, " &deg;F");
      $cityHumid.append("<b>Humidity: </b>", cityJSON.main.humidity, "%");
      $cityWind.append("<b>Wind Speed: </b>", cityJSON.wind.speed, " MPH");
      var cityLat = cityJSON.coord.lat;
      var cityLon = cityJSON.coord.lon;
      getUV(cityLat, cityLon);
      getFiveDay(cityLat, cityLon);
    },
  });
}

// UV Index API Call
function getUV(lat, lon) {
  $("span").empty();
  $.ajax({
    type: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&APPID=1e3ad008e239358d0ab3741145b4b149",
    success: function (uvJSON) {
      $("#uv-index").append("<b>UV Index:</b>");
      $("#uv-number").append(" " + uvJSON.value);
      if (uvJSON.value >= 0 && uvJSON.value <= 2) {
        $("#uv-number").attr("style", "background-color:green; color: white");
      } else if (uvJSON.value >= 2 && uvJSON.value <= 5) {
        $("#uv-number").attr("style", "background-color:#ff8c00; color: white");
      } else {
        $("#uv-number").attr("style", "background-color:red; color: white");
      }
    },
  });
}

// 5-Day Forecast API Call
function getFiveDay(lat, lon) {
  $("#forecast1").empty();
  $("#forecast2").empty();
  $("#forecast3").empty();
  $("#forecast4").empty();
  $("#forecast5").empty();
  $.ajax({
    type: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,current,hourly,alerts&units=imperial&appid=1e3ad008e239358d0ab3741145b4b149",
    success: function (fiveJSON) {
      for (var i = 0; i < 6; i++) {
        var getFiveDayIcon = fiveJSON.daily[i].weather[0].icon;
        fiveDayIcon =
          "https://openweathermap.org/img/wn/" + getFiveDayIcon + "@2x.png";
        var time = fiveJSON.daily[i].dt;
        var newTime = moment.unix(time).format("MM/DD/YYYY");
        $("#forecast" + [i]).append(newTime);
        $("#forecast" + [i]).append("<img src=" + fiveDayIcon + ">");
        $("#forecast" + [i]).append(
          "Temp: " + fiveJSON.daily[i].temp.day + " &deg;F" + "<br>"
        );
        $("#forecast" + [i]).append(
          "Humidity: " + fiveJSON.daily[i].humidity + "%"
        );
      }
    },
  });
}

//Shows search history list group on refresh or is empty on first visit
function showHistory() {
  var historyItem = JSON.parse(localStorage.getItem("userInput"));
  historyEl.innerHTML = "";
  if (historyItem !== null) {
    for (i = 0; i < historyItem.length; i++) {
      var searchItem = document.createElement("input");
      searchItem.setAttribute("type", " text");
      searchItem.setAttribute("readonly", "true");
      searchItem.setAttribute("class", "form-control d-block bg-white");
      searchItem.setAttribute("value", historyItem[i]);
      searchItem.addEventListener("click", function () {
        getWeather(searchItem.value);
      });
      historyEl.append(searchItem);
    }
  }
}

showHistory();

//Shows search history list group as the user searches for cities
function newHistory() {
  var historyItem = JSON.parse(
    localStorage.getItem(localStorage.key("userInput"))
  );
  if (historyItem !== null) {
    var searchItem = document.createElement("input");
    searchItem.setAttribute("type", " text");
    searchItem.setAttribute("readonly", "true");
    searchItem.setAttribute("class", "form-control d-block bg-white");
    searchItem.setAttribute("value", historyItem[historyItem.length - 1]);
    searchItem.addEventListener("click", function () {
      getWeather(searchItem.value);
    });
    historyEl.append(searchItem);
  }
}
