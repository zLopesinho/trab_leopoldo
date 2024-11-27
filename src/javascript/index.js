// Função para verificar se o usuário está autenticado
function checkAuthentication() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    // Usuário não está autenticado, redireciona para a página de login
    alert("Usuário não autenticado! Redirecionando para a tela de login...");
    window.location.href = "../src/pages/Cadastro/login.html";
  }
}

// Chama a função de verificação ao carregar o script
checkAuthentication();

// Selecionando todos os elementos necessários
const start_btn_home = document.querySelector(".start_btn");
const start_btn = document.querySelector(".start_btn #button_play");
const info_box = document.querySelector(".info_box");
const highscores = document.querySelector("#highscores");
const scoreTextPoint = document.getElementById("score");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

const loader = document.getElementById("loader");
loader.classList.add("hidden");

// --- 1. Seleção e Configuração dos Botões de Meio a Meio e Pular a Questão ---

// Seleciona o botão de Meio a Meio
const hintButton = document.querySelector(".hint_btn");

// Seleciona o botão de Pular a Questão
const skipButton = document.querySelector(".skip_btn");

let hintsRemaining = 1; // Número de usos da dica de Meio a Meio (1 vez por quiz)
let skipsRemaining = 2; // Número de usos do pular a questão (2 vezes por quiz)

hintButton.addEventListener("click", useHint); // Event listener para Meio a Meio
skipButton.addEventListener("click", skipQuestion); // Event listener para Pular a Questão

// Definição global da função startQuiz
async function startQuiz(savedProgress = null) {
  loader.classList.add("hidden"); // Esconde o loader
  start_btn_home.classList.remove("hidden"); // Mostra o botão de start novamente
  quiz_box.classList.add("activeQuiz"); // Mostra a quiz box

  if (savedProgress) {
    que_count = savedProgress.currentQuestion;
    que_numb = que_count + 1;
    userScore = savedProgress.quizScore;
    scoreTextPoint.innerHTML = userScore * 10;
  } else {
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    scoreTextPoint.innerHTML = 0;
  }

  showQuetions(que_count); // Chama a função para mostrar a primeira pergunta ou a salva
  queCounter(que_numb); // Atualiza o contador de perguntas
  startTimer(timeValue); // Inicia o timer
  startTimerLine(0); // Inicia a linha do timer
  resetHintsAndSkips(); // Reseta o estado das dicas e pulos
}

// se startQuiz button clicado
start_btn.onclick = () => {
  info_box.classList.add("activeInfo"); // Mostra a info box
};

// se exitQuiz button clicado
exit_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); // Esconde a info box
};

// se continueQuiz button clicado
continue_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); // Esconde a info box
  start_btn_home.classList.add("hidden"); // Esconde o botão de start

  loader.classList.remove("hidden"); // Mostra o loader
  setTimeout(() => startQuiz(), 3000); // Inicia o quiz após 3 segundos
};

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if quitQuiz button clicked
quit_quiz.onclick = () => {
  window.location.reload(); // Recarrega a página atual
};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
  if (que_count < questions.length - 1) {
    // Se ainda houver perguntas restantes
    que_count++; // Incrementa o índice da pergunta
    que_numb++; // Incrementa o número da pergunta
    showQuetions(que_count); // Mostra a próxima pergunta
    queCounter(que_numb); // Atualiza o contador de perguntas
    clearInterval(counter); // Limpa o timer
    clearInterval(counterLine); // Limpa a linha do timer
    startTimer(timeValue); // Reinicia o timer
    startTimerLine(widthValue); // Reinicia a linha do timer
    timeText.textContent = "Tempo Restante"; // Atualiza o texto do timer
    next_btn.classList.remove("show"); // Esconde o botão de próxima pergunta

    // Como a dica é usada apenas uma vez por quiz, não é necessário resetar por pergunta
  } else {
    clearInterval(counter); // Limpa o timer
    clearInterval(counterLine); // Limpa a linha do timer
    showResult(); // Mostra o resultado final
  }
};

