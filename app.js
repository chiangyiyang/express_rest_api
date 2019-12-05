
const express = require('express');
const body_parser = require('body-parser');

const levelup = require('levelup');
const leveldown = require('leveldown');
const encode = require('encoding-down')
const db = levelup(encode(leveldown('./db'), { valueEncoding: 'json' }))

const app = express();
app.use(body_parser.json());

app.get('/', (req, res) => res.send('Rest Api with Node and Express!'));

app.get("/items", (req, res) => {
  db.get('items', function (err, value) {
    if (err && err.notFound) return res.json({ message: 'No item' });
    if (err) return console.log('Error!', err);
    res.json(value);
  });
});

app.get("/items/:id", (req, res) => {
  db.get('items', function (err, value) {
    if (err && err.notFound) return res.json({ message: 'No item' });
    if (err) return console.log('Error!', err);
    const itemId = req.params.id;
    const item = value.find(_item => _item.id === itemId);

    if (item) {
      res.json(item);
    } else {
      res.json({ message: `item ${itemId} doesn't exist` })
    }
  });
});

app.post("/items", (req, res) => {
  db.get('items', function (err, value) {
    if (err && !err.notFound) return console.log('Error!', err);
    if (err && err.notFound) value = [];
    const item = req.body;
    console.log('Adding new item: ', item);
    console.log(value);

    // add new item to array
    value.push(item)

    // return updated list
    res.json(value);

    // save list
    db.put('items', value, function (err) {
      if (err) return console.log('Ooops!', err);
    });
  });
});

app.listen(3000, () => console.log('Listen on port 3000'));
