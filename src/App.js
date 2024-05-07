// Importing necessary modules and CSS
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
// Constants for API
const API_KEY = "6f578b96aa9505bcce148ac22cb85794";// API key for OpenWeatherMap
const BASE_URL = "https://api.openweathermap.org/data/2.5";// Base URL for OpenWeatherMap API
// Arrays for day names
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Main function component
function WeatherApp() {
   // State variables
  const [city, setCity] = useState("Kimberley"); // State for city name
  const [weatherData, setWeatherData] = useState(null);// State for weather data
  // Function to format date
  const formatDate = (timestamp) => { // Create date object from timestamp
    let date = new Date(timestamp);
    let hours = date.getHours();// Get hours from date
    if (hours < 10) {
      hours = `0${hours}`; // Add leading zero if hours less than 10
    }

    let minutes = date.getMinutes(); // Get minutes from date
    if (minutes < 10) {
      minutes = `0${minutes}`; // Add leading zero if minutes less than 10
    }

    let day = days[date.getDay()]; // Get day name from date

    return `${day} ${hours}:${minutes}`; // Return formatted date
  }

  // Similar functions for formatting hour and day
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
  // Function to search weather data for a city
  const search = (city) => {
    const apiUrl = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`; // API URL for weather data
    axios.get(apiUrl).then(response => {
      const forecastApiUrl = `${BASE_URL}/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${API_KEY}&units=metric`;
      axios.get(forecastApiUrl).then(forecastResponse => { // Make GET request to forecast API
        setWeatherData({ // Set weather data state
          city: response.data.name,
          temperature: Math.round(response.data.main.temp), // Temperature
          description: response.data.weather[0].description, // Weather description
          wind: Math.round(response.data.wind.speed), // Wind speed
          humidity: response.data.main.humidity, // Humidity
          sunrise: formatHour(response.data.sys.sunrise * 1000), // Sunrise time
          sunset: formatHour(response.data.sys.sunset * 1000), // Sunset time
          icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`, // Weather icon
          forecast: forecastResponse.data.daily.slice(0, 6).map(forecastDay => ({ // Forecast data
            day: formatDay(forecastDay.dt), // Day
            maxTemp: Math.round(forecastDay.temp.max), // Max temperature
            minTemp: Math.round(forecastDay.temp.min), // Min temperature
            icon: `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`, // Weather icon
          })),
        });
      });
    });
  }
 // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    search(city); // Search weather data for city
  }
  // Render function
  return (
    <div>
      <br/> 
      <br/> 
    <form className="center-form" onSubmit={handleSubmit}> {/* Form for city input */}
      <div className="input-group">
        <input type="text" value={city} onChange={e => setCity(e.target.value)} /> {/* Input for city name */}
        <button type="submit">Search</button> {/* Button to submit form */}
      </div>
    </form>
    {weatherData && ( // If weather data is not null, render weather data
      <div className="weather-data">
        <div className="center-content">
          <h2>{weatherData.city}</h2> {/* City name */}
          <img src={weatherData.icon} alt={weatherData.description} /> {/* Weather icon */}
          <div className="temperature">{weatherData.temperature}°C</div> {/* Temperature */}
          <div className="description">{weatherData.description}</div>  {/* Weather description */}
        </div>
<div className="right-content">
  <div>Humidity: {weatherData.humidity}%</div> {/* Humidity */}
  <div>Wind: {weatherData.wind} m/s</div> {/* Wind speed */}
  <div>Sunrise: {weatherData.sunrise}</div> {/* Sunrise time */}
  <div>Sunset: {weatherData.sunset}</div> {/* Sunset time */}
<div>Current Day and Time: {formatDate(new Date()).toLocaleString()} </div> {/* Current day and time */}
</div>
<br/> <br/> <br/>  <br/>  <br/> 
        <div className="forecast"> {/* Forecast data */}
          {weatherData.forecast.map((forecastDay, index) => ( // Map over forecast data
            <div key={index}> {/* Render forecast data */}
              <h3>{forecastDay.day}</h3> {/* Day */}
              <div>Max Temp: {forecastDay.maxTemp}°C</div> {/* Max temperature */}
              <div>Min Temp: {forecastDay.minTemp}°C</div> {/* Min temperature */}
              <img src={forecastDay.icon} alt="" /> {/* Weather icon */}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  );
}
 // Export function component
export default WeatherApp;