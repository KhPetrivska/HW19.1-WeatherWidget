"use strict";
const locationDiv = document.getElementsByClassName("location")[0];
const weatherDiv = document.getElementsByClassName("tempetature")[0];
const icon = document.getElementsByClassName("img")[0];
const condition = document.getElementsByClassName("condition")[0];
const refreshButton = document.getElementsByClassName("refreshButton")[0];
const apiKey = `5ae6e20f2fdc565a7caa608c6f696a67`;

//Time + Date
function getDateTime() {
  const currentFullDate = new Date();
  const date = currentFullDate.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[currentFullDate.getMonth()];
  const year = currentFullDate.getFullYear();
  const time = `${String(currentFullDate.getHours()).padStart(2, "0")}:${String(
    currentFullDate.getMinutes()
  ).padStart(2, "0")}`;

  const currDate = `${month} ${date}, ${year}`;
  const dateDiv = document.getElementsByClassName("date")[0];
  dateDiv.textContent = currDate;

  const timeDiv = document.getElementsByClassName("time")[0];
  timeDiv.textContent = time;
}
getDateTime();

// Location, temperature, condition
let lat = null;
let lon = null;

function getWeather() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        resolve({ lat, lon });
      });
    } else {
      (error) => reject("Geolocation error: " + error.message);
    }
  });
}

function fetchWeather() {
  return getWeather()
    .then((position) => {
      return position;
    })
    .then((position) => {
      const link = `https://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.lon}&appid=${apiKey}`;
      return fetch(link, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          const locationName = `${data.name}, ${data.sys.country}`;
          locationDiv.textContent = locationName;
          const temperature = parseInt(data.main.temp - 273.15);
          weatherDiv.textContent = `${temperature}°C`;

          const iconCode = data.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          icon.src = iconUrl;

          const conditionW = data.weather[0].main;
          condition.textContent = conditionW;
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

fetchWeather();
refreshButton.addEventListener("click", fetchWeather);
refreshButton.addEventListener("click", getDateTime);
