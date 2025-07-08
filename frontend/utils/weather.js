import axios from 'axios';

export async function fetchWeather(lat, lon) {
  try {
    // Set your OpenWeatherMap API key here or via environment
    const API_KEY = process.env.OPENWEATHER_API_KEY || '<YOUR_OPENWEATHER_API_KEY>';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
    const response = await axios.get(url);
    if (response.data) {
      const { weather, main, wind, name } = response.data;
      return {
        city: name,
        main: weather[0]?.main,
        desc: weather[0]?.description,
        temp: Math.round(main.temp),
        wind: wind.speed,
        icon: weather[0]?.icon,
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}
