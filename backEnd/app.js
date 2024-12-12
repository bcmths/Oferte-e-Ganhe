const express = require("express");
const path = require("path");
const cors = require("cors"); // Importar o middleware CORS
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const movementRoutes = require("./routes/movementRoutes");
const viewRoutes = require("./routes/viewRoutes");
const profileRoutes = require("./routes/profileRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const profilePermissionRoutes = require("./routes/profilePermissionRoutes");
const stockRoutes = require("./routes/stockRoutes");
const solicitationRoutes = require("./routes/solicitationRoutes");
const statusSolicitacaoRoutes = require("./routes/statusSolicitacaoRoutes");
const statusMovimentacaoRoutes = require("./routes/statusMovimentacaoRoutes");
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const validateSession = require("./middlewares/validateSessionMiddleware");

const app = express();

const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Origem permitida
      } else {
        callback(new Error('Not allowed by CORS')); // Origem não permitida
      }
    },
    credentials: true, // Permitir envio de cookies
  })
);

// Middleware para cookies
app.use(cookieParser());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Middleware para interpretar JSON
app.use(express.json());

// Rota base
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Rotas públicas (não autenticadas)
app.use("/api/auth", authRoutes);

// Middleware de autenticação
app.use(authenticateToken);
app.use(validateSession);

// Rotas autenticadas
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/talons", movementRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/associations", profilePermissionRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/solicitations", solicitationRoutes);
app.use("/api/statusSolicitacoes", statusSolicitacaoRoutes);
app.use("/api/statusMovimentacoes", statusMovimentacaoRoutes);
app.use("/", viewRoutes);

module.exports = app;
