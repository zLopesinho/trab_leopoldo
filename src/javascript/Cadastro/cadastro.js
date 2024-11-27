document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  const submitButton = document.getElementById("submit-button");

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Limpa mensagens de erro anteriores
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    const nome = nameInput.value.trim();
    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

    let isValid = true;

    // Validação de Nome
    if (nome === "") {
      nameError.textContent = "Por favor, insira um nome válido.";
      isValid = false;
    }

    // Validação de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailError.textContent = "Por favor, insira um email válido.";
      isValid = false;
    }

    // Validação de Senha
    if (senha.length < 6) {
      passwordError.textContent = "A senha deve ter pelo menos 6 caracteres.";
      isValid = false;
    }

    if (!isValid) {
      return; // Se alguma validação falhar, não prossegue
    }

    // Desativa o botão de submit e mostra um indicador de carregamento
    submitButton.disabled = true;
    submitButton.textContent = "Cadastrando...";

    try {
      const response = await fetch("http://localhost:3000/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cadastro bem-sucedido
        alert(data.message || "Cadastro realizado com sucesso!");

        // Redireciona para a página de login
        window.location.href = "../../pages/Cadastro/login.html";
      } else {
        // Tratamento de erros
        if (response.status === 409) {
          // Email já cadastrado
          emailError.textContent = data.message || "Email já está cadastrado.";
        } else if (response.status === 400) {
          // Outros erros de validação
          alert(data.message || "Erro ao cadastrar usuário.");
        } else {
          alert(data.message || "Erro ao cadastrar usuário.");
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert(
        "Erro ao conectar ao servidor. Por favor, tente novamente mais tarde."
      );
    } finally {
      // Reativa o botão de submit
      submitButton.disabled = false;
      submitButton.textContent = "Cadastrar";
    }
  });
});
