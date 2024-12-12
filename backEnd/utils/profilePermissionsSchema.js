const Joi = require("joi");

const perfilPermissaoSchema = Joi.object({
  id_perfil: Joi.number().integer().positive().required().messages({
    "number.base": "O campo 'id_perfil' deve ser um número.",
    "number.integer": "O campo 'id_perfil' deve ser um número inteiro.",
    "number.positive": "O campo 'id_perfil' deve ser maior que zero.",
    "any.required": "O campo 'id_perfil' é obrigatório.",
  }),
  permissoes: Joi.array()
    .items(
      Joi.number().integer().positive().messages({
        "number.base": "Cada 'id_permissao' deve ser um número.",
        "number.integer": "Cada 'id_permissao' deve ser um número inteiro.",
        "number.positive": "Cada 'id_permissao' deve ser maior que zero.",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "O campo 'permissoes' deve ser um array.",
      "array.min": "O campo 'permissoes' deve conter pelo menos uma permissão.",
      "any.required": "O campo 'permissoes' é obrigatório.",
    }),
});

module.exports = {
  perfilPermissaoSchema,
};
