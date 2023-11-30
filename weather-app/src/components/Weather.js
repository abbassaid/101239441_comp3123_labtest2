import React, { useState, useEffect } from 'react'
import axios from 'axios'

import './Weather.css'

const Weather = () => {
    const [city, setCity] = useState('')
    const [weatherData, setWeatherData] = useState(null)
    const [weeklyForecast, setWeeklyForecast] = useState(null)
    const [showWeather, setShowWeather] = useState(false)

    const API_KEY = '18cd7783f7e0d95a0fa49521db3a2bb3'
    const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
    const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast'
    const ICON_BASE_URL = 'http://openweathermap.org/img/wn/'

    const getWeatherData = async () => {
        try {
            const response = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`)
            setWeatherData(response.data)
            getWeeklyForecast()
            setShowWeather(true)
        } catch (error) {
            console.error('Error fetching weather data:', error)
        }
    }

    const getWeeklyForecast = async () => {
        try {
            const response = await axios.get(`${FORECAST_API_URL}?q=${city}&appid=${API_KEY}&units=metric`)
            const dailyForecasts = response.data.list.filter((item, index) => index % 8 === 0)
            setWeeklyForecast(dailyForecasts)
        } catch (error) {
            console.error('Error fetching weekly forecast:', error)
        }
    }

    return (
        <div className="weather-container">
            <h2>Weather App</h2>
            <label>
                Enter City:
                <br />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </label>
            <br />
            <button onClick={getWeatherData}>Get Weather</button>
            <br />
            <br />

            {showWeather && weatherData && (
                <div className="current-weather">
                    <div className="left-column">
                        <h3>{weatherData.name}, {weatherData.sys.country}</h3>
                        <p>{new Date(weatherData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <img src={`${ICON_BASE_URL}${weatherData.weather[0].icon}@2x.png`} alt="Weather Icon" />
                        <p>{weatherData.weather[0].description}</p>
                        <h4>{Math.round(weatherData.main.temp)} &deg;C</h4>
                    </div>
                    <div className="right-column">
                        <div className="daily-forecast">
                            <p><b>Min Temperature:</b> {Math.round(weatherData.main.temp_min)} &deg;C</p>
                            <p><b>Max Temperature:</b> {Math.round(weatherData.main.temp_max)} &deg;C</p>
                            <p><b>Humidity:</b> {weatherData.main.humidity}%</p>
                            <p><b>Wind Speed:</b> {Math.round(weatherData.wind.speed * 3.6)} km/h</p>
                            <p><b>Air Pressure:</b> {Math.round(weatherData.main.pressure)} mb</p>
                            <p><b>Feels Like:</b> {Math.round(weatherData.main.feels_like)} &deg;C</p>
                        </div>
                        {weeklyForecast && (
                            <div>
                                <h3>Weekly Forecast</h3>
                                <div className="weekly-forecast">
                                    {weeklyForecast.map((forecast, index) => (
                                        <div key={index} className="weekly-forecast-item">
                                            <img src={`${ICON_BASE_URL}${forecast.weather[0].icon}@2x.png`} alt="Weather Icon" />
                                            <p>{new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                            <p>{Math.round(forecast.main.temp)} &deg;C</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Weather
