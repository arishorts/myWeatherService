const weatherApp = {
  init: () => {
    $("#btnCurrent").on("click", weatherApp.getCurrentLocation);
    $("#selectContainer")
      .ready()
      .on("click", "button", (event) => {
        weatherApp.getSearchLocation(event.target.innerHTML.trim());
      });
    $("#btnSearch").on("click", weatherApp.validate);
  },

  validate: (event) => {
    event.preventDefault();

    //read user input
    var cityInput = $("#inputLocation").val().trim();
    const charSet = `1234567890"!#$%&'()*+,./:;<=>?@[]^_{|}~`;

    //check if there are numbers or symbols in the value
    let hasCommonElements = charSet
      .split("")
      .some((element) => cityInput.split("").includes(element));
    if (hasCommonElements) {
      throw new Error("must not contain numbers or symbols");
    } else {
      weatherApp.getSearchLocation(cityInput);
    }
    //Validate: how do i validate whether or not the city exists
  },

  fetchWeather: (lat, lon) => {
    // //https://openweathermap.org/api/geocoding-api
    const apikey = "443d0f967419d0d088b3f740ceaaae6e";
    const weatherurlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;
    const weatherurlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //experienced a CORS error on fetch attemp 11:51PM 01/22/23
    fetch(weatherurlNow)
      .then((response) => response.json())
      .then((data) => weatherApp.showWeatherNow(data))
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });
    fetch(weatherurlForecast)
      .then((response) => response.json())
      .then((data) => weatherApp.showWeatherForecast(data))
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });
    //https://www.youtube.com/watch?v=nGVoHEZojiQ&ab_channel=SteveGriffith-Prof3ssorSt3v3
    //https://www.youtube.com/watch?v=tc8DU14qX6I&ab_channel=TheCodingTrain
  },

  getCurrentLocation: (event) => {
    event.preventDefault();
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

  getSearchLocation: (city) => {
    var apikey = "443d0f967419d0d088b3f740ceaaae6e";
    var geourl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${apikey}`;
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
    //var geourl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${apikey}`;
    fetch(geourl)
      .then((response) => response.json())
      .then((data) => {
        var geoObj = Object.assign(data);
        var geoarraylat = geoObj[0].lat;
        var geoarraylon = geoObj[0].lon;
        weatherApp.successSearch(geoarraylat, geoarraylon);
      })
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });
  },

  successCurrent: (position) => {
    weatherApp.fetchWeather(
      position.coords.latitude, //.toFixed(1),
      position.coords.longitude //.toFixed(1)
    );
  },

  successSearch: (lat, lon) => {
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
    //get values from the weather now API object and display them in current weather box
    const nowTime = dayjs().format("hh:mm A [M.T.]");
    const nowDate = dayjs().format("MM/DD/YYYY");
    const nowTemp = response.main.temp;
    const nowHum = response.main.humidity;
    const nowWind = response.wind.speed;
    const nowIconcode = response.weather[0].icon;
    const nowIconurl =
      "http://openweathermap.org/img/wn/" + nowIconcode + "@2x.png";

    $("#locationSelected").text(response.name);
    $("#dateToday").text(`${nowDate} at ${nowTime}`);
    $("#currentContainer")
      .children("div")
      .eq(0)
      .text(`Temp: ${nowTemp} ${String.fromCharCode(176)}F`);
    $("#currentContainer").children("div").eq(1).text(`Wind: ${nowWind} MPH`);
    $("#currentContainer").children("div").eq(2).text(`Humidity: ${nowHum}%`);

    // Create row and columns for project
    var iconEl = $("<img>");
    var iconSpan = $("#iconSpan");
    iconSpan.empty();
    iconEl.attr("src", nowIconurl);

    // append elements to DOM to display them
    iconSpan.append(iconEl);
  },
};

weatherApp.init();
//need to validate city input
