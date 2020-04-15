// prepare API call
const params = [
  'named',
  'station_state',
  'kioskstate',
  'creditcard',
  'nbbike',
  'overflowactivation'
]
const endPoint = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel';
const getApiUrl = (endPoint, params) => {
  let paramsString = ''
  params.forEach((param) => {
    paramsString = `&facet=${param}`
  });
  return `${endPoint}&rows=100${paramsString}`
}

// funcs to fill page
const showStation = (selector, name, numberClassicalVelibs, numberElectricVelibs) => {
  selector.innerHTML += `
    <div class='col col-4 border rounded p-1'>
      <h6> ${name}</h6>
      <p class="small"><span class="badge badge-secondary">${numberClassicalVelibs}</span> classical Velibs</p>
      <p class="small"><span class="badge badge-secondary">${numberElectricVelibs}</span> electric Velibs</p>
    </div>
  `
}

const fillPage = () => { 
  fetch(getApiUrl(endPoint, params))
  .then((response)=>(response.json()))
  .then((response)=>{
    let now = new Date;
    timer.innerHTML = now;
    console.log(now);
    scope = response.records.slice(0,10)
    // only the 10 first is shown coz it takes too long to get all the info
    stationInfoZone.innerHTML = '';
    // see comments below
    scope.forEach((record)=>{
      showStation(stationInfoZone, record.fields.name, record.fields.mechanical, record.fields.ebike)   
    });
  }).catch((error) => console.log(error));
}

// actions on page load
const stationInfoZone = document.querySelector('#station_info_zone');
const timer = document.querySelector('#timer');
let now = new Date
timer.innerHTML = now;
fillPage();
setInterval(fillPage, 1000 * 60);

// setInterval executes after the interval. 
// need to call the func at page loaded and THEN setInterval
// setInterval callbacks (if named) need to be written in ES5 

// needed to wipe the page between each interval
// not good UI
// if only updating 10, to optimize UI, need to preset HTML and only update numbers
// for whole updating without know the length of array, need to wipe off anyway