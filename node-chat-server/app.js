var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
const io = require('socket.io')();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Point static path to dist
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var clients = [];
var names = [];
var userData;
var selectedUser;
io.on('connection', (client) => {
  console.log('Connected :: ' + client);

  clients.push(client);

  client.on('getName', (name) => {
    names.push({ id: client.id, name: name });
    setTimeout(() => {
      clients.forEach((cl) => {
        console.log('New User' + cl);
        cl.emit('newUserAdded');
      })
    }, 1000);
  });

  client.on('message', (data) => {
    clients.forEach((cl) => {
      var toUser = names.filter((el) => {
        return el.name === data.toUser;
      });
      if (cl != client && cl.id === toUser[0].id) {
        cl.emit('newMessage', { msg: data.msg, name: data.name });
      }
    });
  });

  client.on('onSelect', (userData) => {
    userData = userData;
    selectedUser = userData.selectedName;
    clients.forEach((cl) => {
      console.log(names);
      var gotName = names.filter((data) => {
        return data.name === selectedUser;
      });
      if (cl.id === gotName[0].id) {
        cl.emit('newMessage', { msg: 'wants to chat with you', name: userData.user });
      }
    })
  })
});

io.listen(4000)
module.exports = app;
