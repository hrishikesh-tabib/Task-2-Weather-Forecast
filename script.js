// 1. CONFIGURATION
const apiKey = "11d7e52a3cc8a4398858e3308642f701"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// 2. SELECTING ELEMENTS (The DOM)
const searchBox = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");
const weatherIcon = document.querySelector(".weather-desc"); 
const cityElement = document.querySelector(".city-info h1");
const tempElement = document.querySelector(".current-temp");

// NEW SELECTORS for the details
const windElement = document.querySelector(".wind");
const humidityElement = document.querySelector(".humidity");
const feelsLikeElement = document.querySelector(".feels-like");
const sunriseElement = document.querySelector(".sun-times div:first-child h3"); // Target the Sunrise H3
const sunsetElement = document.querySelector(".sun-times div:last-child h3");   // Target the Sunset H3

// 3. THE FUNCTIONS

// Helper Function: Converts "Unix Timestamp" to readable time (e.g., 7:00 AM)
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000); // Multiply by 1000 because JS uses milliseconds
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes(); // Add a leading zero (e.g., 7:05 instead of 7:5)
    
    // Simple logic to detect AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 13:00 to 1:00

    return `${formattedHours}:${minutes.substr(-2)} ${ampm}`;
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        alert("City not found! Please check the spelling.");
    } else {
        var data = await response.json();

        // --- UPDATE MAIN INFO ---
        cityElement.innerText = data.name; 
        tempElement.innerText = Math.round(data.main.temp) + "°";
        weatherIcon.innerText = data.weather[0].main;

        // --- UPDATE DETAILS GRID ---
        
        // 1. Humidity (Found in data.main)
        humidityElement.innerText = data.main.humidity + "%";

        // 2. Wind Speed (Found in data.wind)
        // The API gives meters/sec. To get km/h, multiply by 3.6
        windElement.innerHTML = Math.round(data.wind.speed * 3.6) + " <span>km/h</span>";

        // 3. Feels Like (Found in data.main)
        feelsLikeElement.innerText = Math.round(data.main.feels_like) + "°";

        // 4. Sunrise & Sunset (Found in data.sys)
        sunriseElement.innerText = formatTime(data.sys.sunrise);
        sunsetElement.innerText = formatTime(data.sys.sunset);

        console.log(data); // Keep this to inspect other data!
    }
}

// 4. EVENT LISTENERS
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});