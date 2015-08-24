'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [{
        hotels:      [],
        restaurants: [],
        activities:  []
      }],
      currentDay = days[0];

  function addDay () {
    $.post('/api/days', function (data) {
      days.push(data);
      renderDayButtons();
      switchDay(days.length - 1);
    })
      .fail( function (err) {
        console.error('err', err)
      });
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    console.log("CURRENTDAY",currentDay);
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;

    $.post('/api/days/'+currentDay._id+'/remove', function (data) {
      // days.push(data);
      // renderDayButtons();
      // switchDay(days.length - 1);
      //
      var index = days.indexOf(currentDay);
      days.splice(index, 1);
      switchDay(index);
    })
      .fail( function (err) {
        console.error('err', err)
      });

  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    // console.log(attraction);
    var typeAttraction = attraction.type;

    var postRequest

    if(typeAttraction == 'hotels'){
      postRequest = $.post('/api/days/' + currentDay._id + '/'+typeAttraction, {hotels: attraction._id});
    }

    if(typeAttraction == 'activities'){
      postRequest = $.post('/api/days/' + currentDay._id + '/'+typeAttraction, {activities: attraction._id});
    }

    if(typeAttraction == 'restaurants'){
      postRequest = $.post('/api/days/' + currentDay._id + '/'+typeAttraction, {restaurants: attraction._id});
    }
    postRequest.done(function (data) {
      currentDay[attraction.type].push(attraction);
      renderDay(currentDay);

    });
  };

  exports.removeAttraction = function (attraction) {
    console.log(currentDay[attraction.type], attraction);
    var index = -1;

    currentDay[attraction.type].forEach(function(thing, i){
      if(thing._id == attraction._id){
        index= i;
      }
    });
    if (index === -1) return;
    var typeAttraction = attraction.type;

    var postRequest

    if(typeAttraction == 'hotels'){
      postRequest = $.post('/api/days/' + currentDay._id + '/'+typeAttraction +'/remove', {hotels: attraction._id});
    }

    if(typeAttraction == 'activities'){
      postRequest = $.post('/api/days/' + currentDay._id + '/'+typeAttraction +'/remove', {activities: attraction._id});
    }

    if(typeAttraction == 'restaurants'){
      postRequest = $.post('/api/days/' + currentDay._id + '/'+typeAttraction +'/remove', {restaurants: attraction._id});
    }

    postRequest.done(function (data) {
      console.log("what?", data);
      currentDay[attraction.type].splice(index, 1);
      renderDay(currentDay);

    });

  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    var arrKeys = ['hotels', 'restaurants', 'activities'];
    arrKeys.forEach(function(type){
      console.log(type);
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();

      day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction, type));
        mapModule.drawAttraction(attraction, type);
      });
    });
  }

  function itineraryHTML (attraction, type) {
    console.log(attraction);
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    $.get('/api/days', function (data) {
      days = data;
      renderDayButtons();
      switchDay(0);

       console.log('GET response data', data);
    })
    .fail( function (err) {
      console.error('err', err)
    });
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
