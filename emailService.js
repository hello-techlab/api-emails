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
    console.log('Enviando email para', req.userEmail);
    await enviarEmail(assuntoEmail, corpoEmail, req.userEmail);

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
  let apresentacao = `Olá, GAPsi/Apoia!\n\n\nO usuário ${dadosRespostas.usuario.nome} respondeu o questionário ${dadosRespostas.questionario.nome} da seguinte maneira:\n\n`;
  let qtdRespostas = Object.keys(dadosRespostas.questionario.respostas).length;
  let respostas = "";

  if(dadosRespostas.questionario.nome == "SRQ-20"){
      for (let i=1; i<=qtdRespostas; i++) {
          if(dadosRespostas.questionario.respostas[i].resposta == "nao")
              dadosRespostas.questionario.respostas[i].resposta = "Não";
          else dadosRespostas.questionario.respostas[i].resposta = "Sim";

        respostas = respostas.concat(`${i} - ${dadosRespostas.questionario.respostas[i].pergunta}\nR: ${dadosRespostas.questionario.respostas[i].resposta}\n\n`);
      }
  }
  else if(dadosRespostas.questionario.nome == "Columbia"){
      if(dadosRespostas.questionario.respostas[2].resposta == "nao"){
          for (let i=1; i<=2; i++) {
              if(dadosRespostas.questionario.respostas[i].resposta == "nao")
                  dadosRespostas.questionario.respostas[i].resposta = "Não";
              else dadosRespostas.questionario.respostas[i].resposta = "Sim";

            respostas = respostas.concat(`${i} - ${dadosRespostas.questionario.respostas[i].pergunta}\nR: ${dadosRespostas.questionario.respostas[i].resposta}\n\n`);
          }

          if(dadosRespostas.questionario.respostas[6].resposta == "nao")
              dadosRespostas.questionario.respostas[6].resposta = "Não";
          else dadosRespostas.questionario.respostas[6].resposta = "Sim";

          respostas = respostas.concat(`6 - ${dadosRespostas.questionario.respostas[6].pergunta}\nR: ${dadosRespostas.questionario.respostas[6].resposta}\n\n`);
      }
      else{
          for (let i=1; i<=qtdRespostas; i++) {
            if(dadosRespostas.questionario.respostas[i].resposta == "nao")
                dadosRespostas.questionario.respostas[i].resposta = "Não";
            else dadosRespostas.questionario.respostas[i].resposta = "Sim";

            respostas = respostas.concat(`${i} - ${dadosRespostas.questionario.respostas[i].pergunta}\nR: ${dadosRespostas.questionario.respostas[i].resposta}\n\n`);
          }
      }
  }

    let finalizacao;

    if(dadosRespostas.questionario.nome == "SRQ-20"){
        let nroPos, aux;

        if(dadosRespostas.resultado.charCodeAt(1) < 58 && dadosRespostas.resultado.charCodeAt(1) > 47){
            nroPos = dadosRespostas.resultado.substring(0, 2);
            aux = 3;
        }
        else{
            nroPos = dadosRespostas.resultado.substring(0, 1);
            aux = 2;
        }

        finalizacao = `\nO número de respostas positivas obtidas foi ${nroPos}.\nCom base nas respostas, o usuário ${dadosRespostas.usuario.nome} ${dadosRespostas.resultado.substring(aux, dadosRespostas.resultado.lenght).toLowerCase()}.`;
    }
    else if(dadosRespostas.questionario.nome == "Columbia"){
        if(dadosRespostas.resultado.toLowerCase() != "sem risco de suicício"){
            finalizacao = `\nCom base nas respostas, o usuário ${dadosRespostas.usuario.nome} apresenta ${dadosRespostas.resultado.toLowerCase()}.\nO mesmo foi aconselhado a procurar acolhimento.`;
        }
        else{
            finalizacao = `\nCom base nas respostas dadas, o usuário ${dadosRespostas.usuario.nome} não apresenta risco.`
        }
    }

  const corpoEmail = apresentacao.concat(respostas).concat(finalizacao);

  return corpoEmail;
}

async function enviarEmail(assuntoEmail, corpoEmail, destinoEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gapsiemail@gmail.com',
      pass: "m5'{eU^-aq_>eZGJ"
    }
  });

  const mailOptions = {
    from: 'gapsiemail@gmail.com',
    // to: 'giidaniele9@gmail.com',
    to: destinoEmail,
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
