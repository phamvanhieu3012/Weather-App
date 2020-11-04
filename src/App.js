import React from "react";
import "./App.css";

import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from "./components/weather";
import { render } from "@testing-library/react";
import "./components/form.css";

//api call api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key}
const API_KEY = "2a12320e9c02e52b30338f259009f53d";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: "",
      error: false,
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog",
    };

    this.getWeather = this.getWeather.bind(this);
  }

  calCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        this.setState({
          icon: this.weatherIcon.Thunderstorm,
        });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({
          icon: this.weatherIcon.Drizzle,
        });
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({
          icon: this.weatherIcon.Rain,
        });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({
          icon: this.weatherIcon.Snow,
        });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({
          icon: this.weatherIcon.Atmosphere,
        });
        break;
      case rangeId >= 800:
        this.setState({
          icon: this.weatherIcon.Snow,
        });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({
          icon: this.weatherIcon.Snow,
        });
        break;
      default:
        this.setState({
          icon: this.weatherIcon.Clouds,
        });
        break;
    }
  }

  getWeather = async (e) => {
    e.preventDefault();
    console.log(e);

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if (city && country) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country},uk&appid=${API_KEY}`
      );
      const response = await api_call.json();

      this.setState({
        city: `${response.name},${response.sys.country}`,
        celsius: this.calCelsius(response.main.temp),
        temp_max: this.calCelsius(response.main.temp_max),
        temp_min: this.calCelsius(response.main.temp_min),
        description: response.weather[0].description,
      });
      this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
      this.setState({
        error: false,
      });
    } else {
      this.setState({
        error: true,
      });
    }
  };

  render() {
    return (
      <div className="App">
        <div>{this.state.error ? error() : null}</div>
        <div className="container">
          <form onSubmit={this.getWeather}>
            <div className="row">
              <div className="col-md-3 offset-md-2">
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  autoComplete="off"
                  placeholder="City"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  autoComplete="off"
                  placeholder="Country"
                />
              </div>
              <div className="col-md-3 mt-md-0 text-top-left">
                <button className="btn btn-warning">Get Weather</button>
              </div>
            </div>
          </form>
        </div>
        <Weather
          city={this.state.city}
          country={this.state.country}
          temp_celsius={this.state.celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

function error() {
  return (
    <div className="alert alert-danger mb-5" role="alert">
      Please Enter City and Country
    </div>
  );
}

export default App;
