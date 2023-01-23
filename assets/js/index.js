//https://openweathermap.org/forecast5
//https://www.latlong.net/
var lat = "33.415180";
var long = "-111.831497";
var apikey = "443d0f967419d0d088b3f740ceaaae6e";
var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apikey}`;

//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
//experienced a CORS error on fetch attemp 11:51PM 01/22/23
fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data));

//https://www.youtube.com/watch?v=nGVoHEZojiQ&ab_channel=SteveGriffith-Prof3ssorSt3v3
