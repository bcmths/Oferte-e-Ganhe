const express = require("express");
const storeController = require("../controllers/storeController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de lojas ativa");
});

router.post("/cadastrar", storeController.createStore);
router.get("/all", storeController.getAllStores);
router.put("/editar/:id_loja", storeController.updateStore);
router.delete("/deletar/:id_loja", storeController.deleteStore);

module.exports = router;
