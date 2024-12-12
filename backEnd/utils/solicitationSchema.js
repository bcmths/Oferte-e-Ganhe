const Joi = require("joi");

const solicitacaoSchema = Joi.object({
  quantidade_taloes: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'quantidade_taloes' deve ser um número.",
    "number.integer": "O campo 'quantidade_taloes' deve ser um número inteiro.",
    "number.positive": "O campo 'quantidade_taloes' deve ser maior que zero.",
    "any.required": "O campo 'quantidade_taloes' é obrigatório.",
  }),
  id_status_solicitacao: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_status_solicitacao' deve ser um número.",
    "number.integer":
      "O campo 'id_status_solicitacao' deve ser um número inteiro.",
    "number.positive":
      "O campo 'id_status_solicitacao' deve ser maior que zero.",
    "any.required": "O campo 'id_status_solicitacao' é obrigatório.",
  }),
  id_usuario: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_usuario' deve ser um número.",
    "number.integer": "O campo 'id_usuario' deve ser um número inteiro.",
    "number.positive": "O campo 'id_usuario' deve ser maior que zero.",
    "any.required": "O campo 'id_usuario' é obrigatório.",
  }),
});

module.exports = {
  solicitacaoSchema,
};
