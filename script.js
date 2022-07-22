
//declaration of variables
let apikey = '3cb1e3bc09d345e92039e64c76ec688d'
const city = document.getElementById('search-input');
const search_btn = document.getElementById('search-btn');
const timeEI = document.getElementById("time");
const dayEI = document.querySelector('.day');
const dateEI = document.querySelector('.date');
const timezoneEI = document.getElementById('time-zone');
const cityEI = document.getElementById('city');
var clearC = undefined;
var flag = 0;
const todayEI = document.querySelector('.today');
const imagedesEI = document.querySelector('.img-des');
const daynighttempEI = document.querySelector('.day-night-temp');
const humidityEI = document.getElementById('humidity');
const pressureEI = document.getElementById('pressure');
const wind_speedEI = document.getElementById('wind-speed');
const sunriseEI = document.getElementById('sunrise');
const sunsetEI = document.getElementById('sunset');
const moonriseEI = document.getElementById('moonrise');
const moonsetEI = document.getElementById('moonset');
const hourlyForecastEI = document.querySelector('.hourly-forecast');
const dailyForecastEI = document.querySelector('.daily-forecast');


const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];


//getting current location
geolocationWeatherData();
function geolocationWeatherData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert('Your browser does not support geolocation api');
    }
}

//For current Location
function onSuccess(position) {
    let { latitude, longitude } = position.coords;
    onCallAPI(latitude, longitude);
}
function onError(error) {
    alert(error.message);
}



search_btn.addEventListener("click", () => {
    if (city.value != "") {
        flag = 1;
        requestApi(city.value);
    }
    else {
        alert('Please enter something');
    }
});

//For searched city
function requestApi(city) {

    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&lang=ru`;
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == "404") {
        alert('No such city');
    }
    cityEI.innerHTML = info.name;
    const { lon, lat } = info.coord;
    onCallAPI(lat, lon);

}

//Calling API
function onCallAPI(lat, long) {
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&appid=${apikey}&lang=ru`;
    fetch(api).then(res => res.json()).then(data => Details(data));
}

//Filling Details of Weather
function Details(data) {

    timezoneEI.innerHTML = data.timezone;  // timezone
    let dt = data.current.dt;

    // ===================================================================== + + =================================================================
    //Time date section
    clearInterval(clearC);
    clearC = setInterval(() => {
        moment().locale('ru')
        const month = moment(dt * 1000).format('M');
        const year = moment(dt * 1000).format('YYYY');
        const date = moment(dt * 1000).format('DD');
        const day = moment(dt * 1000).format('d');
        const timezoneInMinutes = data.timezone_offset / 60;
        timeEI.innerHTML = moment().utcOffset(timezoneInMinutes).format("HH:mm");

        dayEI.innerHTML = days[day] + ',';
        dateEI.innerHTML = date + ' ' + months[month - 1] + ' ' + year;
    }, 1000);


    // ============================================================= + + =======================================================================
    // Weather Details of today 
    const { id, description } = data.current.weather[0];
    // console.log(id);
    if (id >= 200 && id <= 232) {
        imagedesEI.innerHTML =
            `<img src="thunderstorms.svg" alt="Weather Icon">
        <div class="des">
            ${description}
        </div>
        `
    }
    else if (id >= 300 && id <= 321) {
        imagedesEI.innerHTML = `<img src="images/drizzle.svg" alt="Weather Icon">
        <div class="des">
        ${description}
        </div>`
    }
    else if (id >= 500 && id <= 531) {
        imagedesEI.innerHTML = `<img src="images/rain.svg" alt="Weather Icon">
        <div class="des">
        ${description}
        </div>`
    }
    else if (id >= 600 && id <= 622) {
        imagedesEI.innerHTML = `<img src="images/snow.svg" alt="Weather Icon">
        <div class="des">
        ${description}
        </div>`
    }
    else if (id >= 701 && id <= 781) {
        imagedesEI.innerHTML = `<img src="images/fog-day.svg" alt="Weather Icon">
        <div class="des">
        ${description}
        </div>`
    }
    else if (id == 800) {
        imagedesEI.innerHTML = `<img src="images/clear-day.svg" alt="Weather Icon">
        <div class="des">
        ${description}
        </div>`
    }
    else {
        imagedesEI.innerHTML = `<img src="images/cloudy.svg" alt="Weather Icon">
        <div class="des">
        ${description}
        </div>`
    }

    const { day, night } = data.daily[0].temp;
    daynighttempEI.innerHTML =
        `<div class="temp">
            <div class="heading">Температура Днем</div>
            ${day}° 
        </div>
        <div class="temp">
            <div class="heading">Температура Ночью</div>
            ${night}° 
        </div>`

    const { humidity, pressure, wind_speed, sunrise, sunset } = data.current;
    const { moonrise, moonset } = data.daily[0];

    humidityEI.innerHTML = humidity;
    pressureEI.innerHTML = pressure;
    wind_speedEI.innerHTML = wind_speed;

    sunriseEI.innerHTML = moment(sunrise * 1000).format('HH:mm');
    sunsetEI.innerHTML = moment(sunset * 1000).format('HH:mm');
    moonriseEI.innerHTML = moment(moonrise * 1000).format('HH:mm');
    moonsetEI.innerHTML = moment(moonset * 1000).format('HH:mm');

    //==================================================================== + + =============================================================

    // Houlry Forecast

    let hourlyforecast = ``;
    data.hourly.forEach((day, idx) => {
        if (idx % 4 == 0) {
            hourlyforecast += `
            <div class="card">
                <div class="time">${moment(day.dt * 1000).format('HH:mm')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="" srcset="">
                <div class="temp">${day.temp}°C</div>
            </div>
            `
        }
    });

    hourlyForecastEI.innerHTML = hourlyforecast;

    // ======================================================== + + =============================================================================

    //Daily Forecast
    let dailyforecast = ``;
    data.daily.forEach((day, idx) => {
        if (idx != 0) {
            dailyforecast += `
        <div class="card">
                <div class="time">${days[moment(day.dt * 1000).format('d')]} <span></span></div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="" srcset="">
                <div class="temp">${day.temp.day}°C</div>
            </div>
        `
        }
    });

    dailyForecastEI.innerHTML = dailyforecast;
}

// ============================================================== + + ===============================================================================
