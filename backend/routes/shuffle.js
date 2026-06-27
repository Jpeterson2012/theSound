const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.post('/', asyncHandler(async (req, res) => {
  const func = ["track", "context", "off"].includes(req.body.state) ? "repeat" : "shuffle";

  await spotifyRequest(`me/player/${func}?state=${req.body.state}`, req.token, {
    method: 'PUT',        
    body: `{"device_ids": "${req.params.id}"}`,                        
  });

  res.sendStatus(204);  
}));

module.exports = router;