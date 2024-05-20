const overlay = document.querySelector(".overlay");
const anm = document.getElementById("loading");

let date_obj = new Date();
let monthName = date_obj.toLocaleString("default", { month: "long" });
let current_date = date_obj.getDate() + " / " + monthName + " / " + date_obj.getFullYear();
document.getElementById("current-date").innerHTML = "📆" + current_date;

let f_values = [];
let c_values = [];

let current_humidity;

findCurrentWeather();

async function findCurrentWeather() {

  overlay.style.display = "block";
  anm.style.display = "block";

  let location = document.getElementById("txt-location").value;
  if (location == "") {
    location = "Colombo";
  }
  document.getElementById("txt-location").value = "";

  await fetch("https://api.weatherapi.com/v1/forecast.json?key=9f2a2a57edc4446087b63913241204&q=" + location + "&days=7&aqi=no&alerts=no")
    .then((res) => res.json())
    .then((values) => {

      document.getElementById("location-name").innerHTML = "📍" + values.location.name;
      document.getElementById("current-temp").innerHTML = values.current.temp_c + " °C";
      document.getElementById("temp-status").innerHTML = values.current.condition.text;
      document.getElementById("wind").innerHTML = "🌀 wind - " + values.current.wind_kph + "km/h";
      document.getElementById("humidity").innerHTML = "💦 humidity - " + values.current.humidity + "%";
      document.getElementById("feels-like").innerHTML = "🌡️ Feels like - " + values.current.feelslike_c + "°C";
      document.getElementById("visibility").innerHTML = "🔎 Visibility - " + values.current.vis_km + "km";

      current_humidity = values.current.humidity;
      document.getElementById("circle-humidity").innerHTML = current_humidity;
      document.getElementById("card2-presure").innerHTML = "Presure : " + values.current.pressure_mb + " mb";
      document.getElementById("card2-fl").innerHTML = "Feels Like : " + values.current.feelslike_c + " °C";
      document.getElementById("card2-visibility").innerHTML = "Visibility : " + values.current.vis_km + " km";

      loadCircle();

      document.getElementById("card3-wind-speed").innerHTML = "Wind Speed : " + values.current.wind_kph + " kph";
      document.getElementById("card3-wind-degree").innerHTML = "Wind Speed : " + values.current.wind_degree;
      document.getElementById("card3-wind-direction").innerHTML = "wind Direction : " + values.current.wind_dir;
      document.getElementById("card3-cloud").innerHTML = "Cloud : " + values.current.cloud;

      document.getElementById("sun-rise").innerHTML = "Sunrise : " + values.forecast.forecastday[0].astro.sunrise;
      document.getElementById("sun-set").innerHTML = "Sunset : " + values.forecast.forecastday[0].astro.sunset;

      document.getElementById("moon-rise").innerHTML = "Moonrise : " + values.forecast.forecastday[0].astro.moonrise;
      document.getElementById("moon-set").innerHTML = "Moonset : " + values.forecast.forecastday[0].astro.moonset;


      let temp_image = values.current.condition.icon;

      let image = document.getElementById("main-card-temp-img");
      image.src = temp_image;

      c_values[0] = values.current.temp_c;
      c_values[1] = values.current.feelslike_c;
      f_values[0] = values.current.temp_f;
      f_values[1] = values.current.feelslike_f;


      let current_latitude = values.location.lat;
      let current_longtitude = values.location.lon;
      getAllWeather(current_latitude, current_longtitude)

      overlay.style.display = "none";
      anm.style.display = "none";
    })
    .catch(error => {
      {
        alert("Cant find Location");
        location = "colombo";
      }
    })
    .finally(() => {
      let mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
      let iframe = document.getElementById('myMap');
      iframe.src = mapUrl;

      overlay.style.display = "none";
      anm.style.display = "none";
    });


}

