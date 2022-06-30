//variable declaration
let formSearch = document.querySelector(".input-group");
let cityValue = document.querySelector("#cityValue");
let input = formSearch.querySelector(".form-control");
let dateValue = document.querySelector("#dayValue");
let tempValue = document.querySelector("#tempValue");
let sunriseValue = document.querySelector("#sunrise");
let sunsetValue = document.querySelector("#sunset");
let currentCityButton = document.querySelector("#currentCity");
let apiKey = "ca933d04e48364b07c37baf5347b2253";
let units = "metric";

//change city
function updateCity(newcity) {
  cityValue.innerHTML = capitalizeFirstLetter(newcity);
  temperature(newcity);
}

function search(event) {
  event.preventDefault();
  updateCity(input.value);

  formatDate();
}
formSearch.addEventListener("submit", search);

//change date
function updateDate(newDate) {
  dateValue.innerHTML = newDate;
}

function formatDate() {
  let today = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sut"];
  let day = days[today.getDay()];
  let hour = today.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = today.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let date = `${day}, ${hour}:${minute}`;
  updateDate(date);
}

// //change temperature
function updateTemperature(newTemp) {
  tempValue.innerHTML = newTemp;
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let sunset = response.data.sys.sunset;
  let sunrise = response.data.sys.sunrise;
  updateTemperature(temperature);
  changeTimeSunset(sunset);
  changeTimeSunrise(sunrise);
}
function temperature(newCity) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${units}`;
  console.log(cityValue);
  axios.get(apiUrl).then(showTemperature);
}

//c
function changeTempCelcius() {
  let newTemp = Math.round((tempValue.innerHTML - 32) * 0.5556);
  updateTemperature(newTemp);
}

let celciusButton = document.querySelector(".celcius");
celciusButton.addEventListener("click", changeTempCelcius);
//f
function changeTempFarenheit() {
  let newTemp = Math.round(tempValue.innerHTML * 1.8 + 32);
  updateTemperature(newTemp);
}

let farenheitButton = document.querySelector(".farenheit");
farenheitButton.addEventListener("click", changeTempFarenheit);

//for current city button

function showWeather(response) {
  console.log("show weather");
  let temp = Math.round(response.data.main.temp);
  let cityName = response.data.name;
  let sunset = response.data.sys.sunset;
  let sunrise = response.data.sys.sunrise;
  capitalizeFirstLetter(cityName);
  updateCity(cityName);
  formatDate();
  updateTemperature(temp);
  changeTimeSunset(sunset);
  changeTimeSunrise(sunrise);
}

//capitalLetter
function capitalizeFirstLetter(cityName) {
  return cityName[0].toUpperCase() + cityName.slice(1);
}

function retrievePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  console.log("start  requuest");
  axios.get(url).then(showWeather);
}

function getCurrentPosition() {
  console.log("start");
  navigator.geolocation.getCurrentPosition(retrievePosition);
  console.log("end");
}

currentCityButton.addEventListener("click", getCurrentPosition);

function changeTimeSunset(sunset) {
  let unix_sunset = sunset;
  var date = new Date(unix_sunset * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  let formattedTimeSunset =
    "Sunset:" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  sunsetValue.innerHTML = formattedTimeSunset;
}

function changeTimeSunrise(sunrise) {
  let unix_sunrise = sunrise;
  var date = new Date(unix_sunrise * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  let formattedTimeSunrise =
    "Sunrise:" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  sunriseValue.innerHTML = formattedTimeSunrise;
}