// --- 3. Ajuste na Função showQuetions para Facilitar a Lógica das Funcionalidades ---
function showQuetions(index) {
  loader.classList.add("hidden"); // Esconde o loader
  const que_text = document.querySelector(".que_text");

  // **Reabilita os botões de dica e pular ao carregar uma nova questão**
  if (hintsRemaining > 0) {
    hintButton.disabled = false;
    console.log("Botão de dica reabilitado.");
  } else {
    hintButton.disabled = true;
    console.log("Botão de dica permanece desabilitado.");
  }

  if (skipsRemaining > 0) {
    skipButton.disabled = false;
    console.log("Botão de pular reabilitado.");
  } else {
    skipButton.disabled = true;
    console.log("Botão de pular permanece desabilitado.");
  }

  // Criando a tag da pergunta
  let que_tag =
    "<span>" +
    questions[index].numb +
    ". " +
    questions[index].question +
    "</span>";
  que_text.innerHTML = que_tag; // Adiciona a pergunta no HTML

  // Limpar as opções anteriores
  option_list.innerHTML = "";

  // Embaralhar as opções para que a posição da correta seja aleatória
  let shuffledOptions = shuffleArray([...questions[index].options]);

  // Criando as opções com um atributo data-answer para identificar a resposta
  shuffledOptions.forEach((option, i) => {
    let optionHTML =
      '<div class="option" data-answer="' +
      option +
      '">' +
      '<p class="choice-prefix">' +
      String.fromCharCode(65 + i) +
      "</p>" +
      '<p class="choice-text">' +
      option +
      "</p>" +
      "</div>";
    option_list.innerHTML += optionHTML;
  });

  const option = option_list.querySelectorAll(".option");

  // Adicionar event listener a todas as opções
  option.forEach((option) => {
    option.addEventListener("click", () => {
      optionSelected(option);
    });
  });
}

// --- 5. Função shuffleArray Consolidada ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// criando as novas divs para ícones
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// if user clicked on option
function optionSelected(answer) {
  clearInterval(counter); // Limpa o timer
  clearInterval(counterLine); // Limpa a linha do timer
  let userAns = answer.querySelector(".choice-text").textContent.trim(); // Obtém a resposta selecionada pelo usuário
  let correcAns = questions[que_count].answer; // Obtém a resposta correta da pergunta
  const allOptions = option_list.children.length; // Obtém o número total de opções

  if (userAns === correcAns) {
    // Se a resposta do usuário estiver correta
    userScore += 1; // Incrementa o score
    scoreTextPoint.innerHTML = userScore * 10; // Atualiza o display do score
    answer.classList.add("correct"); // Adiciona a classe de resposta correta
    answer.insertAdjacentHTML("beforeend", tickIconTag); // Adiciona o ícone de check
    console.log("Correct Answer");
    console.log("Your correct answers = " + userScore);
  } else {
    // Se a resposta do usuário estiver incorreta
    answer.classList.add("incorrect"); // Adiciona a classe de resposta incorreta
    answer.insertAdjacentHTML("beforeend", crossIconTag); // Adiciona o ícone de cross
    console.log("Wrong Answer");

    // Marca a resposta correta
    for (let i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent.trim() === correcAns) {
        option_list.children[i].setAttribute("class", "option correct"); // Adiciona a classe de resposta correta
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Adiciona o ícone de check
        console.log("Auto selected correct answer.");
      }
    }
  }

  // Desabilita todas as opções após a seleção
  for (let i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled");
  }

  // Mostra o botão de próxima pergunta
  next_btn.classList.add("show");
}

