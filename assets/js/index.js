const weatherApp = {
  init: () => {
    // document
    //   .getElementById("btnGet")
    //   .addEventListener("click", weatherApp.fetchWeather);
    // document
    //   .getElementById("btnCurrent")
    //   .addEventListener("click", weatherApp.getCurrentLocation);
    // document
    //   .getElementById("btnAny")
    //   .addEventListener("click", weatherApp.getAnyLocation);
    weatherApp.getCurrentLocation();
    weatherApp.getAnyLocation();
  },
  fetchWeather: (lat, lon) => {
    // //https://openweathermap.org/api/geocoding-api
    // var city = "mesa";
    // var state = "AZ";
    var apikey = "443d0f967419d0d088b3f740ceaaae6e";
    // var geourl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${apikey}`;
    // // var geoObj = {};
    // // var geoarraylat = "";
    // // var geoarraylon = "";
    // fetch(geourl)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     var geoObj = Object.assign(data);
    //     var geoarraylat = geoObj[0].lat;
    //     var geoarraylon = geoObj[0].lon;

    //https://openweathermap.org/forecast5
    //https://www.latlong.net/
    // var lat = "33.415180";
    // var lon = "-111.831497";
    var weatherurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`;
    console.log(lat);
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //experienced a CORS error on fetch attemp 11:51PM 01/22/23
    fetch(weatherurl)
      .then((response) => response.json())
      .then((data) => weatherApp.showWeather(data))
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });
    //https://www.youtube.com/watch?v=nGVoHEZojiQ&ab_channel=SteveGriffith-Prof3ssorSt3v3
  },

  getCurrentLocation: (ev) => {
    let opts = {
      enableHighAccuracy: true,
      timeout: 1000 * 10, //seconds
      maximumAge: 1000 * 60 * 5, //5 minutes
    };
    navigator.geolocation.getCurrentPosition(
      weatherApp.successCurrent,
      weatherApp.fail,
      opts
    );
  },
  getAnyLocation: (event) => {
    var city = "mesa";
    var state = "AZ";
    var apikey = "443d0f967419d0d088b3f740ceaaae6e";
    var geourl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${apikey}`;
    // var geoObj = {};
    // var geoarraylat = "";
    // var geoarraylon = "";
    fetch(geourl)
      .then((response) => response.json())
      .then((data) => {
        var geoObj = Object.assign(data);
        var geoarraylat = geoObj[0].lat;
        var geoarraylon = geoObj[0].lon;
        weatherApp.successAny(geoarraylat, geoarraylon);
      });
  },
  successCurrent: (position) => {
    // show the longitude and latitude on the UI
    // document.getElementById("latitude").value =
    //   position.coords.latitude.toFixed(2);
    // document.getElementById("longitude").value =
    //   position.coords.longitude.toFixed(2);
  },
  successAny: (lat, lon) => {
    // show the longitude and latitude on the UI
    // document.getElementById("latitude").value = lat;
    // document.getElementById("longitude").value = lon;
    weatherApp.fetchWeather(lat, lon);
  },
  fail: (err) => {
    console.log("you have an error");
  },
  showWeather: (response) => {
    console.log(response);
  },
};

weatherApp.init();
