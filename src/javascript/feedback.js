// Manipulação de envio do formulário
document
  .getElementById("feedbackForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Capturar os dados do formulário
    const experience = document.getElementById("experience").value;
    const difficulty = document.getElementById("difficulty").value;
    const improvements = document.getElementById("improvements").value;
    const enjoyment = document.getElementById("enjoyment").value;

    // Montar o objeto de dados do feedback
    const feedbackData = {
      experience: experience,
      difficulty: difficulty,
      improvements: improvements,
      enjoyment: enjoyment,
    };
    console.log(feedbackData);
    try {
      // Enviar dados para o backend
      const response = await fetch("http://localhost:3000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      // Verificar se a requisição foi bem-sucedida
      if (response) {
        const feedbackMessage = document.getElementById("feedbackMessage");
        feedbackMessage.textContent = "Obrigado pelo seu feedback!";
        event.target.reset(); // Limpar o formulário
      } else {
        throw new Error("Erro ao enviar feedback. Tente novamente.");
      }
    } catch (error) {
      const feedbackMessage = document.getElementById("feedbackMessage");
      feedbackMessage.textContent = error.message;
    }
  });

window.toggleNavbar = function () {
  const navbarLinks = document.querySelector(".navbar-links");
  navbarLinks.classList.toggle("show");
};
