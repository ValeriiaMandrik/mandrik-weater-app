//variable declaration
let formSearch = document.querySelector(".input-group");
let cityValue = document.querySelector("#cityValue");
let input = formSearch.querySelector(".form-control");
let dateValue = document.querySelector("#dayValue");
let tempValue = document.querySelector("#tempValue");
let sunriseValue = document.querySelector("#sunrise");
let sunsetValue = document.querySelector("#sunset");
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
function updateDate(newDate) {
  dateValue.innerHTML = newDate;
}

function formatDate(timestamp) {
  let today = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[today.getDay()];
  let hours = today.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let date = `${day}, ${hours}:${minutes}`;
  return `${day} ${hours}:${minutes}`;
}

//change description
function updateDescription(weatherDescription) {
  description.innerHTML = weatherDescription;
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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let date = formatDay(response.data.current.dt);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = ` <tbody>
<tr id "dateElement">
<td scope="col">Date</td>
<td scope="col">High temperature °C</td>
<td scope="col">Low temperature °C</td>
<td scope="col">Wind km/h</td>
<td scope="col">Humidity, %</td>
</tr>`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `    
            <td scope="col">${formatDay(forecastDay.dt)}</td>
       
          <td scope="col" id="highTemp">${Math.round(
            forecastDay.temp.max
          )}° </td>
       
            <td scope="col" id="lowTemp">${Math.round(
              forecastDay.temp.min
            )}° </td>
       
          <td scope="col" id="wind">${forecastDay.wind_speed} </td>

           <td scope="col" id="humidity">${forecastDay.humidity}</td>
    
`;

      forecastHTML = forecastHTML + `</tbody>`;
      forecastElement.innerHTML = forecastHTML;
      updateDate(date);
    }
  });
}
function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
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

  updateTemperature(temperature);
  updateDescription(weatherDescription);
  changeTimeSunset(sunset, timeZone);
  changeTimeSunrise(sunrise, timeZone);

  getForecast(response.data.coord);
}
function temperature(newCity) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

//for current city button

function showWeather(response) {
  let temp = Math.round(response.data.main.temp);
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
  changeTimeSunset(sunset, timeZone);
  changeTimeSunrise(sunrise, timeZone);
  getForecast(response.data.coord);
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
  var hours = newDate.getHours();
  var minutes = "0" + newDate.getMinutes();
  var seconds = "0" + newDate.getSeconds();
  let formattedTimeSunrise =
    "Sunrise:" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  sunriseValue.innerHTML = formattedTimeSunrise;
}
