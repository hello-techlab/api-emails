'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// App
const app = express();

//Configure routes
const api = require('./api');

//Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Add these routes to the middleware stack
app.use('/', api);

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Running on http://localhost:${PORT}`);