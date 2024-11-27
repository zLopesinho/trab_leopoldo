const express = require("express");
const authenticateToken = require("../../middleware/auth");
const Usuario = require("../../models/usuarios");
const router = express.Router();

// Rota para verificar se o usuário tem hierarquia 1
router.get("/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;  // Obtém o email do usuário logado via token
    console.log("email na rota de vencedor:", userEmail)
    // Encontrar o usuário logado
    const usuario = await Usuario.findOne({ where: { email: userEmail } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

  console.log(`O usuário ${usuario.nome} tem hierarquia ${usuario.hierarquia}` )

    // Verificar se o usuário tem hierarquia 1
    if (usuario.hierarquia === 1) {
      return res.status(200).json({ isWinner: true, usuario: usuario });
    } else {
      return res.status(200).json({ isWinner: false });
    }

  } catch (error) {
    console.error("Erro ao verificar hierarquia:", error);
    res.status(500).json({ message: "Erro interno do servidor ao verificar hierarquia." });
  }
});

module.exports = router;
