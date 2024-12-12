const Joi = require("joi");

const storeSchema = Joi.object({
  cod_loja: Joi.string().min(2).max(50).required().messages({
    "string.base": "O campo 'cod_loja' deve ser um texto.",
    "string.empty": "O campo 'cod_loja' não pode estar vazio.",
    "string.min": "O campo 'cod_loja' deve ter pelo menos 2 caracteres.",
    "string.max": "O campo 'cod_loja' deve ter no máximo 50 caracteres.",
    "any.required": "O campo 'cod_loja' é obrigatório.",
  }),
  nome: Joi.string().min(3).max(100).required().messages({
    "string.base": "O campo 'nome' deve ser um texto.",
    "string.empty": "O campo 'nome' não pode estar vazio.",
    "string.min": "O campo 'nome' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'nome' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'nome' é obrigatório.",
  }),
  cidade: Joi.string().min(3).max(100).required().messages({
    "string.base": "O campo 'cidade' deve ser um texto.",
    "string.empty": "O campo 'cidade' não pode estar vazio.",
    "string.min": "O campo 'cidade' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'cidade' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'cidade' é obrigatório.",
  }),
});

module.exports = {
  storeSchema,
};
