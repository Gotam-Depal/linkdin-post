// Weather app powered by Open-Meteo (free, no API key required)
// Docs: https://open-meteo.com/en/docs

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusEl = document.getElementById("status");
const weatherContainer = document.getElementById("weatherContainer");
const skyEl = document.getElementById("sky");

const tempEl = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const cityNameEl = document.getElementById("cityName");
const updatedEl = document.getElementById("updated");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");
const feelsLikeEl = document.getElementById("feelsLike");
const iconEl = document.getElementById("weatherIcon");

// WMO weather codes grouped by the icon + label they map to.
// Reference: https://open-meteo.com/en/docs#weathervariables
const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mostly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "fog" },
  48: { label: "Depositing rime fog", icon: "fog" },
  51: { label: "Light drizzle", icon: "rain" },
  53: { label: "Drizzle", icon: "rain" },
  55: { label: "Dense drizzle", icon: "rain" },
  56: { label: "Freezing drizzle", icon: "rain" },
  57: { label: "Freezing drizzle", icon: "rain" },
  61: { label: "Slight rain", icon: "rain" },
  63: { label: "Rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "rain" },
  66: { label: "Freezing rain", icon: "rain" },
  67: { label: "Freezing rain", icon: "rain" },
  71: { label: "Slight snow", icon: "snow" },
  73: { label: "Snow", icon: "snow" },
  75: { label: "Heavy snow", icon: "snow" },
  77: { label: "Snow grains", icon: "snow" },
  80: { label: "Slight showers", icon: "rain" },
  81: { label: "Showers", icon: "rain" },
  82: { label: "Violent showers", icon: "rain" },
  85: { label: "Slight snow showers", icon: "snow" },
  86: { label: "Snow showers", icon: "snow" },
  95: { label: "Thunderstorm", icon: "storm" },
  96: { label: "Thunderstorm with hail", icon: "storm" },
  99: { label: "Thunderstorm with hail", icon: "storm" },
};

const ICONS = {
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffd166" stroke-width="1.6"><circle cx="12" cy="12" r="4.5" fill="#ffd166" stroke="none"/><g stroke-linecap="round"><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.6" y1="4.6" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.4" y2="19.4"/><line x1="4.6" y1="19.4" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.4" y2="4.6"/></g></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="#d9e6f2"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>`,
  "cloud-sun": `<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3.5" fill="#ffd166"/><path d="M6 20a5 5 0 0 1 .3-9.98A6 6 0 0 1 18 11a4 4 0 0 1-.5 8H6Z" fill="#e7eef4"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24"><path d="M6.5 19a5 5 0 0 1 .3-9.98A6.5 6.5 0 0 1 19 11.5 4.25 4.25 0 0 1 18.25 19H6.5Z" fill="#e7eef4"/></svg>`,
  fog: `<svg viewBox="0 0 24 24" stroke="#cfd9e2" stroke-width="1.6" stroke-linecap="round" fill="none"><line x1="4" y1="9" x2="20" y2="9"/><line x1="2" y1="13" x2="22" y2="13"/><line x1="5" y1="17" x2="19" y2="17"/></svg>`,
  rain: `<svg viewBox="0 0 24 24"><path d="M6.5 15a5 5 0 0 1 .3-9.98A6.5 6.5 0 0 1 19 7.5 4.25 4.25 0 0 1 18.25 15H6.5Z" fill="#c9d6e0"/><g stroke="#7fb2d9" stroke-width="1.6" stroke-linecap="round"><line x1="8" y1="17.5" x2="7" y2="20.5"/><line x1="12.5" y1="17.5" x2="11.5" y2="20.5"/><line x1="17" y1="17.5" x2="16" y2="20.5"/></g></svg>`,
  snow: `<svg viewBox="0 0 24 24"><path d="M6.5 15a5 5 0 0 1 .3-9.98A6.5 6.5 0 0 1 19 7.5 4.25 4.25 0 0 1 18.25 15H6.5Z" fill="#dbe6ee"/><g stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"><line x1="8" y1="17" x2="8" y2="21"/><line x1="12.5" y1="17" x2="12.5" y2="21"/><line x1="17" y1="17" x2="17" y2="21"/></g></svg>`,
  storm: `<svg viewBox="0 0 24 24"><path d="M6.5 13.5a5 5 0 0 1 .3-9.98A6.5 6.5 0 0 1 19 6 4.25 4.25 0 0 1 18.25 13.5H6.5Z" fill="#aebfcc"/><path d="M13 13.5 10 18h3l-2 4.5 6-7h-3.3l1.8-2Z" fill="#ffd166"/></svg>`,
};

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function updateSkyTheme(isDay, iconKey) {
  const themes = {
    day: ["#4a90c4", "#8fc1d9"],
    night: ["#0f1f3a", "#2c3e5c"],
    stormy: ["#2b3648", "#57697d"],
  };
  let theme = isDay ? themes.day : themes.night;
  if (iconKey === "storm" || iconKey === "rain") theme = themes.stormy;
  skyEl.style.background = `linear-gradient(180deg, ${theme[0]} 0%, ${theme[1]} 100%)`;
}

async function geocodeCity(city) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Couldn't find a place called "${city}"`);
  }
  const place = data.results[0];
  return {
    latitude: place.latitude,
    longitude: place.longitude,
    name: place.name,
    country: place.country,
  };
}

async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    timezone: "auto",
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Weather request failed");
  const data = await res.json();
  if (!data.current) throw new Error("No current weather in response");
  return data.current;
}

function renderWeather(place, current) {
  const weatherInfo = WEATHER_CODES[current.weather_code] || { label: "Unknown", icon: "cloud" };
  const isDay = current.is_day === 1;
  const iconKey = isDay ? weatherInfo.icon : (weatherInfo.icon === "sun" ? "moon" : weatherInfo.icon);

  tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
  conditionEl.textContent = weatherInfo.label;
  cityNameEl.textContent = place.country ? `${place.name}, ${place.country}` : place.name;
  humidityEl.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  windSpeedEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°`;
  updatedEl.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  iconEl.innerHTML = ICONS[iconKey] || ICONS.cloud;

  updateSkyTheme(isDay, weatherInfo.icon);

  weatherContainer.hidden = false;
}

async function loadCity(city) {
  setStatus(`Searching for ${city}...`);
  weatherContainer.hidden = true;

  try {
    const place = await geocodeCity(city);
    const current = await fetchWeather(place.latitude, place.longitude);
    renderWeather(place, current);
    setStatus("");
  } catch (err) {
    console.error("Weather app error:", err);
    setStatus(err.message || "Something went wrong. Please try again.", true);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Type a city name first.", true);
    return;
  }
  loadCity(city);
});

// Load a default city on first visit.
loadCity("Hyderabad");







////API Calling methods (for Practice purpose)
// ///........Method 1
// fetch("https://api.weatherapi.com/v1/current.json?key=c7384c730c464f9b8a0153509261401")
// .then((res)=>{
//     return res.json();
// })
// .then((data)=>{
//     console.log(data)
// })
// .catch(()=>{
//     console.log("Failed")
// })





///.........Method 2
// async function getWeatherData(){
//     try{
//     const resp= await fetch("https://api.weatherapi.com/v1/current.json?key=1f4ee")
//     const formatedRes=await resp.json();
//     console.log(formatedRes)
//     }
//     catch(e){
//         console.log("something went wrong!",e)
//     }
// }

// getWeatherData()
// console.log("data")
