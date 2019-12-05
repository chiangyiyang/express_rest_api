
const express = require('express');
const data = require('./fake_data');

const app = express();

app.get('/', (req, res) => res.send('Rest Api with Node and Express!'));

app.get("/items", (req, res) => {
  res.json(data);
});

app.listen(3000, () => console.log('Listen on port 3000'));
