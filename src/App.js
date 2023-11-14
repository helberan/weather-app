import "./App.css";
import React, { useState } from "react";

function App() {
  const api = {
    key: "", //api klíč
    geo_base: "https://api.openweathermap.org/geo/1.0/direct?", //základní adresa pro hledání koordinátů
    base: "https://api.openweathermap.org/data/2.5/weather?", //základní adresa pro hledání počasí
  };

  const [mesto, setMesto] = useState(""); //hledané město
  const [gps, setGps] = useState({
    //název a stát hledaného města
    zeme: "",
    kraj: "",
    nazev: "",
  });
  const [weather, setWeather] = useState({
    //data o počasí hledaného města
    degrees: "",
    description: "",
  });

  const [allData, setAllData] = useState(false); //máme již všechna data?

  async function handleKeyDown(e) {
    if (e.key === "Enter") {
      //data daného města - jiné názvy, souřadnice apod.
      const cityCoordinatesResponse = await fetch(
        `${api.geo_base}q=${mesto}&appid=${api.key}`
      );
      const cityCoordinatesData = await cityCoordinatesResponse.json(); //data převedená na json
      const latData = `${cityCoordinatesData[0].lat}`; //lat souřadnice města
      const lonData = `${cityCoordinatesData[0].lon}`; //lon souřadnice města
      const zemeData = `${cityCoordinatesData[0].country}`; //zěmě hledaného města
      const krajData = `${cityCoordinatesData[0].state}`; //kraj/stát/oblast hledaného města
      const nazevData = `${cityCoordinatesData[0].name}`; //název hledaného města - v AJ

      //data o počasí hledaného města
      const cityWeatherResponse = await fetch(
        `${api.base}lat=${latData}&lon=${lonData}&appid=${api.key}&units=metric`
      );
      const cityWeatherData = await cityWeatherResponse.json(); //data převedená na json
      const weatherDescriptionData = `${cityWeatherData.weather[0].main}`; //popis počasí
      const degreesData = `${cityWeatherData.main.temp}`; //stupně

      //uložení gps souřadnic + stát, ve kterém město je, do useState
      setGps((prevData) => ({
        ...prevData,
        zeme: zemeData,
        kraj: krajData,
        nazev: nazevData,
      }));

      //uložení stupňů a popisu počasí do useState
      setWeather((prevData) => ({
        ...prevData,
        degrees: degreesData,
        description: weatherDescriptionData,
      }));

      setAllData(true); //máme všechna data
    }
  }

  return (
    <div class="App">
      <div class="top">
        {allData ? (
          <div class="wrapper">
            <h1 class="heading">
              {gps.nazev}, {gps.zeme}
            </h1>
            <h3 class="location">{weather.description}</h3>
            <p class="temp">
              <span class="temp-value">{Math.round(weather.degrees)}</span>
              <span class="deg">°</span>
              <span class="temp-type">C</span>
            </p>
          </div>
        ) : null}
      </div>
      <div class="bottom">
        <div class="wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setMesto(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
