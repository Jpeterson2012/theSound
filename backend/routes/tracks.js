var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    // url = `https://api.spotify.com/v1/albums/${req.params.id}/tracks?offset=0&limit=35`
    url = `https://api.spotify.com/v1/albums/${req.params.id}`
    

    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
    var resp = await fetch(url,{headers})
    const data = await resp.json()
    let data2
    var temp = []
    var temp3 = []
    
    data.artists.map(a => 
        temp.push(a.id)
    )

    let apiRequestLoop = function(){
    let promiseArray = []
    temp.map(a =>
        promiseArray.push(fetch(`https://api.spotify.com/v1/artists/${a}`,{headers}).then(response => response.json()))
    )
    return Promise.all(promiseArray);
    }
    let temp2 = {}
    apiRequestLoop().then(dataa => dataa.map((a,i,arr) => {
        temp3.push(a.images),
        arr.length - 1 === i ? (
                // console.log(temp3)
                // let temp2 = {}
                temp2.albums = data,
                temp2.images = temp3,
                res.send(temp2)
         ) : null
    }))



    // temp.map(async (a,i,arr) => {
    //     resp = await fetch(`https://api.spotify.com/v1/artists/${a}`,{headers}),
    //     data2 = await resp.json(),
    //     temp3.push(data2.images)
    //     if (arr.length - 1 === i){
    //         // console.log(temp3)
    //         let temp2 = {}
    //         temp2.albums = data
    //         temp2.images = temp3
    //         res.send(temp2)
    //     }   
    // })
    
    
    //   fetch(url, { headers })
    //       .then(response => response.json())
    //       .then(data => {
    //       res.send(data)
    //       })
    //       .catch(error => {
    //       // handle error
    //       });
})

module.exports = router;