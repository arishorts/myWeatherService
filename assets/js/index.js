const weatherApp = {
  //initiate app
  init: () => {
    //create buttons from history
    searchHistory = weatherApp.readSearchHistoryFromStorage();
    for (let history in searchHistory) {
      weatherApp.createHistoryButton(searchHistory[history]);
    }

    //set event handlers for search location, current location, and select history
    $("#btnCurrent").on("click", weatherApp.getCurrentLocation);
    $("#selectContainer")
      .ready()
      .on("click", "button", (event) => {
        weatherApp.getSearchLocation(event.target.innerHTML.trim());
      });
    $("#btnSearch").on("click", weatherApp.validate);
  },

  //check if there are numbers or symbols in the users search input upon button click
  validate: (event) => {
    event.preventDefault();

    //read user input
    var cityInput = $("#inputLocation").val().trim();
    const charSet = `1234567890"!#$%&'()*+,./:;<=>?@[]^_{|}~`;

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

  //using openweathermap api to fetch weather data
  fetchWeather: (lat, lon) => {
    const apikey = "443d0f967419d0d088b3f740ceaaae6e";
    const weatherurlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;
    const weatherurlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`;

    //weather now
    fetch(weatherurlNow)
      .then((response) => response.json())
      .then((data) => weatherApp.showWeatherNow(data))
      .catch((error) => {
        console.log(error);
        weatherApp.fail;
      });

    //5 day forecast
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

  //asks the user for allowance to get their current location on click event handle
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

  //get location using openweathermap api's geolocation
  getSearchLocation: (city) => {
    var apikey = "443d0f967419d0d088b3f740ceaaae6e";
    var geourl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${apikey}`;
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

    //resets the search input
    $("#inputLocation").val("");
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

  //the weather for each day in the 5 day forecast is determined by weather at noon
  showWeatherForecast: (response) => {
    console.log(response);
    weatherApp.handleHistory(response.city.name);
    $("#forecastFill").empty();
    for (let i = 0; i < 40; i++) {
      const date = response.list[i].dt_txt;
      const dateConvertTime = dayjs(date).format("H");

      if (dateConvertTime == 0) {
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
          "https://openweathermap.org/img/wn/" + iconcode + "@2x.png";

        let myTemplate = `
          <div class="card align-items-center text-center p-lg-0 p-3 col-lg-2 col-md-6 col-8 m-lg-1 m-4 bg-primary">
            <h5 class="card-title my-3 mx-1">${dateConvertDay} at 12PM</h5>
            <img src="${iconurl}" class="card-img-top w-50" alt="..."/>
            <div class="card-body px-1">
              <div class="my-2">Temp: ${temp} degF</div>
              <div class="my-2">Wind: ${wind}  MPH</div>
              <div class="my-2">Humidity: ${hum} %</div>
            </div>
          </div>
        `;

        $("#forecastFill").append(myTemplate);

        //   <div
        //   id="forecastContainer"
        //   class="row m-2 justify-content-lg-between justify-content-center align-items-start"
        // >
        //   <h3 class="mb-2 text-center display-4">
        //     <strong>5-Day Forecast:</strong>
        //   </h3>
        //   <div
        //     class="card align-items-center text-center p-lg-0 p-3 col-lg-2 col-md-6 col-8 m-lg-1 m-4"
        //   >
        //     <h5 class="card-title my-3">9/13/2022</h5>
        //     <img
        //       src="http://openweathermap.org/img/wn/10d@2x.png"
        //       class="card-img-top w-50"
        //       alt="..."
        //     />
        //     <div class="card-body px-1">
        //       <div class="my-2">Temp: 76.62 degF</div>
        //       <div class="my-2">Wind: 8.43 MPH</div>
        //       <div class="my-2">Humidity: 44%</div>
        //     </div>
        //   </div>
      }
    }
  },

  //get values from the weather now API object and display them in current weather box
  showWeatherNow: (response) => {
    const nowTime = dayjs().format("hh:mm A [M.T.]");
    const nowDate = dayjs().format("MM/DD/YYYY");
    const nowTemp = response.main.temp;
    const nowHum = response.main.humidity;
    const nowWind = response.wind.speed;
    const nowIconcode = response.weather[0].icon;
    const nowIconurl =
      "https://openweathermap.org/img/wn/" + nowIconcode + "@2x.png";

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

  // append elements to DOM to display them
  handleHistory: (city) => {
    searchHistory = weatherApp.readSearchHistoryFromStorage();
    var historyContainer = $("#selectContainer");

    if (historyContainer.children().length <= 7) {
      weatherApp.createHistoryButton(city);
      searchHistory.push(city);
      weatherApp.saveSearchHistoryToStorage(searchHistory);
    } else {
      historyContainer.find("button:last").remove();
      weatherApp.createHistoryButton(city);
      searchHistory.push(city);
      searchHistory.splice(0, 1);
      weatherApp.saveSearchHistoryToStorage(searchHistory);
    }
  },

  // Reads projects from local storage and returns array of project objects.
  // Returns an empty array ([]) if there aren't any projects.
  readSearchHistoryFromStorage: () => {
    var searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
    } else {
      searchHistory = [];
    }
    return searchHistory;
  },

  //creates a button when the user recalls history with localstorage or updates with new history
  createHistoryButton: (x) => {
    var historyBtn = $("<button>");
    var historyContainer = $("#selectContainer");
    historyBtn.addClass("p-2 my-2 bg-danger btnSelect");
    historyBtn.text(x);
    historyContainer.prepend(historyBtn);
  },

  // Takes an array of projects and saves them in localStorage.
  saveSearchHistoryToStorage: (searchHistory) => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  },
};

weatherApp.init();
//need to validate city input
