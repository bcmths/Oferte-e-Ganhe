const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido!" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "seu-segredo", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido!" });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
