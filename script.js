const questions = [
  {
    question: "Who is the current President of India as of 2025?",
    options: ["Droupadi Murmu", "Ram Nath Kovind", "Narendra Modi", "Amit Shah"],
    answer: 0
  },
  {
    question: "Which country hosted the G20 Summit 2023?",
    options: ["India", "USA", "UK", "Indonesia"],
    answer: 0
  },
  {
    question: "Which team won the ICC Cricket World Cup 2023?",
    options: ["India", "Australia", "England", "New Zealand"],
    answer: 1
  },
  {
    question: "What is the name of India’s Chandrayaan-3 landing site?",
    options: ["Shiv Shakti Point", "Vikram Point", "Aryabhata Site", "Chandralok"],
    answer: 0
  },
  {
    question: "Which city will host the Olympics 2028?",
    options: ["Paris", "Los Angeles", "Tokyo", "London"],
    answer: 1
  },
  {
    question: "What was the theme of World Environment Day 2024?",
    options: ["Land Restoration", "Beat Plastic Pollution", "Restore Nature", "Green Future"],
    answer: 0
  },
  {
    question: "Which country recently joined BRICS in 2024?",
    options: ["Egypt", "Spain", "Turkey", "Argentina"],
    answer: 0
  },
  {
    question: "India signed the Artemis Accords with which space agency?",
    options: ["NASA", "ESA", "Roscosmos", "ISRO"],
    answer: 0
  },
  {
    question: "Who is the current Chief Justice of India (as of 2025)?",
    options: ["DY Chandrachud", "NV Ramana", "SA Bobde", "Ranjan Gogoi"],
    answer: 0
  },
  {
    question: "Which country won the FIFA Women’s World Cup 2023?",
    options: ["Spain", "England", "USA", "Germany"],
    answer: 0
  }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const timeDisplay = document.getElementById("time");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  startTimer();

  let currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerHTML = option;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(button, index));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  clearInterval(timer);
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
  timeLeft = 20;
  timeDisplay.innerText = timeLeft;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSkip();
    }
  }, 1000);
}

function selectAnswer(button, selectedIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });

  if (selectedIndex === currentQuestion.answer) {
    button.style.backgroundColor = "#28a745"; // green
    score++;
  } else {
    button.style.backgroundColor = "#dc3545"; // red
    buttons[currentQuestion.answer].style.backgroundColor = "#28a745";
  }

  clearInterval(timer);
  nextButton.style.display = "block";
}

function autoSkip() {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(btn => btn.disabled = true);
  buttons[questions[currentQuestionIndex].answer].style.backgroundColor = "#28a745";
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
  nextButton.onclick = startQuiz;
}

startQuiz();
