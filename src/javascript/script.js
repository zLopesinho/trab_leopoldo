window.toggleNavbar = function () {
  const navbarLinks = document.querySelector(".navbar-links");
  navbarLinks.classList.toggle("show");
};
document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o usuário está logado
  const email = sessionStorage.getItem("email");

  if (email) {
    // Se o usuário estiver logado, esconde os botões de login e cadastro
    document.getElementById("login_btn").style.display = "none";
    document.getElementById("register_btn").style.display = "none";

    // Exibe o botão de jogar
    document.getElementById("play_btn").style.display = "inline-block";
  } else {
    // Se o usuário não estiver logado, garante que os botões de login e cadastro apareçam
    document.getElementById("login_btn").style.display = "inline-block";
    document.getElementById("register_btn").style.display = "inline-block";
    document.getElementById("play_btn").style.display = "none";
  }
});

// Função para verificar se há progresso salvo
async function checkSavedProgress() {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  if (!token || !email) {
    // Usuário não está logado, esconder os botões "Continuar Quiz" e "Jogar"
    document.getElementById("play_btn").style.display = "none";
    document.getElementById("continue_btn").style.display = "none";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/get-progress", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log(!result.quizCompleted);
    if (!result.quizCompleted) {
      // Mostrar o botão "Continuar Quiz"
      document.getElementById("continue_btn").style.display = "inline-block";
      // Esconder o botão "Jogar"
      document.getElementById("play_btn").style.display = "none";
    } else {
      // Mostrar o botão "Jogar"
      document.getElementById("play_btn").style.display = "inline-block";
      // Esconder o botão "Continuar Quiz"
      document.getElementById("continue_btn").style.display = "none";
    }
  } catch (error) {
    console.error("Erro ao verificar progresso salvo:", error);
    // Em caso de erro, mostrar o botão "Jogar" e esconder "Continuar Quiz"
    document.getElementById("play_btn").style.display = "inline-block";
    document.getElementById("continue_btn").style.display = "none";
  }
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", checkSavedProgress);
