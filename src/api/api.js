const API_KEY = "5b004bed6ca216e852726b1d1483f310"; 

const getWeather = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching weather:", err);
    return {};
  }
};

const getForecast = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();

    if (!data.list || !Array.isArray(data.list)) {
      return [];
    }

    const filteredForecast = data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5);

    return filteredForecast;
  } catch (err) {
    console.error("Error fetching forecast:", err);
    return [];
  }
};

export default getWeather;
export { getForecast };
