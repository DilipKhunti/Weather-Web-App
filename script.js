document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("city");
  const searchBtn = document.getElementById("search-btn");
  const weather_img = document.querySelector(".weather-img");
  const temperature = document.querySelector(".temperature span");
  const description = document.querySelector(".description");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const body = document.body;
  const container = document.querySelector(".container");
  const search_img = document.querySelector(".search-img");
  const humidity_img = document.querySelector(".humidity-img");
  const wind_img = document.querySelector(".wind-img");

  const weatherBody = document.querySelector(".weather-body");
  const locationNotFound = document.querySelector(".location-not-found");

  const weatherappid = "YOUR_API_KEY";
  const timezoneappid = "YOUR_API_KEY";

  async function checkWeather(city) {
    var weather_data;
    var time_data;
    var dayStatus;

    try {
      const weatherurl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${weatherappid}`;
      const weather_response = await fetch(weatherurl);
      if (!weather_response.ok) {
        throw new Error("Weather data not available");
      }
      weather_data = await weather_response.json();

      if (weather_data.cod == "404") {
        throw new Error("city not found");
      }
      const timeurl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneappid}&format=json&by=position&lat=${weather_data.coord.lat}&lng=${weather_data.coord.lon}`;

      time_response = await fetch(timeurl);
      if (!time_response.ok) {
        throw new Error("Time data not available");
      }
      const time_data = await time_response.json();

      if (time_data.cod == "404") {
        throw new Error("city not found");
      }

      dayStatus = isDayOrNight(time_data.formatted);
      changeStyle(dayStatus);

      console.log(weather_data);
      console.log(time_data);
    } catch (error) {
      console.error("Error fetching data:", error);
      locationNotFound.style.display = "flex";
      weatherBody.style.display = "none";
      return;
    }

    locationNotFound.style.display = "none";
    weatherBody.style.display = "flex";

    addAnimation(temperature, "fadeIn");
    addAnimation(description, "fadeIn");
    addAnimation(humidity, "fadeIn");
    addAnimation(windSpeed, "fadeIn");
    addAnimation(weather_img, "slideIn");
    addAnimation(body, "fadeIn");
    addAnimation(container, "fadeIn");

    temperature.innerHTML = `${Math.round(weather_data.main.temp)}`;
    description.innerHTML = `${weather_data.weather[0].description}`;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    windSpeed.innerHTML = `${weather_data.wind.speed} Km/H`;

    switch (weather_data.weather[0].main) {
      case "Clouds":
        weather_img.src = `img/${dayStatus}/cloud.png`;
        break;
      case "Clear":
        weather_img.src = `img/${dayStatus}/clear.png`;
        break;
      case "Rain":
        weather_img.src = `img/${dayStatus}/rain.png`;
        break;
      case "Mist":
        weather_img.src = `img/${dayStatus}/mist.png`;
        break;
      case "Snow":
        weather_img.src = `img/${dayStatus}/snow.png`;
        break;
    }
  }

  function addAnimation(element, animation) {
    element.style.animation = "none";
    element.offsetHeight; // Trigger reflow
    element.style.animation = null;
    element.classList.add(animation);

    // Remove the animation class after animation ends
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animation);
      },
      { once: true }
    );
  }

  function isDayOrNight(datetimeString) {
    const date = new Date(datetimeString);

    const hours = date.getHours();

    const startOfDay = 6;
    const endOfDay = 18;

    if (hours >= startOfDay && hours < endOfDay) {
      return "day";
    } else {
      return "night";
    }
  }

  function changeStyle(dayStatus) {
    if (dayStatus == "day") {
      body.style.backgroundImage = "url(img/day-bg.jpg)";
      body.style.color = "#000";

      search_img.classList.remove("night-imgs");
      humidity_img.classList.remove("night-imgs");
      wind_img.classList.remove("night-imgs");

      inputBox.style.backgroundColor = "#b5dcf5";
      inputBox.style.color = "#000";
      searchBtn.style.backgroundColor = "#b5dcf5";

      container.style.background = "linear-gradient(180deg, #f9f9f9, #4594a6)";
    } else {
      body.style.backgroundImage = "url(img/night-bg.jpg)";
      body.style.color = "#fff";

      search_img.classList.add("night-imgs");
      humidity_img.classList.add("night-imgs");
      wind_img.classList.add("night-imgs");

      inputBox.style.backgroundColor = "#303030";
      inputBox.style.color = "#fff";
      searchBtn.style.backgroundColor = "#303030";

      container.style.background = "linear-gradient(120deg, #4e1230, #181441)";
    }
  }

  searchBtn.addEventListener("click", () => {
    const city = inputBox.value;
    checkWeather(city);
  });
});
