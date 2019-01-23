require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.json('Hello World');
});

app.use(require('./routes/usuario'));

// conectando a la base de datos

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log('base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto: ${process.env.PORT}`);
});