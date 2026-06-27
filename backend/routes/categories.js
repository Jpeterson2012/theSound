const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/', asyncHandler(async (req, res) => {  
  let index = Math.floor(Math.random() * 76); 

  const data = await spotifyRequest(`search?q=tag:hipster&type=album&offset=${index}&limit=20`, req.token);
  
  const token = await con.getAccessToken(req.user.id);

  const payload = {};

  payload.hipster = (data?.albums?.items ?? []).reduce((acc, album) => {
    acc.push({album_id: album.id, images: album.images, name: album.name, artists: album.artists});

    return acc;
  }, []);

  const sql = 'SELECT icons, c_id, name from categories';

  const [result] = await con.query(sql);

  payload.categories = result.reduce((acc, category) => {
    acc.push({
      icons: JSON.parse(category.icons),
      id: category.c_id,
      name: category.name,
    });

    return acc;
  }, []);

  res.send(payload);
}));

module.exports = router;