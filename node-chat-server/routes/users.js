var express = require('express');
var router = express.Router();
var users = [];
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
  data: [ { name: 'Rohan'}, { name: 'Gauri'}, { name: 'Shashank'}, { name: 'Ankit'}, { name: 'Sonali'}, { name: 'Divya'} ]
  } );
});

router.get('/getUsers', function (req, res, next) {

  res.send( users );
});

router.post('/saveUser', function (req, res, next) {
   console.log(req.body);
   users.push(req.body);
   res.send( 'Data saved' );
});

module.exports = router;