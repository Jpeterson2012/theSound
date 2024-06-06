var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

  if (Object.keys(req.query).length !== 0)
  {
    process.env['access_token'] = req.query.access_token;
  }
});


module.exports = router;
