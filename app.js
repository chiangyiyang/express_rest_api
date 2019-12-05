
const express = require('express');
const data = require('./fake_data');

const app = express();

app.get('/', (req, res) => res.send('Rest Api with Node and Express!'));

app.get("/items", (req, res) => {
  res.json(data);
});

app.get("/items/:id", (req, res) => {
  const itemId = req.params.id;
  const item = data.find(_item => _item.id === itemId);

  if (item) {
     res.json(item);
  } else {
     res.json({ message: `item ${itemId} doesn't exist`})
  }
});

app.listen(3000, () => console.log('Listen on port 3000'));
