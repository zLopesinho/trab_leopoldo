const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../../middleware/auth");
const Usuario = require("../../models/usuarios");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = "andre";
console.log("Valor de SECRET_KEY:", SECRET_KEY);

router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const senha = req.body.senha;
    console.log("valor do email:", email);

    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login bem-sucedido.",
      token,
      usuario: {
        id: usuario.id,
        hierarquia: usuario.hierarquia,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro ao processar login." });
  }
});

module.exports = router;
