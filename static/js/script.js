// DOM Elements
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const createWeatherCard = (cityName, weatherItem, index) => {
    const date = weatherItem.date;
    const temperature = weatherItem.day.avgtemp_c.toFixed(2);
    const windSpeed = weatherItem.day.maxwind_mph;
    const humidity = weatherItem.day.avghumidity;
    const description = weatherItem.day.condition.text;
    const iconURL = `https:${weatherItem.day.condition.icon}`;

    if (index === 0) {
        return `
            <div class="details">
                <h2>${cityName} (${date})</h2>
                <h6>Temperature: ${temperature}°C</h6>
                <h6>Wind: ${windSpeed} M/S</h6>
                <h6>Humidity: ${humidity}%</h6>
            </div>
            <div class="icon">
                <img src="${iconURL}" alt="weather-icon">
                <h6>${description}</h6>
            </div>`;
    } else {
        return `
            <li class="card">
                <h3>(${date})</h3>
                <img src="${iconURL}" alt="weather-icon">
                <h6>Temp: ${temperature}°C</h6>
                <h6>Wind: ${windSpeed} M/S</h6>
                <h6>Humidity: ${humidity}%</h6>
            </li>`;
    }
};


// Function to fetch weather details from the backend
const getWeatherDetails = (cityName) => {
    const WEATHER_API_URL = `/weather?city=${cityName}`; 

    fetch(WEATHER_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            return response.json();
        })
        .then(data => {
            const fiveDaysForecast = data.forecast.forecastday; 
            console.log(fiveDaysForecast);
            // Clear previous data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // Display weather cards
            fiveDaysForecast.forEach((weatherItem, index) => {
                const weatherHTML = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", weatherHTML);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", weatherHTML);
                }
            });
        })
        .catch(error => {
            console.error(error);
            alert("An error occurred while fetching the weather forecast!");
        });
};


// Function to fetch city coordinates and weather from the backend
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return alert("Please enter a city name");

    getWeatherDetails(cityName);
};

// Event listeners
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => {
    if (e.key === "Enter") getCityCoordinates();
});
