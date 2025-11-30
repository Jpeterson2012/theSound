const express = require('express');
const router = express.Router();
const con = require('../sql.js');

router.get('/', async (req, res) => {      
  const token = await con.getAccessToken(req.cookies.jwt);

  const headers = {
    Authorization: 'Bearer ' + token
  };

  try {
    let main = {};
    let index = Math.floor(Math.random() * 76);
    let url = `https://api.spotify.com/v1/search?q=tag:hipster&type=album&offset=${index}&limit=20`;

    const resp = await fetch(url, {headers});
    const data = await resp.json();
    const values = [];

    data?.albums?.items.map(a => 
      values.push({album_id: a.id, images: a.images, name: a.name, artists: a.artists})
    );

    main.hipster = values;

    let sql = 'select exists (select 1 from categories) AS Output';

    let [result] = await con.query(sql);

    if (result[0].Output) {
      sql = 'SELECT icons, c_id, name from categories';

      let [result2] = await con.query(sql);

      const items = [];

      for (let i = 0; i < result2.length; i++) {
        var temp = {};
        temp.icons = JSON.parse(result2[i].icons);
        temp.id = result2[i].c_id;
        temp.name = result2[i].name;
        items.push(temp);
      }

      main.categories = items;

      res.send(main);
    } else {
      url = 'https://api.spotify.com/v1/browse/categories?limit=50';

      const getCategories = async () => {
        const resp = await fetch(url, {headers});
        const data = await resp.json();        

        const values = [];

        data.categories.items.map(a => 
          values.push([a.href, JSON.stringify(a.icons), a.id, a.name])
        );

        sql = "INSERT INTO categories (href, icons, c_id, name) VALUES ?";

        const [result] = await con.query(sql);

        console.log("Number of categories inserted: " + result.affectedRows);

        sql = 'SELECT icons, c_id, name from categories';

        const [result2] = await con.query(sql);

        const items = [];

        for (let i = 0; i < result2.length; i++) {
          var temp = {};
          temp.icons = JSON.parse(result2[i].icons);
          temp.id = result2[i].c_id;
          temp.name = result2[i].name;
          items.push(temp);
        }

        res.send(items);
      };

      getCategories();
    }
  } catch (e) {
    console.error(e);
  }

  // url = 'https://api.spotify.com/v1/browse/categories?offset=100&limit=50'
  // url2 = 'https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFA6SOHvT3gck'
  //     const getStuff = async () => {
  //       const resp = await fetch(url2, {headers})
  //       const data = await resp.json()
  //       // info.categories = data

  //       var values = []
  //       values.push([data.href, JSON.stringify(data.icons), data.id, "Drum and Bass"])
  //       // data.categories.items.map(a => values.push([a.href, JSON.stringify(a.icons), a.id, a.name]))
  //       sql = "INSERT INTO categories (href, icons, c_id, name) VALUES ?"
  //       con.query(sql, [values], function(err, result) {
  //           if (err) throw err;
  //           console.log("Number of categories inserted: " + result.affectedRows);
  //       })
  //       sql = 'SELECT icons, c_id, name from categories'
  //       con.query(sql, function (err, result) {
  //         if (err) throw err;
          
  //         var items = []
  //         for (let i = 0; i < result.length; i++) {
  //             var temp = {}
  //             temp.icons = JSON.parse(result[i].icons)
  //             temp.id = result[i].c_id
  //             temp.name = result[i].name
  //             items.push(temp)
  //         }
  //         res.send(items)
  //       })

  //     }
  //     getStuff()
});

module.exports = router;