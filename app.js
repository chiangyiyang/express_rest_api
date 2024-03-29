
const express = require('express');
const body_parser = require('body-parser');

const levelup = require('levelup');
const leveldown = require('leveldown');
const encode = require('encoding-down')
const db = levelup(encode(leveldown('./db'), { valueEncoding: 'json' }))

const app = express();
app.use(body_parser.json());

app.get('/', (req, res) => res.send('Rest Api with Node and Express!'));

app.route("/items")
  .get((req, res) => {
    db.get('items', function (err, value) {
      if (err && err.notFound) return res.json({ message: 'No item' });
      if (err) return console.log('Error!', err);
      if (req.query.dev) {
        // filter list copy, by excluding item to delete
        const filtered_list = value.filter(item => item.dev == req.query.dev);

        value = filtered_list
      }

      res.json(value);
    });
  })
  .post((req, res) => {
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

app.route("/items/:id")
  .get((req, res) => {
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
  })
  .delete((req, res) => {
    db.get('items', function (err, value) {
      if (err && err.notFound) return res.json({ message: 'No item' });
      if (err) return console.log('Error!', err);
      const itemId = req.params.id;

      console.log("Delete item with id: ", itemId);

      // filter list copy, by excluding item to delete
      const filtered_list = value.filter(item => item.id !== itemId);

      // replace old list with new one
      value = filtered_list;

      // return updated list
      res.json(value);

      // save list
      db.put('items', value, function (err) {
        if (err) return console.log('Ooops!', err);
      });
    });
  });

app.listen(3000, () => console.log('Listen on port 3000'));
