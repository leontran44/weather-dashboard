const apiKey = '0ba638b9dba8a25852f205cf8419d090';

document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
    }
});

document.getElementById('history-list').addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        getWeatherData(city);
    }
});

function getWeatherData(city) {
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const { lat, lon } = data[0];
            fetchWeather(lat, lon, city);
        } else {
            alert('City not found!');
        }
    });
}

function fetchWeather(lat, lon, city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(data, city);
        displayForecast(data);
        updateHistory(city);
    });
}

function displayCurrentWeather(data, city) {
    const currentWeather = data.list[0];

    const currentWeatherSection = document.getElementById('current-weather');
    currentWeatherSection.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cityName = document.createElement('h2');
    cityName.textContent = city;
    cityName.className = 'card-title';

    const date = document.createElement('p');
    date.textContent = new Date(currentWeather.dt_txt).toLocaleDateString();

    const weatherIcon = document.createElement('img');
    weatherIcon.src = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;
    weatherIcon.alt = currentWeather.weather[0].description;

    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${currentWeather.main.temp}°C`;
    temperature.className = 'card-text';

    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${currentWeather.main.humidity}%`;
    humidity.className = 'card-text';

    const windSpeed = document.createElement('p');
    windSpeed.textContent = `Wind Speed: ${currentWeather.wind.speed} m/s`;
    windSpeed.className = 'card-text';

    cardBody.appendChild(cityName);
    cardBody.appendChild(date);
    cardBody.appendChild(weatherIcon);
    cardBody.appendChild(temperature);
    cardBody.appendChild(humidity);
    cardBody.appendChild(windSpeed);

    card.appendChild(cardBody);

    currentWeatherSection.appendChild(card);
}

function displayForecast(data) {
    const forecastSection = document.getElementById('forecast');
    forecastSection.innerHTML = '';

    for (let i = 1; i < data.list.length; i += 8) {
        const forecast = data.list[i];

        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const date = document.createElement('p');
        date.textContent = new Date(forecast.dt_txt).toLocaleDateString();

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

        const temperature = document.createElement('p');
        temperature.textContent = `Temperature: ${forecast.main.temp}°C`;
        temperature.className = 'card-text';

        const humidity = document.createElement('p');
        humidity.textContent = `Humidity: ${forecast.main.humidity}%`;
        humidity.className = 'card-text';

        const windSpeed = document.createElement('p');
        windSpeed.textContent = `Wind Speed: ${forecast.wind.speed} m/s`;
        windSpeed.className = 'card-text';

        cardBody.appendChild(date);
        cardBody.appendChild(weatherIcon);
        cardBody.appendChild(temperature);
        cardBody.appendChild(humidity);
        cardBody.appendChild(windSpeed);
        
        card.appendChild(cardBody);

        forecastSection.appendChild(card);
    }
}            

function updateHistory(city) {
    const historyList = document.getElementById('history-list');
    const historyItems = document.createElement('li');
    historyItems.textContent = city;
    historyItems.classList.add('list-group-item');
    historyList.appendChild(historyItems);  

    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
    }   
}

document.addEventListener('DOMContentLoaded', function() {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    for (let i = 0; i < history.length; i++) {
        const historyList = document.getElementById('history-list');
        const historyItems = document.createElement('li');
        historyItems.textContent = history[i];
        historyItems.classList.add('list-group-item');
        historyList.appendChild(historyItems);
    }
});
