const Joi = require("joi");

const perfilSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    "string.base": "O campo 'nome' deve ser um texto.",
    "string.empty": "O campo 'nome' não pode estar vazio.",
    "string.min": "O campo 'nome' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'nome' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'nome' é obrigatório.",
  }),
});

module.exports = {
  perfilSchema,
};
