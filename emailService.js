const nodemailer = require('nodemailer');

async function enviarRelatorio (req, res) {
  try {
    const dadosRespostas = req.body;
    const assuntoEmail = `Nova resposta de questionário! | Respostas de ${dadosRespostas.usuario.nome} ao questionário ${dadosRespostas.questionario.nome}`;
    const corpoEmail = formularCorpoEmail(dadosRespostas);
    console.log('Enviando email para', 'gapsiemail@gmail.com'); // gapsi@icmc.usp.br
    await enviarEmail(assuntoEmail, corpoEmail, 'gapsiemail@gmail.com') // gapsi@icmc.usp.br

    res.status(200).send('Email enviado');
    // res.status(200).send(corpoEmail);
  } catch (err) {
    console.log(err);
    res.status(400).json({error: 'Erro ao enviar respostas por email. Consulte o console do server para mais detalhes'});
  }
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

        finalizacao = `\nO número de respostas positivas obtidas foi ${nroPos}.\nCom base nas respostas, o usuário ${dadosRespostas.usuario.nome} ${dadosRespostas.resultado.substring(aux, dadosRespostas.resultado.lenght).toLowerCase()}. \nO mesmo pode ser contatado através do e-mail ${dadosRespostas.usuario.email}.`;
    }
    else if(dadosRespostas.questionario.nome == "Columbia"){
        if(dadosRespostas.resultado.toLowerCase() != "sem risco de suicídio"){
            finalizacao = `\nCom base nas respostas, o usuário ${dadosRespostas.usuario.nome} apresenta ${dadosRespostas.resultado.toLowerCase()}.\nO mesmo foi aconselhado a procurar acolhimento, e pode ser contatado através do e-mail ${dadosRespostas.usuario.email}.`;
        }
        else{
            finalizacao = `\nCom base nas respostas dadas, o usuário ${dadosRespostas.usuario.nome} não apresenta risco. \nO mesmo pode ser contatado através do e-mail ${dadosRespostas.usuario.email}.`
        }
    }

  const corpoEmail = apresentacao.concat(respostas).concat(finalizacao);

  return corpoEmail;
}

async function enviarPedidoAgend (req, res) {
  try {
    const dadosAgend = req.body;
    const assuntoEmail = `Nova solicitação de horário de agendamento! | Feita por ${dadosAgend.usuario.nome}`;
    const corpoEmail = formularCorpoEmailAgend(dadosAgend);
    console.log('Enviando email para', 'gapsiemail@gmail.com');
    await enviarEmail(assuntoEmail, corpoEmail, 'gapsiemail@gmail.com');

    res.status(200).send('Email enviado');
    // res.status(200).send(corpoEmail);
  } catch (err) {
    console.log(err);
    res.status(400).json({error: 'Erro ao enviar pedido de agendamento por email. Consulte o console do server para mais detalhes'});
  }
}

function formularCorpoEmailAgend(dadosAgend) {
  let apresentacao = `Olá, GAPsi/Apoia!\n\nO usuário ${dadosAgend.usuario.nome} requisitou o seguinte horário especial para acolhimento: `;

  let ano = dadosAgend.dataHora.substring(0, 4);
  let mes = dadosAgend.dataHora.substring(5, 7);
  let dia = dadosAgend.dataHora.substring(8, 10);

  let hora = dadosAgend.dataHora.substring(11, 16);

  let dtSolicitacao = `${dia}/${mes}/${ano} às ${hora}.\n\n`;
  let finalizacao = `Entre em contato com o mesmo através do e-mail ${dadosAgend.usuario.email} e acerte os detalhes do agendamento, indicando se há disponibilidade ou não do acolhimento ser feito na data e na hora requisitadas.`;

  let email = apresentacao.concat(dtSolicitacao).concat(finalizacao);

  if(dadosAgend.flagUrgente){
      let urgencia = `\n\nAtenção: o usuário declarou urgência em seu pedido de agendamento. Responda-o o quanto antes!`

      email = email.concat(urgencia);
  }

  const corpoEmail = email;

  return corpoEmail;
}

async function enviarEmail(assuntoEmail, corpoEmail, destinoEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.emailGapsi,
      pass: process.env.emailPwd
    }
  });

  const mailOptions = {
    from: process.env.emailGapsi,
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

module.exports = {
  enviarRelatorio,
  enviarPedidoAgend
}

// gapsiemail@gmail.com
// m5'{eU^-aq_>eZGJ