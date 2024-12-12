const Joi = require("joi");

const creteUserSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    "string.base": "O campo 'nome' deve ser um texto.",
    "string.empty": "O campo 'nome' não pode estar vazio.",
    "string.min": "O campo 'nome' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'nome' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'nome' é obrigatório.",
  }),
  matricula: Joi.string().min(5).max(20).required().messages({
    "string.base": "O campo 'matricula' deve ser um texto.",
    "string.empty": "O campo 'matricula' não pode estar vazio.",
    "string.min": "O campo 'matricula' deve ter pelo menos 5 caracteres.",
    "string.max": "O campo 'matricula' deve ter no máximo 20 caracteres.",
    "any.required": "O campo 'matricula' é obrigatório.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "O campo 'email' deve ser um texto.",
    "string.email": "O campo 'email' deve ser um endereço de e-mail válido.",
    "string.empty": "O campo 'email' não pode estar vazio.",
    "any.required": "O campo 'email' é obrigatório.",
  }),
  senha: Joi.string().min(6).required().messages({
    "string.base": "O campo 'senha' deve ser um texto.",
    "string.empty": "O campo 'senha' não pode estar vazio.",
    "string.min": "O campo 'senha' deve ter pelo menos 6 caracteres.",
    "any.required": "O campo 'senha' é obrigatório.",
  }),
  id_perfil: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_perfil' deve ser um número.",
    "number.integer": "O campo 'id_perfil' deve ser um número inteiro.",
    "number.positive": "O campo 'id_perfil' deve ser um número positivo.",
    "any.required": "O campo 'id_perfil' é obrigatório.",
  }),
  id_loja: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_loja' deve ser um número.",
    "number.integer": "O campo 'id_loja' deve ser um número inteiro.",
    "number.positive": "O campo 'id_loja' deve ser um número positivo.",
    "any.required": "O campo 'id_loja' é obrigatório.",
  }),
});

const updateUserSchema = Joi.object({
  nome: Joi.string().min(3).max(100).optional().messages({
    "string.base": "O campo 'nome' deve ser um texto.",
    "string.min": "O campo 'nome' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'nome' deve ter no máximo 100 caracteres.",
  }),
  email: Joi.string().email().optional().messages({
    "string.base": "O campo 'email' deve ser um texto.",
    "string.email": "O campo 'email' deve ser um endereço de e-mail válido.",
  }),
  senha: Joi.string().min(6).optional().messages({
    "string.base": "O campo 'senha' deve ser um texto.",
    "string.min": "O campo 'senha' deve ter pelo menos 6 caracteres.",
  }),
  id_perfil: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'id_perfil' deve ser um número.",
    "number.integer": "O campo 'id_perfil' deve ser um número inteiro.",
    "number.positive": "O campo 'id_perfil' deve ser um número positivo.",
  }),
  id_loja: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'id_loja' deve ser um número.",
    "number.integer": "O campo 'id_loja' deve ser um número inteiro.",
    "number.positive": "O campo 'id_loja' deve ser um número positivo.",
  }),
  novaMatricula: Joi.string().min(5).max(20).optional().messages({
    "string.base": "O campo 'novaMatricula' deve ser um texto.",
    "string.min": "O campo 'novaMatricula' deve ter pelo menos 5 caracteres.",
    "string.max": "O campo 'novaMatricula' deve ter no máximo 20 caracteres.",
  }),
}).min(1);

module.exports = {
  creteUserSchema,
  updateUserSchema,
};
