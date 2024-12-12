const Usuario = require("../models/userModel");
const jwt = require("jsonwebtoken");

const validateSession = async (req, res, next) => {
  const token =
    req.cookies.authToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Autenticação necessária." });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);

    const usuario = await Usuario.findOne({
      where: { id_usuario: decoded.id_usuario },
    });
    if (!usuario || usuario.active_session_token !== token) {
      return res.status(401).json({ message: "Sessão inválida ou expirada." });
    }

    req.usuario = decoded;
    next();
  } catch (err) {
    console.error("Erro ao validar sessão:", err);
    res.status(401).json({ message: "Sessão inválida." });
  }
};

module.exports = validateSession;
