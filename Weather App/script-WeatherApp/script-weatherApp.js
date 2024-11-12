const apiKey = '420316d641ce4d668a72f40516a9603b';
const searchBtn = document.querySelector('.searchBtn');
const locationButton = document.querySelector('.myLocationBtn');
const input = document.querySelector('.searchBox');
const weatherIcon = document.querySelector('.weather-icon');
const toggleSwitch = document.getElementById('toggleSwitch');
//searching by getting value from input
searchBtn.addEventListener('click', () => {
    const city = input.value;
    if (city) {
        getWeatherByCity(city);
    } else {
        alert('Please enter a city');
    }
});
//show the weather of your locations
locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByLocation(latitude, longitude);
            },
            () => {
                alert('Unable to access your location');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
});


//switch from celcius to farenheit by call methods
toggleSwitch.addEventListener('change', () => {
    toggleUnits(); 
});

//display weather on celcius or farenheit and show weather by icon
function displayWeather(data) {
    const tempUnit = units === 'metric' ? '°C' : '°F';
    document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}${tempUnit}`;
    document.querySelector('.city').textContent = data.name;
    document.querySelector('.humidity_data h3').textContent = `${data.main.humidity}%`;
    document.querySelector('.wind_speed_data h3').textContent = `${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`;
    
    
    switch(data.weather[0].main){
        case 'Clouds':
            weatherIcon.src = "../assets-WeatherApp/weather-app-img/images/clouds.png";
            break;
        case 'Clear':
            weatherIcon.src = "../assets-WeatherApp/weather-app-img/images/clear.png";
            break;
        case 'Rain':
            weatherIcon.src = "../assets-WeatherApp/weather-app-img/images/rain.png";
            break;
        case 'Drizzle':
            weatherIcon.src = "../assets-WeatherApp/weather-app-img/images/drizzle.png";
            break;
        case 'Mist':
            weatherIcon.src = "../assets-WeatherApp/weather-app-img/images/mist.png";
            break;
        case 'Snow':
            weatherIcon.src = "../assets-WeatherApp/weather-app-img/images/snow.png";
            break;
    }
    console.log(data);
}







//this function for seaching 
async function getWeatherByCity(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            displayWeather(data);
            get5DayForecast(city); 
        } else {
            alert('City not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


//this function for viewing my location
async function getWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            displayWeather(data);
        } else {
            alert('Unable to fetch weather for your location');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// this is the function for 5 day forecast where we get data
async function get5DayForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            display5DayForecast(data);
        } else {
            alert('City not found for forecast');
        }
    } catch (error) {
        console.error('Error fetching 5-day forecast:', error);
    }
}


//by calculating this function return 5 day forecast weather
function display5DayForecast(data) {
    const forecastContainer = document.querySelector('.five_day_forecast');
    forecastContainer.innerHTML = ''; 

    const tempUnit = units === 'metric' ? '°C' : '°F';

    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
        const temp = Math.round(day.main.temp);

        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <h3 class="date">${date}</h3>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" class="forecast-icon" alt="Icon">
                <h4 class="forecast-temp">${temp}${tempUnit}</h4>
            </div>
        `;
    }
}
//units is Celcius like default
let units = 'metric'; 

//this method for toggling units from Celsius to Farenheit
function toggleUnits() {
    units = units === 'metric' ? 'imperial' : 'metric';
    const city = document.querySelector('.city').textContent;
    if (city) {
        getWeatherByCity(city);
        get5DayForecast(city);
    }
}


