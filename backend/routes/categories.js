var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

router.get('/', async (req, res) => {
    // console.log(req.params.id)
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
    
    var sql = 'select exists (select 1 from categories) AS Output'
    con.query(sql, function(err, result) {
      if (err) throw err;

      var empty = result[0].Output
      if (empty == 1) {
        sql = 'SELECT icons, c_id, name from categories'
        con.query(sql, function (err, result) {
          if (err) throw err;
          
          var items = []
          for (let i = 0; i < result.length; i++) {
              var temp = {}
              temp.icons = JSON.parse(result[i].icons)
              temp.id = result[i].c_id
              temp.name = result[i].name
              items.push(temp)
          }
          res.send(items)
        })
      }
      else{
        url = 'https://api.spotify.com/v1/browse/categories?limit=35'
        const getStuff = async () => {
          const resp = await fetch(url, {headers})
          const data = await resp.json()
          // info.categories = data

          var values = []
          data.categories.items.map(a => values.push([a.href, JSON.stringify(a.icons), a.id, a.name]))
          sql = "INSERT INTO categories (href, icons, c_id, name) VALUES ?"
          con.query(sql, [values], function(err, result) {
              if (err) throw err;
              console.log("Number of categories inserted: " + result.affectedRows);
          })
          sql = 'SELECT icons, c_id, name from categories'
          con.query(sql, function (err, result) {
            if (err) throw err;
            
            var items = []
            for (let i = 0; i < result.length; i++) {
                var temp = {}
                temp.icons = JSON.parse(result[i].icons)
                temp.id = result[i].c_id
                temp.name = result[i].name
                items.push(temp)
            }
            res.send(items)
          })

        }
        getStuff()
      }
    })
})

module.exports = router;