const API_KEY = "c92f71fdd492c730504dffc18ac179b5";
const weatherInfoDiv = document.querySelector("#weatherInfo");
const recentlysearchedDiv = document.querySelector("#recentlysearched");
const weatherForm = document.querySelector("form");

let recentlysearched = [];

const displayrecentlysearched = () => {
  let recentlysearchedList = "";
  recentlysearched.forEach(city => {
    recentlysearchedList += `<p>${city}</p>`;
  });
  recentlysearchedDiv.innerHTML = recentlysearchedList;
};

weatherForm.addEventListener("submit", event => {
  event.preventDefault();
  const city = document.querySelector("#cityInput").value;

  recentlysearched.unshift(city);
  recentlysearched = recentlysearched.slice(0, 5);
  displayrecentlysearched();

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

  Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([weatherInfo, forecastData]) => {
      const date = new Date();
      const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;
      const temperature = weatherInfo.main.temp;
      const humidity = weatherInfo.main.humidity;
      const windSpeed = weatherInfo.wind.speed;
      const weatherReport = `
        <p>City: ${city}</p>
        <p>Date: ${date.toDateString()}</p>
        <img src="${iconUrl}" alt="Weather icon">
        <p>Temperature: ${temperature} Kelvin</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
      let forecastReport = "<h3>5-Day Forecast</h3>";
      for (let i = 0; i < forecastData.list.length; i++) {
        if (forecastData.list[i].dt_txt.includes("12:00:00")) {
          const forecastDate = new Date(forecastData.list[i].dt * 1000);
          const forecastIconUrl = `https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png`;
          const forecastTemperature = forecastData.list[i].main.temp;
          const forecastHumidity = forecastData.list[i].main.humidity;
          forecastReport += `
            <p>
              ${forecastDate.toDateString()}:
              <img src="${forecastIconUrl}" alt="Weather icon">
              Temp: ${forecastTemperature} Kelvin,
              Humidity: ${forecastHumidity}%
            </p>
          `;
        }
      }
      weatherInfoDiv.innerHTML = weatherReport + forecastReport;
    });
});
