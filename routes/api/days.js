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
  Day.find()
  .populate('hotels restaurants activities').exec()
  .then(function(days) {

      //console.log(days);
      res.json(days);
    });
});

//get one specific day
router.get('/:number', function(req, res) {
//  console.log(Day);
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
  //console.log(Day);
  Day.find()
  .then(function(days) {
      // res.render('index', {
      //   all_days: days
      // });
    //  console.log(days);
      res.render("index");
    });
});

router.post('/:dayId/remove', function(req,res,next){
  console.log('make it here');
    // Day.find({}, function(err, days){
    //   if(err) next(err);
    //   days.splice(days.indexOf(req.params.dayId), 1);
    //
    //   console.log('this', days);
    //   days.save();
    //   res.json(days);
    // });

    Day.remove({_id: req.params.dayId}).exec().then(function(){
      res.json(req.body);
    });
});

router.post('/:dayId/:attractionType', function(req, res, next) {
//  console.log(req.body.hotels);

  var type = req.params.attractionType;

  Day.findById(req.params.dayId, function(err, doc){
    if(err) next(err);

    if(type == 'hotels'){
      doc.hotels.push(req.body.hotels);
    }
    if(type == 'restaurants'){
      doc.restaurants.push(req.body.restaurants);
    }
    if(type == 'activities'){
      doc.activities.push(req.body.activities);

    }
    doc.save();

    res.json(doc);
  });

});

router.post('/:dayId/:attractionType/remove', function(req, res, next) {
  //console.log(req.body.hotels);

  // console.log('here');
  var type = req.params.attractionType;

  //console.log(req.body);

  Day.findById(req.params.dayId, function(err, doc){
    if(err) next(err);
    doc[type].splice(doc[type].indexOf(req.body[type]), 1);

    doc.save();
    res.json(doc);
  });
  // .then(function(doc){
  //   doc[0][type].splice(doc[0][type].indexOf(req.body[type]),1);
  // }).save();




    // if(type == 'hotels'){
    //   // doc.hotels.find(req.body).then(function(hotel){
    //   // var index = doc.hotels.indexOf(req.body);
    //   console.log(doc.hotels);
    // //  doc.hotels.splice(index, 1);
    //   // });
    // }
    // if(type == 'restaurants'){
    //   doc.restaurants.push(req.body.restaurants);
    // }
    // if(type == 'activities'){
    //   doc.activities.push(req.body.activities);
    //
    // }
    //doc.save();

    //res.json(doc);
  //});

});

module.exports = router;
