
const axios = require('axios');
const Movie = require('../models/Movies-Models');
const Cache = require('../helper/cache')

require('dotenv').config();
const MOVIE_KEY = process.env.MOVIE_KEY;
const cacheObjMovies = new Cache();


const movieController = (request, ress) => {
  let mov = request.query.query;
  const requestKeyForMovies = `movies-${mov}`;

  if (mov) {
    if (cacheObjMovies[requestKeyForMovies] && (Date.now() - cacheObjMovies[requestKeyForMovies].timestamp < 86400000)) {

      ress.send(cacheObjMovies[requestKeyForMovies]);

    } else {

      const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_KEY}&query=${mov}`;
      axios.get(movieUrl).then(respomseMovie => {
        const arr = [];

        respomseMovie.data.results.map(obj => {
          let imageURL = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
          let newMovie = new Movie(obj.title, obj.overview, obj.vote_average, obj.vote_count, imageURL, obj.popularity, obj.release_date);
          arr.push(newMovie);
        });

        cacheObjMovies[requestKeyForMovies] = arr;
        cacheObjMovies[requestKeyForMovies].timestamp = Date.now();
        ress.send(arr);

      }).catch(error => {
        ress.send(error.message)
      });
    }
  } else {
    ress.send('please provide the proper movies')
  }
}
module.exports = movieController;