// Função de Logout
function logout() {
  // Remover o email do localStorage para deslogar o usuário
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("score");
  sessionStorage.removeItem("token");

  // Redirecionar o usuário para a página inicial ou de login
  window.location.href = "home.html"; // Mude "home.html" para a página de login se houver uma
}

// Vincular a função de logout ao botão
document.getElementById("logoutButton").addEventListener("click", logout);

document.addEventListener("DOMContentLoaded", function () {
  window.toggleNavbar = function () {
    const navbarLinks = document.querySelector(".navbar-links");
    navbarLinks.classList.toggle("show");
  };
  const email = sessionStorage.getItem("email");
  if (!email) {
    // Exibir prompt de login/cadastro
    document.getElementById("loginPrompt").style.display = "block";
    document.getElementById("profileSection").style.display = "none";
  }

  // Função para verificar se o usuário tem a maior pontuação
  async function verificarPontuacao() {
    try {
      // Faz uma requisição para verificar se o usuário logado tem hierarquia 1
      const response = await fetch(
        `http://localhost:3000/verificarHierarquia/${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(
        "Data na tela tela profile.js via rota verificar hierarquia:",
        data
      );

      // Se o usuário tiver hierarquia 1, redireciona para a tela de vencedor
      if (data.isWinner) {
        window.location.href = "../pages/vencedor.html"; // Redireciona para a tela de vencedor
      }
    } catch (error) {
      console.error("Erro ao verificar hierarquia:", error);
    }
  }

  // Função para buscar e exibir os dados do jogador
  async function getPlayerData() {
    const email = sessionStorage.getItem("email");
    try {
      const response = await fetch(
        `http://localhost:3000/profile?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // Atualizar os elementos com o nome, email e pontuação do jogador
      console.log(data.nome);
      document.getElementById("playerName").textContent = data.nome;
      document.getElementById("playerEmail").textContent = data.email;
      document.getElementById("playerScore").textContent = data.pontuacao;

      const shareText = `Eu, ${data.nome}, atingi ${data.pontuacao} pontos no jogo 'Quiz'! Será que você consegue me vencer?`;
      const shareUrl = ""; // Replace with your actual public URL

      // Set up the Twitter share button
      const twitterShareButton = document.getElementById("twitterShareButton");
      twitterShareButton.onclick = function () {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, "_blank");
      };

      const whatsappShareButton = document.getElementById(
        "whatsappShareButton"
      );
      whatsappShareButton.onclick = function () {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          shareText + " " + shareUrl
        )}`;
        window.open(whatsappUrl, "_blank");
      };
    } catch (error) {
      console.error("Erro ao buscar dados do jogador:", error);
    }
  }

  // Chamar as funções ao carregar a página
  verificarPontuacao(); // Verifica se o usuário é o vencedor
  getPlayerData(); // Exibe os dados do usuário no perfil
});
