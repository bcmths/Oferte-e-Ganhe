const Joi = require("joi");

const createMovementSchema = Joi.object({
  remessa: Joi.string().min(3).max(100).required().messages({
    "string.base": "O campo 'remessa' deve ser um texto.",
    "string.empty": "O campo 'remessa' não pode estar vazio.",
    "string.min": "O campo 'remessa' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'remessa' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'remessa' é obrigatório.",
  }),
  tipo_movimentacao: Joi.string()
    .valid("Envio", "Recebimento")
    .required()
    .messages({
      "string.base": "O campo 'tipo_movimentacao' deve ser um texto.",
      "any.only": "O campo 'tipo_movimentacao' deve ser 'entrada' ou 'saida'.",
      "any.required": "O campo 'tipo_movimentacao' é obrigatório.",
    }),
  data_movimentacao: Joi.date().required().messages({
    "date.base": "O campo 'Data da movimentação' deve ser uma data válida.",
    "any.required": "O campo 'Data da movimentação' é obrigatório.",
  }),
  data_prevista: Joi.date()
    .min(Joi.ref("data_movimentacao"))
    .required()
    .messages({
      "date.base": "O campo 'Entrega Prevista' deve ser uma data válida.",
      "date.min":
        "O campo 'Entrega Prevista' deve ser maior ou igual à 'Data da Movimentação'.",
      "any.required": "O campo 'Entrega Prevista' é obrigatório.",
    }),
  quantidade: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'Quantidade' deve ser um número.",
    "number.integer": "O campo 'Quantidade' deve ser um número inteiro.",
    "number.positive": "O campo 'Quantidade' deve ser maior que zero.",
    "any.required": "O campo 'Quantidade' é obrigatório.",
  }),
  id_status: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_status' deve ser um número.",
    "number.integer": "O campo 'id_status' deve ser um número inteiro.",
    "number.positive": "O campo 'id_status' deve ser maior que zero.",
    "any.required": "O campo 'id_status' é obrigatório.",
  }),
  id_solicitacao: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_solicitacao' deve ser um número.",
    "number.integer": "O campo 'id_solicitacao' deve ser um número inteiro.",
    "number.positive": "O campo 'id_solicitacao' deve ser maior que zero.",
    "any.required": "O campo 'id_solicitacao' é obrigatório.",
  }),
});

const updateMovementSchema = Joi.object({
  remessa: Joi.string().min(3).max(100).optional().messages({
    "string.base": "O campo 'remessa' deve ser um texto.",
    "string.empty": "O campo 'remessa' não pode estar vazio.",
    "string.min": "O campo 'remessa' deve ter pelo menos 3 caracteres.",
    "string.max": "O campo 'remessa' deve ter no máximo 100 caracteres.",
    "any.required": "O campo 'remessa' é obrigatório.",
  }),
  tipo_movimentacao: Joi.string()
    .valid("Envio", "Recebimento")
    .optional()
    .messages({
      "string.base": "O campo 'tipo_movimentacao' deve ser um texto.",
      "any.only": "O campo 'tipo_movimentacao' deve ser 'entrada' ou 'saida'.",
      "any.required": "O campo 'tipo_movimentacao' é obrigatório.",
    }),
  data_movimentacao: Joi.date().optional().messages({
    "date.base": "O campo 'Data da movimentação' deve ser uma data válida.",
    "any.required": "O campo 'Data da movimentação' é obrigatório.",
  }),
  data_prevista: Joi.date()
    .min(Joi.ref("data_movimentacao"))
    .optional()
    .messages({
      "date.base": "O campo 'Entrega Prevista' deve ser uma data válida.",
      "date.min":
        "O campo 'Entrega Prevista' deve ser maior ou igual à 'Data da Movimentação'.",
      "any.required": "O campo 'Entrega Prevista' é obrigatório.",
    }),
  quantidade: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'Quantidade' deve ser um número.",
    "number.integer": "O campo 'Quantidade' deve ser um número inteiro.",
    "number.positive": "O campo 'Quantidade' deve ser maior que zero.",
    "any.required": "O campo 'Quantidade' é obrigatório.",
  }),
  id_status: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'id_status' deve ser um número.",
    "number.integer": "O campo 'id_status' deve ser um número inteiro.",
    "number.positive": "O campo 'id_status' deve ser maior que zero.",
    "any.required": "O campo 'id_status' é obrigatório.",
  }),
  id_solicitacao: Joi.number().integer().positive().optional().messages({
    "number.base": "O campo 'id_solicitacao' deve ser um número.",
    "number.integer": "O campo 'id_solicitacao' deve ser um número inteiro.",
    "number.positive": "O campo 'id_solicitacao' deve ser maior que zero.",
    "any.required": "O campo 'id_solicitacao' é obrigatório.",
  }),
}).min(1);

module.exports = {
  createMovementSchema,
  updateMovementSchema,
};
