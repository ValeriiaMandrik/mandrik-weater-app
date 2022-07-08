//variable declaration
let formSearch = document.querySelector(".input-group");
let cityValue = document.querySelector("#cityValue");
let input = formSearch.querySelector(".form-control");
let dateValue = document.querySelector("#dayValue");
let tempValue = document.querySelector("#tempValue");
let sunriseValue = document.querySelector("#sunrise");
let sunsetValue = document.querySelector("#sunset");
let date = document.querySelector("#date");
let date1 = document.querySelector("#date1");
let date2 = document.querySelector("#date2");
let date3 = document.querySelector("#date3");
let date4 = document.querySelector("#date4");
let lowTempCol = document.querySelector("#lowTemp");
let highTempCol = document.querySelector("#highTemp");
let windCol = document.querySelector("#wind");
let humiditCol = document.querySelector("#humidity");
let currentCityButton = document.querySelector("#currentCity");
let celciusButton = document.querySelector(".celcius");
let farenheitButton = document.querySelector(".farenheit");
let cityLisbonButton = document.querySelector("#cityLisbon");
let cityCascaisButton = document.querySelector("#cityCascais");
let cityKyivButton = document.querySelector("#cityKyiv");
let citySumyButton = document.querySelector("#citySumy");
let description = document.querySelector("#description");
let iconElement = document.querySelector("#icon");
let apiKey = "ca933d04e48364b07c37baf5347b2253";
let units = "metric";

//capitalLetter
function capitalizeFirstLetter(cityName) {
  return cityName[0].toUpperCase() + cityName.slice(1);
}

//change date
function updateDate(newDate, dateCol, dateCol1, dateCol2, dateCol3, dateCol4) {
  dateValue.innerHTML = newDate;
  date.innerHTML = dateCol;
  date1.innerHTML = dateCol1;
  date2.innerHTML = dateCol2;
  date3.innerHTML = dateCol3;
  date4.innerHTML = dateCol4;
}

function formatDate() {
  let today = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // if today.getDay()>2 {}
  let day = days[today.getDay()];
  let day1 = days[today.getDay() + 1];
  let day2 = days[today.getDay() + 2];
  let day3 = days[today.getDay() + 3];
  let day4 = days[today.getDay() + 4];
  let hour = today.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = today.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let date = `${day}, ${hour}:${minute}`;
  updateDate(date, day, day1, day2, day3, day4);
}
//change description
function updateDescription(weatherDescription) {
  description.innerHTML = weatherDescription;
}

//change minTemp
function updateMinTemp(minTemp) {
  lowTempCol.innerHTML = Math.round(minTemp) + "°";
}

//change maxTemp
function updateMaxTemp(maxTemp) {
  highTempCol.innerHTML = Math.round(maxTemp) + "°";
}

//changeWind
function updateWind(windspeed) {
  windCol.innerHTML = windspeed;
}

//changeHumidity
function updateHumidity(humidity) {
  humiditCol.innerHTML = humidity;
}

//c
function changeTempCelcius() {
  let newTemp = Math.round((tempValue.innerHTML - 32) * 0.5556);
  updateTemperature(newTemp);
}
celciusButton.addEventListener("click", changeTempCelcius);

//f
function changeTempFarenheit() {
  let newTemp = Math.round(tempValue.innerHTML * 1.8 + 32);
  updateTemperature(newTemp);
}
farenheitButton.addEventListener("click", changeTempFarenheit);

//chosenSity
function getCity(city) {
  return function () {
    temperature(city);
    formatDate();
    cityValue.innerHTML = city;
  };
}

//chosenSitySumy
citySumyButton.addEventListener("click", getCity("Sumy"));

//chosenSityKyiv
cityKyivButton.addEventListener("click", getCity("Kyiv"));

//chosenSityLisbon
cityLisbonButton.addEventListener("click", getCity("Lisbon"));

//chosenSityCascais
cityCascaisButton.addEventListener("click", getCity("Cascais"));

//change city
function updateCity(newcity) {
  cityValue.innerHTML = capitalizeFirstLetter(newcity);
  temperature(newcity);
  forecast(newcity);
}

function search(event) {
  event.preventDefault();
  updateCity(input.value);
  formatDate();
}
formSearch.addEventListener("submit", search);

//change temperature
function updateTemperature(newTemp) {
  tempValue.innerHTML = newTemp;
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let sunset = response.data.sys.sunset;
  let sunrise = response.data.sys.sunrise;
  let timeZone = response.data.timezone;
  let minTemp = response.data.main.temp_min;
  let maxTemp = response.data.main.temp_max;
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let weatherDescription = response.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  updateWind(windSpeed);
  updateTemperature(temperature);
  updateMaxTemp(maxTemp);
  updateMinTemp(minTemp);
  updateHumidity(humidity);
  updateDescription(weatherDescription);
  changeTimeSunset(sunset, timeZone);
  changeTimeSunrise(sunrise, timeZone);
}
function temperature(newCity) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

//for current city button

function showWeather(response) {
  let temp = Math.round(response.data.main.temp);
  console.log(response.data);
  let minTemp = response.data.main.temp_min;
  let maxTemp = response.data.main.temp_max;
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let cityName = response.data.name;
  let sunset = response.data.sys.sunset;
  let sunrise = response.data.sys.sunrise;
  let timeZone = response.data.timezone;
  let weatherDescription = response.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  updateDescription(weatherDescription);
  capitalizeFirstLetter(cityName);
  updateCity(cityName);
  formatDate();
  updateTemperature(temp);
  updateWind(windSpeed);
  updateHumidity(humidity);
  updateMaxTemp(maxTemp);
  updateMinTemp(minTemp);
  changeTimeSunset(sunset, timeZone);
  changeTimeSunrise(sunrise, timeZone);
}

function retrievePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

currentCityButton.addEventListener("click", getCurrentPosition);

//sunset
function changeTimeSunset(sunset, timeZone) {
  let date = new Date().getTimezoneOffset();
  let newDate = new Date((sunset + date * 60 + timeZone) * 1000);
  var hours = newDate.getHours();
  var minutes = "0" + newDate.getMinutes();
  var seconds = "0" + newDate.getSeconds();
  let formattedTimeSunset =
    "Sunset:" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
  sunsetValue.innerHTML = formattedTimeSunset;
}

//sunrise
function changeTimeSunrise(sunrise, timeZone) {
  let date = new Date().getTimezoneOffset();
  let newDate = new Date((sunrise + date * 60 + timeZone) * 1000);
  console.log(date, timeZone);
  var hours = newDate.getHours();
  var minutes = "0" + newDate.getMinutes();
  var seconds = "0" + newDate.getSeconds();
  let formattedTimeSunrise =
    "Sunrise:" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  sunriseValue.innerHTML = formattedTimeSunrise;
}

// //forNextDays
// function showTemperatureForecast(response) {
//   let date = response.data.list.dt_txt;
//   console.log(date);
// }
// function forecast(newCity) {
//   let apiUrlDayly = `https://api.openweathermap.org/data/2.5/forecast?q=${newCity}&appid=${apiKey}&units=${units}&mode=xml`;
//   console.log(apiUrlDayly);
//   axios.get(apiUrlDayly).then(showTemperatureForecast);
// }
