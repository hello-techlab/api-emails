const express = require('express');
const router = express.Router();

//Require database modules
const emailService = require('./emailService.js');

//Routes
router.post('/email/relatorio/enviar', emailService.enviarRelatorio);
router.post('/teste', (req, res) => {
  res.send('hello, sir');
})

module.exports = router;