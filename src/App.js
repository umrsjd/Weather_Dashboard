import './App.css';
import { Search, MapPin, Wind, RefreshCw, Sun, Moon } from 'react-feather';
import getWeather, { getForecast } from './api/api';
import { useState } from 'react';
import dateFormat from 'dateformat';

const GEO_API_KEY = 'a73fb33b22msh57db19ad4945441p1f9623jsn025f58f27904';
const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [theme, setTheme] = useState("light");
  const [suggestions, setSuggestions] = useState([]);
  const [currentCity, setCurrentCity] = useState("");

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    const weatherData = await getWeather(cityName);
    const forecastData = await getForecast(cityName);
    setWeather(weatherData);
    setForecast(forecastData);
    setCurrentCity(cityName);

    setRecentSearches((prev) => {
      const updated = [cityName, ...prev.filter(c => c !== cityName)];
      return updated.slice(0, 5);
    });
  };

  const getWeatherbyCity = async () => {
    await fetchWeather(city.split(',')[0].trim());
    setCity("");
    setSuggestions([]);
  };

  const handleRefresh = async () => {
    if (currentCity) {
      await fetchWeather(currentCity);
    }
  };

  const renderDate = () => {
    let now = new Date();
    return dateFormat(now, "dddd, mmmm dS, h:MM TT");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setCity(input);

    if (input.length > 1) {
      try {
        const response = await fetch(`${GEO_API_URL}?namePrefix=${input}&limit=5&sort=-population`, {
          headers: {
            'X-RapidAPI-Key': 'a73fb33b22msh57db19ad4945441p1f9623jsn025f58f27904',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          }
        });
        const data = await response.json();
        const cityNames = data.data.map(city => `${city.city}, ${city.countryCode}`);
        setSuggestions(cityNames);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setCity(name);
    setSuggestions([]);
  };

  return (
    <div className={`app ${theme}`}>
      <h1>Weather App</h1>

      
      <div className="input-wrapper">
  <input
    type="text"
    value={city}
    onChange={handleInputChange}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        getWeatherbyCity();
      }
    }}
    placeholder='Enter City Name'
  />
  <button onClick={getWeatherbyCity}>
    <Search />
  </button>
</div>


      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s, idx) => (
            <li key={idx} onClick={() => handleSuggestionClick(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}

      <div className="options-bar">
        <button className="icon-btn" onClick={handleRefresh}>
          <RefreshCw />
        </button>
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === "light" ? <Moon /> : <Sun />}
        </button>
      </div>

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h4>Recent Searches:</h4>
          <ul>
            {recentSearches.map((item, idx) => (
              <li key={idx} onClick={() => fetchWeather(item)}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {weather && weather.weather && (
        <div className="content">
          <div className="location d-flex">
            <MapPin />
            <h2>{weather.name} <span>({weather.sys.country})</span></h2>
          </div>
          <p className="datetext">{renderDate()}</p>

          <div className="weatherdesc d-flex flex-c">
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />
            <h3>{weather.weather[0].description}</h3>
          </div>

          <div className="tempstats d-flex flex-c">
            <h1>{weather.main.temp} <span>&deg;C</span></h1>
            <h3>Feels Like {weather.main.feels_like} <span>&deg;C</span></h3>
          </div>

          <div className="windstats d-flex">
            <Wind />
            <h3>Wind is {weather.wind.speed} Knots in {weather.wind.deg}&deg;</h3>
          </div>
        </div>
      )}

      {/* Forecast Display */}
      {forecast.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.map((f, idx) => (
              <div className="forecast-card" key={idx}>
                <p>{dateFormat(f.dt_txt, "dddd")}</p>
                <img src={`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`} alt="" />
                <p>{f.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
