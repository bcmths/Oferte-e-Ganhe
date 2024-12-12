const Joi = require("joi");

const createSolicitationSchema = Joi.object({
  quantidade_taloes: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "O campo 'Quantidade' deve ser um número.",
      "number.integer": "O campo 'Quantidade' deve ser um número inteiro.",
      "number.positive": "O campo 'Quantidade' deve ser maior que zero.",
      "any.required": "O campo 'Quantidade' é obrigatório.",
    }),
  id_status_solicitacao: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "O campo 'id_status_solicitacao' deve ser um número.",
      "number.integer": "O campo 'id_status_solicitacao' deve ser um número inteiro.",
      "number.positive": "O campo 'id_status_solicitacao' deve ser maior que zero.",
      "any.required": "O campo 'id_status_solicitacao' é obrigatório.",
    }),
  id_usuario: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "O campo 'id_usuario' deve ser um número.",
      "number.integer": "O campo 'id_usuario' deve ser um número inteiro.",
      "number.positive": "O campo 'id_usuario' deve ser maior que zero.",
      "any.required": "O campo 'id_usuario' é obrigatório.",
    }),
});

const updateSolicitationSchema = Joi.object({
  quantidade_taloes: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "O campo 'Quantidade' deve ser um número.",
      "number.integer": "O campo 'Quantidade' deve ser um número inteiro.",
      "number.positive": "O campo 'Quantidade' deve ser maior que zero.",
    }),
  id_status_solicitacao: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "O campo 'id_status_solicitacao' deve ser um número.",
      "number.integer": "O campo 'id_status_solicitacao' deve ser um número inteiro.",
      "number.positive": "O campo 'id_status_solicitacao' deve ser maior que zero.",
    }),
  id_usuario: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "O campo 'id_usuario' deve ser um número.",
      "number.integer": "O campo 'id_usuario' deve ser um número inteiro.",
      "number.positive": "O campo 'id_usuario' deve ser maior que zero.",
    }),
}).min(1);

module.exports = {
  createSolicitationSchema,
  updateSolicitationSchema,
};
