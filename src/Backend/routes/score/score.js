const express = require("express");
const bcrypt = require("bcrypt");
//const authenticateToken = require("../../middleware/auth");
const Usuario = require("../../models/usuarios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, score } = req.body;
    console.log("score do quiz", score);
    console.log("email", email);

    if (!score) {
      return res.status(400).json({ message: "Nenhuma pontuação enviada!" });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    const usuarioMaxPont = await Usuario.findOne({ where: { hierarquia: 1 } });
    console.log("usuarioMaxPont", usuarioMaxPont);

    if (!usuario) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    await usuario.update({ quizCompleted: true });
    const pontuacaoAtual = usuario.pontuacao;
    console.log("Pontuacao do usuario antes de atualizar:", pontuacaoAtual);

    if (score) {
      await usuario.update({ pontuacao: score });
      console.log("Pontuação atualizada.");
    }

    if (score > usuario.pontuacaoMax) {
      await usuario.update({ pontuacaoMax: score });
    }

    if (usuarioMaxPont) {
      console.log("Nenhum usuario com hierarquia 1");
      if (score >= usuarioMaxPont.pontuacao) {
        await usuarioMaxPont.update({ hierarquia: 0 });
        await usuario.update({ hierarquia: 1 });
      }
    } else {
      console.log("Primeira hierarquia");
      await usuario.update({ hierarquia: 1 });
    }

    res.status(200).json({
      message: "Pontuação salva com sucesso",
      usuario: usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao salvar a pontuação" });
  }
});

router.get("/", async (req, res) => {
  try {
    const pontuacoes = await Usuario.findAll({
      attributes: ["nome", "pontuacaoMax", "email"],
    });

    //console.log(pontuacoes)

    res.status(200).send(pontuacoes);
  } catch (error) {
    console.log("Erro ao puxar as pontuações");
    res.status(400).send({ error: error });
  }
});

module.exports = router;
