import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = "6f578b96aa9505bcce148ac22cb85794";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeatherApp() {
  const [city, setCity] = useState("Kimberley");
  const [weatherData, setWeatherData] = useState(null);

  const formatDate = (timestamp) => {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }

    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    let day = days[date.getDay()];

    return `${day} ${hours}:${minutes}`;
  }

  const formatHour = (timestamp) => {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }

    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  }

  const formatDay = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    return shortDays[day];
  }

  const search = (city) => {
    const apiUrl = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    axios.get(apiUrl).then(response => {
      const forecastApiUrl = `${BASE_URL}/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${API_KEY}&units=metric`;
      axios.get(forecastApiUrl).then(forecastResponse => {
        setWeatherData({
          city: response.data.name,
          temperature: Math.round(response.data.main.temp),
          description: response.data.weather[0].description,
          wind: Math.round(response.data.wind.speed),
          humidity: response.data.main.humidity,
          sunrise: formatHour(response.data.sys.sunrise * 1000),
          sunset: formatHour(response.data.sys.sunset * 1000),
          icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
          forecast: forecastResponse.data.daily.slice(0, 6).map(forecastDay => ({
            day: formatDay(forecastDay.dt),
            maxTemp: Math.round(forecastDay.temp.max),
            minTemp: Math.round(forecastDay.temp.min),
            icon: `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`,
          })),
        });
      });
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    search(city);
  }

  return (
    <div>
      <br/> 
      <br/> 
    <form className="center-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input type="text" value={city} onChange={e => setCity(e.target.value)} />
        <button type="submit">Search</button>
      </div>
    </form>
    {weatherData && (
      <div className="weather-data">
        <div className="center-content">
          <h2>{weatherData.city}</h2>
          <img src={weatherData.icon} alt={weatherData.description} />
          <div className="temperature">{weatherData.temperature}°C</div>
          <div className="description">{weatherData.description}</div>
        </div>
<div className="right-content">
  <div>Humidity: {weatherData.humidity}%</div>
  <div>Wind: {weatherData.wind} m/s</div>
  <div>Sunrise: {weatherData.sunrise}</div>
  <div>Sunset: {weatherData.sunset}</div>
  <div>Current Date and Time: 
    {new Date().toLocaleString()}
    </div>
</div>
<br/> <br/> <br/>  <br/>  <br/> 
        <div className="forecast">
          {weatherData.forecast.map((forecastDay, index) => (
            <div key={index}>
              <h3>{forecastDay.day}</h3>
              <div>Max Temp: {forecastDay.maxTemp}°C</div>
              <div>Min Temp: {forecastDay.minTemp}°C</div>
              <img src={forecastDay.icon} alt="" />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  );
}

export default WeatherApp;