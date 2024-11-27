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
const email = sessionStorage.getItem("email");

document.addEventListener("DOMContentLoaded", function () {
  window.toggleNavbar = function () {
    const navbarLinks = document.querySelector(".navbar-links");
    navbarLinks.classList.toggle("show");
  };

  // Function to fetch the player's data
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
      console.log(data);

      // Update the elements with the player's name and score
      document.getElementById("winner-name").textContent = data.nome;
      document.getElementById("winner-score").textContent = data.pontuacaoMax;

      const shareText = `Eu, ${data.nome}, atingi ${data.pontuacaoMax} pontos no jogo 'Quiz'! Será que você consegue me vencer?`;
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

  // Call the function when the page loads
  getPlayerData();
});