function loadCircle() {
  let block = document.querySelectorAll('.block');

  block.forEach(item => {
    let number_str = current_humidity;
    let num = parseInt(number_str);
    let count = 0;
    let time = 2000 / num;
    let circle = item.querySelector('.circle');
    setInterval(() => {
      if (count == num) {
        clearInterval();
      } else {
        count += 1;
        number_str = count;
      }
    }, time)
    circle.style.strokeDashoffset
      = 503 - (503 * (num / 100));
    let dots = item.querySelector('.dots');
    dots.style.transform =
      `rotate(${360 * (num / 100)}deg)`;
    if (num == 100) {
      dots.style.opacity = 0;
    }
  })
}

let all_weathers_max_c = [];
let all_weathers_min_c = [];
let all_weathers_max_f = [];
let all_weathers_min_f = [];

function getAllWeather(current_latitude, current_longtitude) {
  fetch("https://api.open-meteo.com/v1/forecast?latitude=" + current_latitude + "&longitude=" + current_longtitude + "&daily=weather_code,temperature_2m_max,temperature_2m_min&past_days=7")
    .then((res) => res.json())
    .then((values) => {

      for (let i = 0; i < 14; i++) {
        all_weathers_max_c[i] = values.daily.temperature_2m_max[i];
        all_weathers_min_c[i] = values.daily.temperature_2m_min[i];
      }

      let day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let history_array = document.getElementsByClassName("history-day");
      let forcast_array = document.getElementsByClassName("forcast-day");

      for (let i = 0; i < forcast_array.length; i++) {
        let temp_date = new Date(values.daily.time[i + 8]);
        forcast_array[i].innerHTML = day_names[temp_date.getDay()] + " " + temp_date.getDate();
      }

      for (let i = 0; i < history_array.length; i++) {
        let temp_date = new Date(values.daily.time[i + 1]);
        history_array[i].innerHTML = day_names[temp_date.getDay()] + " " + temp_date.getDate();
      }

      setForcastInCelcious();
      setHistoryInCelcious();

    })

  fetch("https://api.open-meteo.com/v1/forecast?latitude=" + current_latitude + "&longitude=" + current_longtitude + "&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&past_days=7")
    .then((res) => res.json())
    .then((values) => {
      for (let i = 0; i < 14; i++) {
        all_weathers_max_f[i] = values.daily.temperature_2m_max[i];
        all_weathers_min_f[i] = values.daily.temperature_2m_min[i];
      }
    })
}

function setForcastInCelcious() {
  let ids = document.getElementsByClassName("forcast-temp");
  for (let i = 8, j = 0; i < 14; i++, j++) {
    ids[j].innerHTML = all_weathers_max_c[i] + " - " + all_weathers_min_c[i] + " °C";

  }
}

function setForcastInFeranheit() {
  let ids = document.getElementsByClassName("forcast-temp");
  for (let i = 8, j = 0; i < 14; i++, j++) {
    ids[j].innerHTML = all_weathers_max_f[i] + " - " + all_weathers_min_f[i] + " °F";
  }
}

function setHistoryInCelcious() {
  let ids = document.getElementsByClassName("history-temp");
  for (let i = 0; i < 6; i++) {
    ids[i].innerHTML = all_weathers_max_c[i + 1] + " - " + all_weathers_min_c[i + 1] + " °C";
  }
}

function setHistoryInFeranheit() {
  let ids = document.getElementsByClassName("history-temp");
  for (let i = 0; i < 6; i++) {
    ids[i].innerHTML = all_weathers_max_f[i + 1] + " - " + all_weathers_min_f[i + 1] + " °F";
  }
}


function allToFahrenheit() {
  document.getElementById("current-temp").innerHTML = f_values[0] + " °F";
  document.getElementById("feels-like").innerHTML = "🌡️ Feels like - " + f_values[1] + "°F";
  document.getElementById("card2-fl").innerHTML = "Feels Like : " + f_values[1] + "°F";
  setForcastInFeranheit();
  setHistoryInFeranheit();
}

function allToCelsius() {
  document.getElementById("current-temp").innerHTML = c_values[0] + " °C";
  document.getElementById("feels-like").innerHTML = "🌡️ Feels like - " + c_values[1] + "°c";
  document.getElementById("card2-fl").innerHTML = "Feels Like : " + c_values[1] + "°C";
  setForcastInCelcious();
  setHistoryInCelcious();

}



