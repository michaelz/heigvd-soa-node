var express = require('express'),
    router = express.Router(),
    authMiddleware = require('../middlewares/authMiddleware'),
    http = require('http').Server(express),
    base64url = require('base64url'),
    io = require('socket.io')(http),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Task = mongoose.model('Task');

module.exports = function (app) {
  app.use('/tasks/', router);
};

router.get('/', function(req, res){
    res.render('webix', {
      title: 'Websocket Task list',
      pageid: 'tasks',
      has_partial: true,
      has_websocket: true
    });
});

/**
 * Add a new task
 */
router.post('/', authMiddleware.needsLogin, function(req, res) {

    var id = JSON.parse(base64url.decode(req.payload)).id;
    var username = JSON.parse(base64url.decode(req.payload)).username;
    var task = new Task({
        "description":req.body.description,
        "user_id":id
    });
    task.save(function (err, createdTask) {
        if (err) {
            res.jerror(err);
            return;
        }

        var socketTask = {
            "description": createdTask.description,
            "username": username
        }
        io.sockets.emit('newtask', socketTask);
        res.jsend(socketTask);

    });
});

/**
 * Delete a task
 */
router.delete('/:id', authMiddleware.needsLogin, function (req, res, next) {
    //TODO: Test task existence
    Task.remove({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            res.jerror(err);
            return;
        }
        io.sockets.emit('deltask', req.params.id);
        res.jsend('Deleted');
    });
});

/**
 * Get all tasks
 */

 router.get('/all', function(req, res, next) {
    Task.find().populate('user_id', 'username').exec(function (err, tasks) {
        if (err) {
          res.jerror(err);
          return;
        }
        var tasklist = [Object];
        for (var i = 0; i < tasks.length; i++) {
            tasklist[i] = {
                "id": tasks[i]._id,
                "taskDesc": tasks[i].description,
                "user": tasks[i].user_id.username
            }
        }
        res.jsend(tasklist);
    });
});


io.on('connection', function(socket) {
  //console.log('a user connected');
  socket.on('newtask', function(taskdesc) {
    io.emit('newtask', taskdesc);
  });

  socket.on('deltask', function(taskId) {
    io.emit('deltask', taskId);
  });

  socket.on('disconnect', function() {
    //console.log('user disconnected');
  });
});

// Websocket port (3000 is used for http, so 3001)
http.listen(3001, function(){
  console.log('listening on *:3001');
});
