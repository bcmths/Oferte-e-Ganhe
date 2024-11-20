const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const talonRoutes = require("./routes/talonRoutes");
const viewRoutes = require("./routes/viewRoutes");
const profileRoutes = require("./routes/profileRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const profilePermissionRoutes = require("./routes/profilePermissionRoutes");
const stockRoutes = require("./routes/stockRoutes");
const solicitationRoutes = require("./routes/solicitationRoutes");
const statusSolicitacaoRoutes = require("./routes/statusSolicitacaoRoutes");
const statusMovimentacaoRoutes = require("./routes/statusMovimentacaoRoutes");

const app = express();

// Middleware para servir arquivos estáticos (CSS e JS)
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/talons", talonRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/associations", profilePermissionRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/solicitations", solicitationRoutes);
app.use("/api/statusSolicitacoes", statusSolicitacaoRoutes);
app.use("/api/statusMovimentacoes", statusMovimentacaoRoutes);
app.use("/", viewRoutes);

module.exports = app;
