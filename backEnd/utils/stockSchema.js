const Joi = require("joi");

const createStockSchema = Joi.object({
  estoque_atual: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'Estoque Atual' deve ser um número.",
    "number.integer": "O campo 'Estoque Atual' deve ser um número inteiro.",
    "number.positive": "O campo 'Estoque Atual' deve ser maior que zero.",
    "any.required": "O campo 'Estoque Atual' é obrigatório.",
  }),
  estoque_minimo: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'Estoque Mínimo' deve ser um número.",
    "number.integer": "O campo 'Estoque Mínimo' deve ser um número inteiro.",
    "number.positive": "O campo 'Estoque Mínimo' deve ser maior que zero.",
    "any.required": "O campo 'Estoque Mínimo' é obrigatório.",
  }),
  estoque_recomendado: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'Estoque Recomendado' deve ser um número.",
    "number.integer":
      "O campo 'Estoque Recomendado' deve ser um número inteiro.",
    "number.positive": "O campo 'Estoque Recomendado' deve ser maior que zero.",
    "any.required": "O campo 'Estoque Recomendado' é obrigatório.",
  }),
  id_loja: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_loja' deve ser um número.",
    "number.integer": "O campo 'id_loja' deve ser um número inteiro.",
    "number.positive": "O campo 'id_loja' deve ser maior que zero.",
    "any.required": "O campo 'id_loja' é obrigatório.",
  }),
});

const updateStockSchema = Joi.object({
  estoque_atual: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'Estoque Atual' deve ser um número.",
    "number.integer": "O campo 'Estoque Atual' deve ser um número inteiro.",
    "number.positive": "O campo 'Estoque Atual' deve ser maior que zero.",
  }),
  estoque_minimo: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'Estoque Mínimo' deve ser um número.",
    "number.integer": "O campo 'Estoque Mínimo' deve ser um número inteiro.",
    "number.positive": "O campo 'Estoque Mínimo' deve ser maior que zero.",
  }),
  estoque_recomendado: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'Estoque Recomendado' deve ser um número.",
    "number.integer":
      "O campo 'Estoque Recomendado' deve ser um número inteiro.",
    "number.positive": "O campo 'Estoque Recomendado' deve ser maior que zero.",
  }),
  id_loja: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'id_loja' deve ser um número.",
    "number.integer": "O campo 'id_loja' deve ser um número inteiro.",
    "number.positive": "O campo 'id_loja' deve ser maior que zero.",
  }),
}).min(1);

module.exports = {
  createStockSchema,
  updateStockSchema,
};
