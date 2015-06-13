var express = require('express');
var path = require('path');
var app = express();
var schedule = require('node-schedule');
var reservoir = require('TaiwanReservoirAPI');

// Defined output data
var reservoirData;

var emailSystem = require('./email');

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

var updateData = schedule.scheduleJob('*/30 * * * 1-5', function(){
    reservoir(function (err, data){
      if(err === null)
        reservoirData = data;

      return;
    });
});

// app.use('/', function (req, res) {
//   res.render('index');
// });

app.get('/data',function(req, res){

    if(reservoirData){
        return res.json({
            data: reservoirData
        });
    }

    reservoir(function (err, reservoirData) {
        if (err) {
            return res.json({
                err: err.toString()
            });
        }

        return res.json({
            data: reservoirData
        });
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //  var err = new Error('Not Found');
  //  err.status = 404;
  //  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});

app.listen(8888, function () {
  console.log('Server running sucessfully....');
});