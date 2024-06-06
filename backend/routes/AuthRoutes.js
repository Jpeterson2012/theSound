const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const querystring = require('querystring');

const encodeFormData = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }
  module.exports = {router, fetch, querystring, encodeFormData};