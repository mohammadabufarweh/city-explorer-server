const axios = require('axios');
const Weather = require('../models/Weather-Models');
const Cache = require('../helper/cache')
require('dotenv').config();

const cacheObj = new Cache();

const WEATHER_BIT_KEY = process.env.WEATHER_BIT_KEY;
const weatherController =  (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const requestKey =`weather-${lat}-${lon}`;
    if (lat && lon) {
      if( cacheObj[requestKey] && (Date.now() - cacheObj[requestKey].timestamp < 86400000)){
        res.json(cacheObj[requestKey]);
      }else{

        const weatherBitUrl =`https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_BIT_KEY}&lat=${lat}&lon=${lon}`;
    
        axios.get(weatherBitUrl).then(response => {
          const responseData = response.data.data.map(obj => new Weather(obj));
          cacheObj[requestKey]=responseData;
          cacheObj[requestKey].timestamp = Date.now();
          res.json(responseData);
        }).catch(error => {
          res.send(error.message)
        });
      }
    } else {
      res.send('please provide the proper lat and lon')
    }
  };
  module.exports = weatherController;