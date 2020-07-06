const express = require('express');
const router = express.Router();

//Require database modules
const emailService = require('./emailService.js');

//Routes
router.post('/email/relatorio/enviar', emailService.enviarRelatorio);
router.post('/email/agendamento/enviar', emailService.enviarPedidoAgend);
router.get('/test', (req, res) => {
  res.send({email: process.env.emailGapsi, pwd:process.env.emailPwd });
})

module.exports = router;
