# Serviço de email
Tecnologia utilizada: Node mailer

Serviço responsável pelo envio de emails ao GAPSI. Este serviço implementa duas situações em que um email será enviado ao GAPSI: quando o usuário responde um questionário e quando o usuário solicita um agendamento para seu atendimento.

### 1. Informações sensíveis (.env e .env.example)
Para obter a senha deve-se consultar o(a) professor(a) responsável.

### 2. Formato das requisições
POST: /email/relatorio/enviar
```json
{
   "usuario": {
     "nome": str,
     "email": str,
     "nusp": str
   },
   "questionario": {
     "nome": str,
     "respostas": {
       "1": {
        "pergunta": str,
        "resposta": nao/Sim
       },
       "2": {
        "pergunta": str,
        "resposta": nao/Sim\
       }
       ...
    }
  },
  "resultado": int
}
```

POST: /email/agendamento/enviar
```json
{
   "usuario": {
     "nome": str,
     "email": str,
     "nusp": str
   },
   "dataHora": "ano-mes-dia-hora"
}
```