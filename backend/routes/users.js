var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {  
  
  let temp = process.env.username
  console.log(temp)
  res.send({items: temp})
 
});
module.exports = router;
