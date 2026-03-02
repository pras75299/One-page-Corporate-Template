const express = require('express');
const serverless = require('serverless-http');
const app = require('../../app');

// Mount app at Netlify function path so Express receives "/", "/admin", "/assets/...", etc.
const wrapper = express();
wrapper.use('/.netlify/functions/server', app);

module.exports = { handler: serverless(wrapper) };
