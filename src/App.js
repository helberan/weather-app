import "./App.css";
import React, { useState, useEffect } from "react";
import keyData from "./key.json";
import map from "./images/map.png";
import glass from "./images/magnifying-glass.png";
import conditions from "./weather_conditions.json";

function App() {
  const api = {
    key: keyData[0].apiKey,
    geo_base: "https://api.openweathermap.org/geo/1.0/direct?", //base address for searching coordinates
    base: "https://api.openweathermap.org/data/2.5/weather?", //base address for searching weather
  };

  const [tempColor, setTempColor] = useState("");

  //searched place
  const [place, setPlace] = useState("");

  //data about searched place - name, country, state
  const [gps, setGps] = useState({
    country: "",
    name: "",
  });

  //data about weather
  const [weather, setWeather] = useState({
    degrees: "",
    description: "",
  });

  //check for received data from api
  const [allData, setAllData] = useState(false);

  async function apiCall() {
    try {
      //data about searched place - other names, coordinates etc.
      const placeCoordinatesResponse = await fetch(
        `${api.geo_base}q=${place}&appid=${api.key}`
      );
      const placeCoordinatesData = await placeCoordinatesResponse.json(); //data to json
      const latData = `${placeCoordinatesData[0].lat}`; //lat of place
      const lonData = `${placeCoordinatesData[0].lon}`; //lon of place
      const countryData = `${placeCoordinatesData[0].country}`; //country of place
      const nameData = `${placeCoordinatesData[0].name}`; //name of place - eng

      //weather data
      const placeWeatherResponse = await fetch(
        `${api.base}lat=${latData}&lon=${lonData}&appid=${api.key}&units=metric`
      );
      const placeWeatherData = await placeWeatherResponse.json(); //data to json
      const weatherDescriptionData = `${placeWeatherData.weather[0].main}`; //weather description
      const degreesData = `${placeWeatherData.main.temp}`; //degrees

      //saved place data
      setGps((prevData) => ({
        ...prevData,
        country: countryData,
        name: nameData,
      }));

      //saved weather data
      setWeather((prevData) => ({
        ...prevData,
        degrees: degreesData,
        description: weatherDescriptionData,
      }));

      //all data received
      setAllData(true);
    } catch (err) {
      console.error("Place not found: ", err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      apiCall();
    }
  }

  function handleClick() {
    apiCall();
  }

  useEffect(() => {
    if (parseInt(weather.degrees) > 22) {
      setTempColor("hot");
    } else if (parseInt(weather.degrees) > 18) {
      setTempColor("warm");
    } else if (parseInt(weather.degrees) < 18) {
      setTempColor("cold");
    } else {
      setTempColor("freeze");
    }
    console.log("degrees: ", weather.degrees);
    console.log("color: ", tempColor);
  }, [weather.degrees]);

  return (
    <div className="App-wrapper">
      <div className="App">
        <header>
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setPlace(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className={`circle ${tempColor}`} onClick={handleClick}></div>
          <img src={glass} alt="search" onClick={handleClick} />
        </header>
        <div className="main">
          {allData ? (
            <div className="main-wrapper">
              <div className="location-wrapper">
                <img src={map} alt="location icon"></img>
                <h1 className="location">
                  {gps.name}, {gps.country}
                </h1>
              </div>
              <div className="temp">
                <div className="temp-value">{Math.round(weather.degrees)}</div>
                <div className="temp-deg">°C</div>
              </div>
              <div className={`detail ${tempColor}`}>
                {conditions.map((condition) =>
                  condition.weather === weather.description ? (
                    <img
                      key={condition.weather}
                      src={require(`./images/${condition.img_src}`)}
                      alt={condition.img_alt}
                    />
                  ) : null
                )}
                <h3 className="weather">{weather.description}</h3>
              </div>
            </div>
          ) : (
            <p>Please enter a location</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
