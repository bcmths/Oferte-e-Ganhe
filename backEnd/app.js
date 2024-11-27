const express = require("express");
const path = require("path");
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

const app = express();

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

app.use("/api/auth", authRoutes);

app.use(authenticateToken);

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
