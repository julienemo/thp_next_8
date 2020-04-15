// prepare API call
const apiKey = '42d30bbbb4ab42d88d352745a14753d7';
const endPointCurrent = 'https://api.weatherbit.io/v2.0/current?'
const endPointForecast ='https://api.weatherbit.io/v2.0/forecast/daily?'
const composeUrl = (endPoint) => {
  return `${endPoint}key=${apiKey}&lat=${queryLat}&lon=${queryLon}`
}
// set default position (city of Paris, FR) in case user refuses to reveal
const defaultLat = 48.866667;
const defaultLon = 2.333333;
const userCoords =() => {
  let array = [];
  navigator.geolocation.getCurrentPosition((position)=>{
    array.push(position.coords.latitude)
    array.push(position.coords.longitude)
  })
  return array
}
// prepare page filling
const currentZone = document.querySelector('#current_zone');
const forecastZone = document.querySelector('#forecast_zone');

// page filling funcs
const fillCurrent = () =>{
  fetch(composeUrl(endPointCurrent))
  .then((response) => (response.json()))
  .then((response) => {
    let data = response.data[0];
    currentZone.innerHTML = `
      <h4>${data.city_name} <span class='small'>${data.country_code}</span></h4>
      <p id='current_temperature'>${data.temp}°C</p>
      <p class="small"> last update: ${data.last_ob_time}</p>
    `
  }).catch((error) => (console.log(error)))
}

const fillForecast = () => {
  fetch(composeUrl(endPointForecast))
  .then((response) => (response.json()))
  .then((response) => {
    let data = response.data.slice(1,10);
    forecastZone.innerHTML = '';
    data.forEach((ele) => {
      forecastZone.innerHTML += `
        <div class='col col-3'>
          <p>${ele.timestamp_local}</p>
          <p>${ele.temp}°C</p>
        </div>
      `   
    })
  }).catch((error)=>(console.log(error)))
}

// page load 


userCoords()
let userPosition = userCoords();
let queryLat = userCoords()[0] || defaultLat;
let queryLon = userCoords()[1] || defaultLon;

fillCurrent();
//fillForecast();

//setInterval(fillCurrent, 1000)
//setInterval(fillCurrent, 1000)

