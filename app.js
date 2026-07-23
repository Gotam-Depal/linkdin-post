const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const cityName = document.getElementById("cityName");
const updated = document.getElementById("updated");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const weatherContainer = document.getElementById("weatherContainer");
const status = document.getElementById("status");
const input = document.getElementById("input");
const form = document.getElementById("form");
form.addEventListener("submit", weatherDataGet);

async function weatherDataGet(event) {
  event.preventDefault();
  try {
    const cityInput = input.value;
    const geoResp = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`
    );
    const geoData = await geoResp.json();
    const place = geoData.results[0];

    const resp = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
    );
    const data = await resp.json();

    temp.textContent = `${data.current.temperature_2m}°C`;
    cityName.textContent = place.name;
    updated.textContent = "Just now";
    humidity.textContent = `${data.current.relative_humidity_2m}%`;
    wind.textContent = `${data.current.wind_speed_10m}Km/h`;
    feelsLike.textContent = `${data.current.apparent_temperature}°`;
    weatherIcon.textContent = "☁️";

    status.textContent = "";
    weatherContainer.hidden = false;
  } catch (e) {
    status.textContent = "Invalid city name";
    status.style.color = "rgb(173, 39, 39)";
    status.style.backgroundColor = "rgb(179, 233, 54)";
  }
}