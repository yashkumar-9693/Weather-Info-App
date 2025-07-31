import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = () => {

    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(false);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const convertUnixToTime = (timestamp, timezoneOffset) => {
        const localTime = new Date((timestamp + timezoneOffset) * 1000);
        const hours = localTime.getUTCHours();
        const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const hour12 = (hours % 12) || 12;
        return `${hour12}:${minutes} ${suffix}`;
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;
            const timezoneOffset = data.timezone;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                feelsLike: Math.floor(data.main.feels_like),
                visibility: (data.visibility / 1000).toFixed(1), // convert meters to km
                sunrise: convertUnixToTime(data.sys.sunrise, timezoneOffset),
                sunset: convertUnixToTime(data.sys.sunset, timezoneOffset),
                location: data.name,
                icon: icon
            });
        } catch (error) {
            setWeatherData(false);
            console.error("Error fetching weather data", error);
        }
    };

    useEffect(() => {
        search("Patna");
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search city...'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            search(inputRef.current.value);
                        }
                    }}
                />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => search(inputRef.current.value)}
                />
            </div>

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>

                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                        <div className="col">
                            <div>
                                <p>{weatherData.feelsLike}°C</p>
                                <span>Feels Like</span>
                            </div>
                        </div>
                        <div className="col">
                            <div>
                                <p>{weatherData.visibility} km</p>
                                <span>Visibility</span>
                            </div>
                        </div>
                        <div className="col">
                            <div>
                                <p>{weatherData.sunrise}</p>
                                <span>Sunrise</span>
                            </div>
                        </div>
                        <div className="col">
                            <div>
                                <p>{weatherData.sunset}</p>
                                <span>Sunset</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default Weather;
