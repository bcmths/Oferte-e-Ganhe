const express = require("express");
const storeController = require("../controllers/storeController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de lojas ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Lojas", "Edição"),
  storeController.createStore
);
router.get(
  "/all",
  verificaPermissoes("Lojas", "Leitura"),
  storeController.getAllStores
);
router.put(
  "/editar/:id_loja",
  verificaPermissoes("Lojas", "Edição"),
  storeController.updateStore
);
router.delete(
  "/deletar/:id_loja",
  verificaPermissoes("Lojas", "Edição"),
  storeController.deleteStore
);

module.exports = router;