function showResult() {
  info_box.classList.remove("activeInfo"); // Esconde a info box
  quiz_box.classList.remove("activeQuiz"); // Esconde a quiz box
  result_box.classList.add("activeResult"); // Mostra a result box
  const scoreText = result_box.querySelector(".score_text");

  if (userScore > 3) {
    // Se o usuário pontuou mais de 3
    let scoreTag =
      "<span>E parabéns!! 🎉, você fez <p>" +
      userScore * 10 +
      "</p> de <p>" +
      questions.length * 10 +
      "</p></span>";
    scoreText.innerHTML = scoreTag; // Adiciona a mensagem de parabéns
  } else if (userScore > 1) {
    // Se o usuário pontuou mais de 1
    let scoreTag =
      "<span>E legal 😎, você fez  <p>" +
      userScore * 10 +
      "</p> de <p>" +
      questions.length * 10 +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
  } else {
    // Se o usuário pontuou 1 ou menos
    let scoreTag =
      "<span>e desculpe 😐, Você fez apenas <p>" +
      userScore * 10 +
      "</p> de <p>" +
      questions.length * 10 +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
  }

  const pontuacaoGame = userScore * 10;
  console.log("Pontuação", pontuacaoGame);
  sessionStorage.setItem("score", pontuacaoGame);
  savePlayerScore(userScore * 10);
}

async function savePlayerScore(score) {
  console.log("Pontuação na função de salvar:", score);
  const email = sessionStorage.getItem("email");

  if (!email) {
    alert("Erro: E-mail do jogador não encontrado.");
    return;
  }

  await fetch("http://localhost:3000/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, score }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Pontuação salva com sucesso:", data);
    })
    .catch((error) => {
      console.error("Erro ao salvar pontuação:", error);
    });
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; // Atualiza o display do timer
    time--; // Decrementa o tempo

    if (time < 9) {
      // Adiciona zero à esquerda se o tempo for menor que 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero;
    }

    if (time < 0) {
      // Se o tempo acabar
      clearInterval(counter); // Limpa o timer
      timeText.textContent = "Intervalo"; // Atualiza o texto do timer

      const allOptions = option_list.children.length; // Obtém o número total de opções
      let correcAns = questions[que_count].answer; // Obtém a resposta correta

      // Marca a resposta correta automaticamente
      for (let i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent.trim() === correcAns) {
          option_list.children[i].setAttribute("class", "option correct"); // Adiciona a classe de resposta correta
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Adiciona o ícone de check
          console.log("Time Off: Auto selected correct answer.");
        }
      }

      // Desabilita todas as opções após o tempo acabar
      for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
      }

      // **Desabilita os botões de dica e pular após o tempo expirar**
      hintButton.disabled = true;
      skipButton.disabled = true;
      console.log(
        "Botões de dica e pular desabilitados devido ao tempo expirar."
      );

      // Mostra o botão de próxima pergunta
      next_btn.classList.add("show");
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1; // Incrementa o tempo da linha
    time_line.style.width = time + "px"; // Atualiza a largura da linha do timer

    if (time > 549) {
      // Se o tempo da linha ultrapassar 549px
      clearInterval(counterLine); // Limpa o timer da linha
    }
  }
}

function queCounter(index) {
  // Cria a tag do contador de perguntas
  let totalQueCounTag =
    "<span><p>" +
    index +
    "</p> de <p>" +
    questions.length +
    "</p> Questões</span>";
  bottom_ques_counter.innerHTML = totalQueCounTag; // Adiciona o contador no HTML
}

// --- 2. Implementação das Funções useHint e skipQuestion ---

// Função para usar a dica de Meio a Meio
function useHint() {
  if (hintsRemaining <= 0) return; // Impede uso se não houver dicas restantes

  hintsRemaining--; // Decrementa o número de dicas restantes
  hintButton.disabled = true; // Desativa o botão após uso

  // Seleciona todas as opções atuais
  const options = option_list.querySelectorAll(".option");

  // Filtra as opções incorretas
  let incorrectOptions = [];
  options.forEach((option) => {
    const answerText = option.querySelector(".choice-text").textContent.trim();
    if (answerText !== questions[que_count].answer) {
      incorrectOptions.push(option);
    }
  });

  // Verifica se há pelo menos duas opções incorretas
  if (incorrectOptions.length < 2) return; // Evita erros se houver menos de duas opções incorretas

  // Embaralha as opções incorretas
  shuffleArray(incorrectOptions);

  // Seleciona duas opções incorretas para remover
  const optionsToRemove = incorrectOptions.slice(0, 2);

  // Remove as opções selecionadas
  optionsToRemove.forEach((option) => {
    option.style.display = "none"; // Esconde a opção
  });
}

