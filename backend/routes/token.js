var express = require('express');
var router = express.Router();
const { x } = require('../varListen.js')

router.get('/', function(req, res) {
    // x.registerListener(function() {
    //     console.log('')
    //     console.log(process.env.access_token)
    //     console.log('')
    //     var token = {items: process.env.access_token}
    //     res.send(token)
    // })
    var token = {items: process.env.access_token}
        res.send(token)
})
module.exports = router;