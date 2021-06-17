const express = require('express')
const app = express()

const cors = require('cors');



require('dotenv').config();

const PORT = process.env.PORT;
app.use(cors())


const { request } = require('express');

app.get('/',
  function (req, res) {
    res.send('Hello World this is mohammad Im happy now')
  })


const weatherController = require('./controllera/weather-controllers');
app.get('/weather', weatherController)



const movieController = require('./controllera/Movies-controller');
app.get('/movies', movieController)







app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
