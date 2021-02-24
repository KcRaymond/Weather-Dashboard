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
