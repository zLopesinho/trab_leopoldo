// server/routes/quiz.js

const express = require("express");
const router = express.Router();
const Usuario = require("../../models/usuarios");
const authenticateToken = require("../../middleware/auth");

/**
 * Rota para salvar o progresso do quiz
 * Método: POST
 * Endpoint: /api/quiz/save-progress
 * Body: { currentQuestion, quizScore, quizCompleted }
 */
router.post("/save-progress", authenticateToken, async (req, res) => {
  try {
    const { currentQuestion, quizScore, quizCompleted } = req.body;
    const email = req.body.email;

    // Validação dos dados recebidos
    if (
      currentQuestion === undefined ||
      quizScore === undefined ||
      quizCompleted === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Dados incompletos para salvar o progresso." });
    }

    // Encontrar o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Atualizar os campos de progresso
    usuario.currentQuestion = currentQuestion;
    usuario.quizScore = quizScore;
    usuario.quizCompleted = quizCompleted;

    await usuario.save();

    res.status(200).json({ message: "Progresso salvo com sucesso." });
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao salvar progresso." });
  }
});

router.get("/get-progress", authenticateToken, async (req, res) => {
  try {
    let email = req.user.email;
    // Encontrar o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Retornar os dados de progresso
    const progresso = {
      currentQuestion: usuario.currentQuestion,
      quizScore: usuario.quizScore,
      quizCompleted: usuario.quizCompleted,
    };

    res.status(200).json(progresso);
  } catch (error) {
    console.error("Erro ao obter progresso:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao obter progresso." });
  }
});

module.exports = router;
