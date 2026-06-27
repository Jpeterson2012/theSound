const express = require('express');
const router = express.Router();
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/', asyncHandler(async (req, res) => {  
  const data = await spotifyRequest(`search?q=tag:new&type=album&offset=${req.query.offset}&limit=40`, req.token);

  res.send(data?.albums?.items ?? []);
}));

module.exports = router;