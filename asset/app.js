//-------set current date-----------------
let date_obj = new Date();
let monthName = date_obj.toLocaleString("default", { month: "long" });
let current_date = date_obj.getDate() + " / " + monthName + " / " + date_obj.getFullYear();
document.getElementById("current-date").innerHTML = "📆" + current_date;

//-------------------------------------------

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day_number = date_obj.getDay();


let count = day_number + 1;
let j = 0;
let temp_ar = [];
// while (true) {
//     if (count == 7) {
//         count = 0;
//     }
//     else if (count == day_number) {
//         break;
//     }
//     temp_ar.push(days[count++]);
// }
let dayNumbers = [];

for (let i = 0; i < 7; i++) {
    date_obj.setDate(date_obj.getDate() + 1); // Add one day
    dayNumbers.push(date_obj.getDate());
}

// document.getElementById("forcast-d1").innerHTML = temp_ar[0] + " " + dayNumbers[0];
// document.getElementById("forcast-d2").innerHTML = temp_ar[1] + " " + dayNumbers[1];
// document.getElementById("forcast-d3").innerHTML = temp_ar[2] + " " + dayNumbers[2];


let f_values = [];
let c_values = [];

let current_weather = [];

findWeather();

function findWeather() {

    let location = document.getElementById("txt-location").value;
    if (location == "") {
        location = "Colombo";
    }
    document.getElementById("txt-location").value = "";

    fetch("http://api.weatherapi.com/v1/forecast.json?key=9f2a2a57edc4446087b63913241204&q=" + location + "&days=7&aqi=no&alerts=no")
        .then((res) => res.json())
        .then((values) => {
            document.getElementById("location-name").innerHTML = "📍" + values.location.name;
            document.getElementById("current-temp").innerHTML = values.current.temp_c + "°C";
            document.getElementById("temp-status").innerHTML = values.current.condition.text;
            document.getElementById("wind").innerHTML = "🌀 wind - " + values.current.wind_kph + "km/h";
            document.getElementById("humidity").innerHTML = "💦 humidity - " + values.current.humidity + "%";
            document.getElementById("feels-like").innerHTML = "🌡️ Feels like - " + values.current.feelslike_c + "°C";
            document.getElementById("visibility").innerHTML = "🔎 Visibility - " + values.current.vis_km + "km";

            let temp_image = values.current.condition.icon;

            let image = document.getElementById("main-card-temp-img");
            image.src = temp_image;

            c_values.push(values.current.temp_c);
            f_values.push(values.current.temp_f);



            // for (let i = 0; i < 24; i++) {
            //     let datetime = values.forecast.forecastday[0].hour[i].time;

            //     let dateObject = new Date(datetime);
            //     let time = dateObject.toLocaleTimeString();


            //     if (time == "6:00:00 AM" || time == "9:00:00 AM" || time == "12:00:00 PM" || time == "3:00:00 PM" || time == "6:00:00 PM" || time == "9:00:00 PM") {
            //         current_weather.push(values.forecast.forecastday[0].hour[i].temp_c)

            //     }
            // }


            // for (let i = 0; i < 3; i++) {


            //     let max_temp = values.forecast.forecastday[i].day.maxtemp_c;
            //     let min_temp = values.forecast.forecastday[i].day.mintemp_c;

            //     c_values.push(max_temp);
            //     c_values.push(min_temp);
            //     f_values.push(values.forecast.forecastday[i].day.maxtemp_f);
            //     f_values.push(values.forecast.forecastday[i].day.mintemp_f);

            //     switch (i) {
            //         case 0: document.getElementById("forcast-temp-d1").innerHTML = max_temp + " - " + min_temp; break;
            //         case 1: document.getElementById("forcast-temp-d2").innerHTML = max_temp + " - " + min_temp; break;
            //         case 2: document.getElementById("forcast-temp-d3").innerHTML = max_temp + " - " + min_temp; break;
            //         case 3: document.getElementById("forcast-temp-d4").innerHTML = max_temp + " - " + min_temp; break;
            //         case 4: document.getElementById("forcast-temp-d5").innerHTML = max_temp + " - " + min_temp; break;
            //         case 5: document.getElementById("forcast-temp-d6").innerHTML = max_temp + " - " + min_temp; break;
            //     }
            // }

        })

    let mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
    let iframe = document.getElementById('myMap');
    iframe.src = mapUrl;

    
}




const block = document.querySelectorAll('.block');
window.addEventListener('load', function(){
  block.forEach(item => {
    let numElement = item.querySelector('.num');
    let num = parseInt(numElement.innerText);
    let count = 0;
    let time = 2000 / num;
    let circle = item.querySelector('.circle');
    setInterval(() => {
      if(count == num){
        clearInterval();
      } else {
        count += 1;
        numElement.innerText = count;
      }
    }, time)
    circle.style.strokeDashoffset 
      = 503 - ( 503 * ( num / 100 ));
    let dots = item.querySelector('.dots');
    dots.style.transform = 
      `rotate(${360 * (num / 100)}deg)`;
    if(num == 100){
      dots.style.opacity = 0;
    }
  })
});