// Função para pular a questão
function skipQuestion() {
  if (skipsRemaining <= 0) return; // Impede uso se não houver pulos restantes

  skipsRemaining--; // Decrementa o número de pulos restantes
  skipButton.disabled = true; // Desativa o botão após uso

  // Avança para a próxima pergunta
  if (que_count < questions.length - 1) {
    que_count++; // Incrementa o índice da pergunta
    que_numb++; // Incrementa o número da pergunta
    showQuetions(que_count); // Mostra a próxima pergunta
    queCounter(que_numb); // Atualiza o contador de perguntas
    clearInterval(counter); // Limpa o timer
    clearInterval(counterLine); // Limpa a linha do timer
    startTimer(timeValue); // Reinicia o timer
    startTimerLine(widthValue); // Reinicia a linha do timer
    timeText.textContent = "Tempo Restante"; // Atualiza o texto do timer
    next_btn.classList.remove("show"); // Esconde o botão de próxima pergunta
  } else {
    // Se não houver mais perguntas, mostra o resultado
    clearInterval(counter); // Limpa o timer
    clearInterval(counterLine); // Limpa a linha do timer
    showResult(); // Mostra o resultado final
  }
}

// --- 4. Resetar o Estado das Dicas e Pulos ao Iniciar um Novo Quiz ---
function resetHintsAndSkips() {
  hintsRemaining = 1; // Reseta o número de dicas restantes
  skipsRemaining = 2; // Reseta o número de pulos restantes
  hintButton.disabled = false; // Habilita o botão de dica
  skipButton.disabled = false; // Habilita o botão de pular
}

// Selecionar o botão de visualizar score
const viewScoreBtn = result_box.querySelector(".buttons #view-score");

// Adicionando o evento de clique
viewScoreBtn.onclick = () => {
  window.location.href = "./pages/highscores.html";
};

// Seleciona o botão de Salvar Progresso
const saveButton = document.querySelector(".save_btn");

// Adiciona o event listener para salvar o progresso
saveButton.addEventListener("click", saveProgress);

async function saveProgress() {
  // Desabilita o botão para evitar múltiplos cliques
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  // Coleta os dados atuais do quiz
  const progressData = {
    currentQuestion: que_count,
    quizScore: userScore,
    quizCompleted: false,
  };

  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  if (!email || !token) {
    alert("Erro: Usuário não autenticado.");
    saveButton.disabled = false;
    saveButton.textContent = "Salvar Progresso";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/save-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Supondo que você use tokens JWT
      },
      body: JSON.stringify({
        email,
        ...progressData,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Progresso salvo com sucesso!");
      window.location.href = "./pages/home.html";
    } else {
      alert(`Erro ao salvar progresso: ${result.message}`);
    }
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
    alert("Ocorreu um erro ao salvar o progresso. Tente novamente.");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Salvar Progresso";
  }
}

async function loadSavedProgress() {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  if (!token || !email) {
    alert("Erro: Usuário não autenticado.");
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

    if (!result.quizCompleted) {
      // Iniciar o quiz com o progresso salvo
      startQuiz(result);
    } else {
      // Não há progresso salvo, iniciar o quiz normalmente
      startQuiz();
    }
  } catch (error) {
    console.error("Erro ao carregar progresso salvo:", error);
    alert("Ocorreu um erro ao carregar o progresso salvo.");
    // Iniciar o quiz normalmente
    startQuiz();
  }
}

// Verificar se há parâmetros na URL para continuar o quiz
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const continueQuiz = urlParams.get("continue");

  if (continueQuiz === "true") {
    loadSavedProgress();
  }
});
