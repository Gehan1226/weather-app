//-------set current date-----------------
let date_obj = new Date();
let monthName = date_obj.toLocaleString("default", { month: "long" });
let current_date = date_obj.getDate() + " / " + monthName + " / " + date_obj.getFullYear();
document.getElementById("current-date").innerHTML = "📆" + current_date;

//-------------------------------------------

findWeather();

function findWeather() {

    let location = document.getElementById("txt-location").value;
    if (location == "") {
        location = "Colombo";
    }
    document.getElementById("txt-location").value = "";

    fetch("http://api.weatherapi.com/v1/forecast.json?key=d6a82ac288ee483387743658241104&q=" + location + "&days=7&aqi=no&alerts=no")
        .then((res) => res.json())
        .then((values) => {
            document.getElementById("location-name").innerHTML = "📍" + values.location.name;
            document.getElementById("current-temp").innerHTML = values.current.temp_c + "°C";
            document.getElementById("temp-status").innerHTML = values.current.condition.text;
            document.getElementById("wind").innerHTML = "🌀 wind - " + values.current.wind_kph + "km/h";
            document.getElementById("humidity").innerHTML = "💦 humidity - " + values.current.humidity + "%";
            document.getElementById("feels-like").innerHTML = "🌡️ Feels like - " + values.current.feelslike_c + "°C";
            document.getElementById("visibility").innerHTML = "🔎 Visibility - " + values.current.vis_km + "km";

        })

    let mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
    let iframe = document.getElementById('myMap');
    iframe.src = mapUrl;


}




