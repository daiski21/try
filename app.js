var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var updates = require('./routes/updates');
var gallery = require('./routes/gallery');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var app = express();
var db;
	
var mdbUrl = "mongodb://admin:password@ds159988.mlab.com:59988/coen3463-t14"
MongoClient.connect(mdbUrl, function(err, database) {
    if (err) {
        console.log(err)
        return;
    }

    console.log("Connected to DB!");

    // set database
    db = database;

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', index);
    app.use('/admin', admin);
    app.use('/updates', updates);
    app.use('/gallery', gallery);

    app.get('/workouts', function(req, res) {
        var workoutsCollection = db.collection('workouts');
        workoutsCollection.find().toArray(function(err, workouts) {
           console.log('workouts loaded', workouts);
          res.render('workouts', {
            workouts: workouts
          });
        })
    });

    app.get('/updates', function(req, res) {
        var workoutsCollection = db.collection('workouts');
        workoutsCollection.find().toArray(function(err, workouts) {
           console.log('workouts loaded', workouts);
          res.render('workouts', {
            workouts: workouts
          });
        })
    });

    app.post('/workouts', function(req, res) {
        console.log(req.body);
        var dataToSave = {
            name: req.body.workout_name,
            link: req.body.youtube_link,
            steps: req.body.steps,
            MMG: req.body.MMG,
            DMG: req.body.DMG,
            OMG: req.body.OMG,
            type: req.body.typetype,
            mechanics: req.body.mechanics,
            equipment: req.body.equipment,
            difficulty: req.body.difficulty,
            
        };
        db.collection('workouts')
          .save(dataToSave, function(err, workout) {
            if (err) {
                console.log('Saving Data Failed!');
                return;
            }
            console.log("Saving Data Successful!");
            res.redirect('/workouts');
        })
    });

    app.get('/workout/:workoutId', function(req, res) {
        var workoutId = req.params.workoutId;
        var workoutCollection = db.collection('workouts');
        workoutCollection.findOne({ _id: new ObjectId(workoutId) }, function(err, workout) {
            res.render('workout', {
                workout: workout
            });
        });
    });

    app.post('/updates', function(req, res) {
        console.log(req.body);
        var dataToSave = {
            name: req.body.workout_name,
            link: req.body.youtube_link,
            steps: req.body.steps,
            MMG: req.body.MMG,
            DMG: req.body.DMG,
            OMG: req.body.OMG,
            type: req.body.typetype,
            mechanics: req.body.mechanics,
            equipment: req.body.equipment,
            difficulty: req.body.difficulty,
            
        };
        var id = req.body.id;
        db.collection('workouts').updateOne({"_id": ObjectId(id)}, {$set: dataToSave}, function(err, workout) {
            if (err) {
                console.log('Updating Data Failed!');
                return;
            }
            console.log("Updating Data Successfull!");
            res.redirect('/workouts');
        })
    });

     app.post('/delete', function(req, res) {
        console.log(req.body);
        var id = req.body.id;

        db.collection('workouts').deleteOne({"_id": ObjectId(id)}, function(err, workout) {
            if (err) {
                console.log('Deleting Data Failed!');
                return;
            }
            console.log("Deleting Data Successfull!");
            res.redirect('/workouts');
        })
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });	
});





module.exports = app;
