// prepare API call
const params = [
  'named',
  'station_state',
  'kioskstate',
  'creditcard',
  'nbbike',
  'overflowactivation'
]
const endPoint = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&rows=5';
  // rows = 5, asking for only 5 station
  // purely out of exercice perf and API limit concern

const getApiUrl = (endPoint, params) => {
  let paramsString = ''
  params.forEach((param) => {
    paramsString = `&facet=${param}`
  });
  return `${endPoint}${paramsString}`
}

// funcs to fill page
const showStation = (
  selector, 
  name, 
  numberClassicalVelibs, 
  numberElectricVelibs,
  coords) => {
  selector.innerHTML += `
    <div class='col col-4 border rounded p-1'>
      <h6> ${name}</h6>
      <p class="small"><span class="badge badge-secondary">${numberClassicalVelibs}</span> classical Velibs</p>
      <p class="small"><span class="badge badge-secondary">${numberElectricVelibs}</span> electric Velibs</p>
    </div>
  `
  L.circle([coords[0], coords[1]], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100
  }).addTo(mymap).bindPopup(`<p class='small'>${name}</p>`);
}

const fillPage = () => { 
  fetch(getApiUrl(endPoint, params))
  .then((response)=>(response.json()))
  .then((response)=>{
    let now = new Date;
    timer.innerHTML = now;
    console.log(now);
    scope = response.records;
    stationInfoZone.innerHTML = '';
    // see comments below
    scope.forEach((record)=>{
      showStation(
        stationInfoZone, 
        record.fields.name, 
        record.fields.mechanical, 
        record.fields.ebike,
        record.fields.coordonnees_geo)   
    });
  }).catch((error) => console.log(error));
}

// prepare map
// default location: city of Paris
const defaultLat = 48.855;
const defaultLon = 2.35;

// actions on page load
var mymap = L.map('mapid').setView([defaultLat, defaultLon], 11);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoianVsaWtra2siLCJhIjoiY2syYzZzNjVuM2E3cjNpbnI4eTYybjU3MCJ9.kgUQgPVLk_szgs1yMNHliw'
}).addTo(mymap);

const stationInfoZone = document.querySelector('#station_info_zone');
const timer = document.querySelector('#timer');
let now = new Date
timer.innerHTML = now;
fillPage();
//setInterval(fillPage, 1000 * 600);

// setInterval executes after the interval. 
// need to call the func at page loaded and THEN setInterval
// setInterval callbacks (if named) need to be written in ES5 

// needed to wipe the page between each interval
// not good UI
// if only updating 10, to optimize UI, need to preset HTML and only update numbers
// for whole updating without know the length of array, need to wipe off anyway