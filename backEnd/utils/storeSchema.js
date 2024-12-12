const Joi = require("joi");

const createStoreSchema = Joi.object({
  cod_loja: Joi.string().min(2).max(50).required().messages({
    "string.base": "O campo 'Código' deve ser um texto.",
    "string.empty": "O campo 'Código' não pode estar vazio.",
    "string.min": "O campo 'Código' deve ter pelo menos 2 caracteres.",
    "string.max": "O campo 'Código' deve ter no máximo 50 caracteres.",
    "any.required": "O campo 'Código' é obrigatório.",
  }),
  nome: Joi.string().min(3).max(100).required().messages({
    "string.base": "O campo 'Nome' deve ser um texto.",
    "string.empty": "O campo 'Nome' não pode estar vazio.",
    "string.min": "O campo 'Nome' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'Nome' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'Nome' é obrigatório.",
  }),
  cidade: Joi.string().min(3).max(100).required().messages({
    "string.base": "O campo 'cidade' deve ser um texto.",
    "string.empty": "O campo 'cidade' não pode estar vazio.",
    "string.min": "O campo 'cidade' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'cidade' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'cidade' é obrigatório.",
  }),
});

const updateStoreSchema = Joi.object({
  cod_loja: Joi.string().min(2).max(50).optional().messages({
    "string.base": "O campo 'Código' deve ser um texto.",
    "string.min": "O campo 'Código' deve ter pelo menos 2 caracteres.",
    "string.max": "O campo 'Código' deve ter no máximo 50 caracteres.",
  }),
  nome: Joi.string().min(3).max(100).optional().messages({
    "string.base": "O campo 'Nome' deve ser um texto.",
    "string.min": "O campo 'Nome' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'Nome' deve ter no máximo 100 caracteres.",
  }),
  cidade: Joi.string().min(3).max(100).optional().messages({
    "string.base": "O campo 'cidade' deve ser um texto.",
    "string.min": "O campo 'cidade' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'cidade' deve ter no máximo 100 caracteres.",
  }),
}).min(1);

module.exports = {
  createStoreSchema,
  updateStoreSchema,
};
