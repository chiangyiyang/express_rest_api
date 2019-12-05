
const express = require('express');
const body_parser = require('body-parser');
const data = require('./fake_data');

const app = express();
app.use(body_parser.json());

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

app.post("/items", (req, res) => {
  const item = req.body;
  console.log('Adding new item: ', item);

  // add new item to array
  data.push(item)

  // return updated list
  res.json(data);
});

app.listen(3000, () => console.log('Listen on port 3000'));
