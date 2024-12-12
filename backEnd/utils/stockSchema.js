const Joi = require("joi");

const stockSchema = Joi.object({
  estoque_atual: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'estoque_atual' deve ser um número.",
    "number.integer": "O campo 'estoque_atual' deve ser um número inteiro.",
    "number.positive": "O campo 'estoque_atual' deve ser maior que zero.",
    "any.required": "O campo 'estoque_atual' é obrigatório.",
  }),
  estoque_minimo: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'estoque_minimo' deve ser um número.",
    "number.integer": "O campo 'estoque_minimo' deve ser um número inteiro.",
    "number.positive": "O campo 'estoque_minimo' deve ser maior que zero.",
    "any.required": "O campo 'estoque_minimo' é obrigatório.",
  }),
  estoque_recomendado: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'estoque_recomendado' deve ser um número.",
    "number.integer":
      "O campo 'estoque_recomendado' deve ser um número inteiro.",
    "number.positive": "O campo 'estoque_recomendado' deve ser maior que zero.",
    "any.required": "O campo 'estoque_recomendado' é obrigatório.",
  }),
  id_loja: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_loja' deve ser um número.",
    "number.integer": "O campo 'id_loja' deve ser um número inteiro.",
    "number.positive": "O campo 'id_loja' deve ser maior que zero.",
    "any.required": "O campo 'id_loja' é obrigatório.",
  }),
});

module.exports = {
  stockSchema,
};
