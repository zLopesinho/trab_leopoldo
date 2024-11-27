const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../../models/usuarios");
const authToken = require("../../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nome, email, senha, hierarquia } = req.body;
    console.log("Tentativa de cadastro com email:", email);

    // Verifica se todos os campos estão presentes
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: "Nome, email e senha são obrigatórios." });
    }

    // Verifica se o email já está cadastrado
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(409).json({ message: "Email já está cadastrado." });
    }

    // Hash da senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Criação do novo usuário
    const novoUsuario = await Usuario.create({
      nome: nome,
      email: email,
      hierarquia: 0,
      senha: hashedSenha,
      pontuacao: 0,
      pontuacaoMax: 0,
    });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: {
        id: novoUsuario.id,
        hierarquia: novoUsuario.hierarquia,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        pontuacao: novoUsuario.pontuacao,
        pontuacaoMax: novoUsuario.pontuacaoMax,
      },
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

module.exports = router;
