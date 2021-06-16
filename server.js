const express = require('express')
const app = express()

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const PORT = process.env.PORT;
const WEATHER_BIT_KEY = process.env.WEATHER_BIT_KEY;
const MOVIE_KEY = process.env.MOVIE_KEY;

app.use(cors())

const weatherData = require('./data/weather.json');
const { request } = require('express');

app.get('/',
  function (req, res) {
    res.send('Hello World this is mohammad Im happy now')
  })

app.get('/weather', (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  if (lat && lon) {
    const weatherBitUrl =`https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_BIT_KEY}&lat=${lat}&lon=${lon}`;

    axios.get(weatherBitUrl).then(response => {
      const responseData = response.data.data.map(obj => new Weather(obj));
      res.json(responseData)
    }).catch(error => {
      res.send(error.message)
    });
  } else {
    res.send('please provide the proper lat and lon')
  }
});

app.get('/movies', (request, ress) => {
  let mov = request.query.query;
  if (mov) {
    const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_KEY}&query=${mov}`;
    axios.get(movieUrl).then(respomseMovie => {
      const arr=[];

       respomseMovie.data.results.map(obj => {
        let imageURL = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
        let newMovie =new Movie (obj.title, obj.overview, obj.vote_average, obj.vote_count, imageURL, obj.popularity, obj.release_date);
        arr.push(newMovie);
        });
      ress.send(arr);

    }).catch(error => {
      ress.send(error.message)
    });
  } else {
    ress.send('please provide the proper movies')
  }
});



class Movie {
  constructor(title, overview, averageVotes, totalVotes, imgUrl, popularity, releasedOn){
    this.title = title;
    this.overview = overview;
    this.average_votes = averageVotes;
    this.total_votes = totalVotes;
    this.image_url = imgUrl;
    this.popularity = popularity;
    this.released_on = releasedOn;
  }
}


// const responseData = weatherData.data.map(obj => new Weather (obj))
// res.json(responseData);


class Weather {
  constructor(weatherData) {
    this.description = weatherData.weather.description;
    this.date = weatherData.valid_date;
  }
}

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
