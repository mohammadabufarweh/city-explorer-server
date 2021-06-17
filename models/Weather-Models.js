class Weather {
    constructor(weatherData) {
      this.description = weatherData.weather.description;
      this.date = weatherData.valid_date;
    }
  }

  module.exports = Weather;