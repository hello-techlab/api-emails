const nodemailer = require('nodemailer');

//Formato do objeto recebido
// {
//   usuario: {
//     nome: str,
//     nusp: int
//   },
//   questionario: {
//     nome: str,
//     respostas: {
//       1: {
//        pergunta: str,
//        resposta: str,
//       },
//       2: {
//        pergunta: str,
//        resposta: str,
//       },
//       3: {
//        pergunta: str,
//        resposta: str,
//       },
//       ...
//     }
//   }
// }
async function enviarRelatorio (req, res) {
  try {
    const dadosRespostas = req.body;
    const assuntoEmail = `Nova resposta de questionário! | Respostas de ${dadosRespostas.usuario.nome} ao questionário ${dadosRespostas.questionario.nome}`;
    const corpoEmail = formularCorpoEmail(dadosRespostas);
    await enviarEmail(assuntoEmail, corpoEmail);

    res.status(200).send('Email enviado');
    // res.status(200).send(corpoEmail);
  } catch (err) {
    console.log(err);
    res.status(400).json({error: 'Erro ao enviar respostas por email. Consulte o console do server para mais detalhes'});
  }
}

module.exports = {
  enviarRelatorio
}

function formularCorpoEmail(dadosRespostas) {
  let apresentacao = `Olá, Gapsi\n\nO usuário ${dadosRespostas.usuario.nome} respondeu o questionário ${dadosRespostas.questionario.nome} da seguinte maneira:\n\n`;
  let qtdRespostas = Object.keys(dadosRespostas.questionario.respostas).length;
  let respostas = "";
  for (let i=1; i<=qtdRespostas; i++) {
    respostas = respostas.concat(`${i} - ${dadosRespostas.questionario.respostas[i].pergunta}\nR: ${dadosRespostas.questionario.respostas[i].resposta}\n\n`);
  }

  const corpoEmail = apresentacao.concat(respostas);
  return corpoEmail;
}

async function enviarEmail(assuntoEmail, corpoEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gapsiemail@gmail.com',
      pass: "m5'{eU^-aq_>eZGJ"
    }
  });
  
  const mailOptions = {
    from: 'gapsiemail@gmail.com',
    to: 'gabriel.nicolau@usp.br',
    subject: assuntoEmail,
    text: corpoEmail
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// gapsiemail@gmail.com
// m5'{eU^-aq_>eZGJ