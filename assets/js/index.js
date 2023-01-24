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
    //weatherApp.getCurrentLocation();
    weatherApp.getAnyLocation();
  },
  fetchWeather: (lat, lon) => {
    // //https://openweathermap.org/api/geocoding-api
    // var city = "mesa";
    // var state = "AZ";
    const apikey = "443d0f967419d0d088b3f740ceaaae6e";
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

    const weatherurlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;
    const weatherurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //experienced a CORS error on fetch attemp 11:51PM 01/22/23
    fetch(weatherurlNow)
      .then((response) => response.json())
      .then((data) => weatherApp.showWeatherNow(data))
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });
    fetch(weatherurl)
      .then((response) => response.json())
      .then((data) => weatherApp.showWeatherForecast(data))
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });
    //https://www.youtube.com/watch?v=nGVoHEZojiQ&ab_channel=SteveGriffith-Prof3ssorSt3v3
    //https://www.youtube.com/watch?v=tc8DU14qX6I&ab_channel=TheCodingTrain
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
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
    fetch(geourl)
      .then((response) => response.json())
      .then((data) => {
        var geoObj = Object.assign(data);
        var geoarraylat = geoObj[0].lat;
        var geoarraylon = geoObj[0].lon;
        weatherApp.successAny(geoarraylat, geoarraylon);
      })
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });
  },
  successCurrent: (position) => {
    // show the longitude and latitude on the UI
    // document.getElementById("latitude").value =
    //   position.coords.latitude.toFixed(2);
    // document.getElementById("longitude").value =
    //   position.coords.longitude.toFixed(2);
    // console.log(position);
    weatherApp.fetchWeather(
      position.coords.latitude, //.toFixed(1),
      position.coords.longitude //.toFixed(1)
    );
  },
  successAny: (lat, lon) => {
    // show the longitude and latitude on the UI
    // document.getElementById("latitude").value = lat;
    // document.getElementById("longitude").value = lon;
    // console.log(lat, lon);
    weatherApp.fetchWeather(lat, lon);
  },
  fail: (err) => {
    console.log("you have an error");
  },
  showWeatherForecast: (response) => {
    console.log(response);
    for (let i = 0; i < 40; i++) {
      const date = response.list[i].dt_txt;
      const dateConvertTime = dayjs(date).format("H");
      //the weather for the day is determined by weather at noon
      if (dateConvertTime == 12) {
        //(01/30/2023 format)
        const dateConvertDay = dayjs(date).format("MM/DD/YYYY");
        //(temp + " deg F)
        const temp = response.list[i].main.temp;
        //(hum + " % humid")
        const hum = response.list[i].main.humidity;
        //(wind + " MPH wind");
        const wind = response.list[i].wind.speed;
        //(used to determine the img used for display);
        const iconcode = response.list[i].weather[0].icon;
        const iconurl =
          "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
      }
    }
  },
  showWeatherNow: (response) => {
    console.log(response);
    const nowTime = dayjs().format("hh:mm");
    const nowDate = dayjs().format("MM/DD/YYYY");
    const nowTemp = response.main.temp;
    const nowHum = response.main.humidity;
    const nowWind = response.wind.speed;
    const nowIconcode = response.weather[0].icon;
    const nowIconurl =
      "http://openweathermap.org/img/wn/" + nowIconcode + "@2x.png";
  },
};

weatherApp.init();
