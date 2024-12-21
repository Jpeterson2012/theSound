var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    // x.registerListener(function() {
    //     console.log('')
    //     console.log(process.env.access_token)
    //     console.log('')
    //     var token = {items: process.env.access_token}
    //     res.send(token)
    // })
    try{
    var token = {items: process.env.access_token}
    res.send(token)
    }
    catch(e){
        console.error(e)
    }
})
module.exports = router;