var express = require('express'),
    router = express.Router(),
    authentication = require('../services/authentication'),
    http = require('http').Server(express),
    io = require('socket.io')(http),
    mongoose = require('mongoose');

module.exports = function (app) {
  app.use('/tasks', router);
};

router.get('/', function(req, res){
    res.render('task-example', {
      title: 'Welcome !'
    });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('newtask', function(taskdesc){
    io.emit('newtask', taskdesc);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// Websocket port (3000 is used for http, so 3001)
http.listen(3001, function(){
  console.log('listening on *:3001');
});
