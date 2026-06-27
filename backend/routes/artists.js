const express = require('express');
const router = express.Router();
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/:id', asyncHandler(async (req, res) => {
  const [artists, tracks] = await Promise.all([
    spotifyRequest(`artists/${req.params.id}`, req.token),
    spotifyRequest(`artists/${req.params.id}/top-tracks`, req.token),
  ]);

  const payload = {artists, tracks};

  res.send(payload);        
}));

module.exports = router;