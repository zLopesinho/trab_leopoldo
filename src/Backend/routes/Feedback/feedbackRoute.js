const express = require("express");
const router = express.Router();
const Feedback = require("../../models/feedback");

// Middleware para validar o corpo da requisição
const validateFeedback = (req, res, next) => {
  const { experience, difficulty, improvements, enjoyment } = req.body;

  if (!experience || !difficulty || !improvements || !enjoyment) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }
  next();
};

// Rota para receber feedback
router.post("/", validateFeedback, async (req, res) => {
  try {
    const { experience, difficulty, improvements, enjoyment } = req.body;

    // Mapeamento dos campos do frontend para os campos do banco de dados
    const novoFeedback = await Feedback.create({
      experiencia: experience,
      dificuldade: difficulty,
      texto: improvements,
      divertiu: enjoyment,
    });

    return res.status(201).json({
      message: "Feedback enviado com sucesso!",
      feedback: {
        id: novoFeedback.id,
        experiencia: novoFeedback.experiencia,
        dificuldade: novoFeedback.dificuldade,
        texto: novoFeedback.texto,
        divertiu: novoFeedback.divertiu,
        createdAt: novoFeedback.createdAt,
        updatedAt: novoFeedback.updatedAt,
      },
    });
  } catch (error) {
    console.error("Erro ao salvar feedback:", error);
    return res
      .status(500)
      .json({ message: "Erro interno do servidor ao salvar feedback." });
  }
});

module.exports = router;
