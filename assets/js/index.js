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
    weatherApp.fetchWeather();
  },
  fetchWeather: (ev) => {
    //https://openweathermap.org/api/geocoding-api
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

        //https://openweathermap.org/forecast5
        //https://www.latlong.net/
        // var lat = "33.415180";
        // var lon = "-111.831497";
        var weatherurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoarraylat}&lon=${geoarraylon}&appid=${apikey}`;

        //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        //experienced a CORS error on fetch attemp 11:51PM 01/22/23
        fetch(weatherurl)
          .then((response) => response.json())
          .then((data) => console.log(data));
        //.then((data) => weatherApp.showWeather.data);
        //https://www.youtube.com/watch?v=nGVoHEZojiQ&ab_channel=SteveGriffith-Prof3ssorSt3v3
      });
  },
  getCurrentLocation: (ev) => {
    let opts = {
      enableHighAccuracy: true,
      timeout: 1000 * 10, //seconds
      maximumAge: 1000 * 60 * 5, //5 minutes
    };
    navigator.geolocation.getCurrentPosition(
      weatherApp.success,
      weatherApp.fail,
      opts
    );
  },
  getAnyLocation: (ev) => {},
  success: (position) => {
    // document.getElementById("latitude").value =
    //   position.coords.latitude.toFixed(2);
    // document.getElementById("longitude").value =
    //   position.coords.longitude.toFixed(2);
  },
  fail: (err) => {
    console.log(err);
  },
  showWeather: (resp) => {},
};

weatherApp.init();
