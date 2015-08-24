var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

//get all days
router.get('/', function(req, res) {
  console.log(Day);
  Day.find()
  .then(function(days) {
      // res.render('index', {
      //   all_days: days
      // });
      console.log(days);
      res.render("index");
    });
});

//get one specific day
router.get('/:number', function(req, res) {
  console.log(Day);
  Day.find({number: req.params.number})
  .then(function(days) {
      // res.render('index', {
      //   all_days: days
      // });
      return days;
      // console.log(days);
      // res.render("index");
    });
});

//add a new day
router.post('/', function(req, res, next) {
  Day.create({}).then(function(data){
  //  console.log(data);
    res.json(data);
  }).then(null, next);
});

//remove a day
router.delete('/:number', function(req, res) {
  console.log(Day);
  Day.find()
  .then(function(days) {
      // res.render('index', {
      //   all_days: days
      // });
      console.log(days);
      res.render("index");
    });
});

module.exports = router;
