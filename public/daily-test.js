const progressBar = document.querySelector('.progress');
const questionContainer = document.querySelector('#question-container');
const option1 = document.querySelector('#option1');
const option2 = document.querySelector('#option2');
const option3 = document.querySelector('#option3');
const option4 = document.querySelector('#option4');
let currentQuestionIndex = 0;
const words = [];
let wrongChoices = [];
const totalQuestions = 20;

let userid; // 전역 변수로 userid 선언

// /get-userid 엔드포인트 호출하여 userid 값을 가져오는 함수
async function getUserid() {
  try {
    const response = await fetch('/get-userid');
    const data = await response.json();
    userid = data.userid;
    console.log(response);
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
getUserid();



Promise.all([
  fetch('/words3').then((response) => response.json()),
  fetch('/wrong-choices?currentQuestionIndex=' + currentQuestionIndex).then((response) => response.json())
])
  .then((data) => {
    words.push(...data[0]);
    wrongChoices = data[1];
    generateQuestion();
  })
  .catch((error) => {
    console.error('Error:', error);
  });

function updateProgress() {
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function generateQuestion() {
  if (currentQuestionIndex >= totalQuestions) {
    const answers = document.querySelectorAll('.correct');
    const userAnswers = Array.from(answers).map((answer) => answer.textContent);
  }

  const currentWord = words[currentQuestionIndex];
  questionContainer.textContent = currentWord.English;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  shuffleArray(wrongChoices);

  const choices = [currentWord.Meaning];
  choices.push(
    wrongChoices[0],
    wrongChoices[1],
    wrongChoices[2]
  );

  shuffleArray(choices);

  option1.textContent = choices[0];
  option2.textContent = choices[1];
  option3.textContent = choices[2];
  option4.textContent = choices[3];

  const buttons = document.querySelectorAll('.button');
  let maxWidth = 0;

  buttons.forEach((button) => {
    if (button.offsetWidth > maxWidth) {
      maxWidth = button.offsetWidth;
    }
  });

  buttons.forEach((button) => {
    button.style.width = `${maxWidth}px`;
  });

  option1.addEventListener('click', checkAnswer);
  option2.addEventListener('click', checkAnswer);
  option3.addEventListener('click', checkAnswer);
  option4.addEventListener('click', checkAnswer);

  if (choices[0] === currentWord.Meaning) {
    option1.classList.add('correct');
  } else if (choices[1] === currentWord.Meaning) {
    option2.classList.add('correct');
  } else if (choices[2] === currentWord.Meaning) {
    option3.classList.add('correct');
  } else if (choices[3] === currentWord.Meaning) {
    option4.classList.add('correct');
  }
}

function checkAnswer(event) {
  const selectedOption = event.target;
  const currentWord = words[currentQuestionIndex];

  if (selectedOption.textContent === currentWord.Meaning) {
    console.log('정답');
    selectedOption.classList.add('correct');
  } else {
    console.log('오답');
    selectedOption.classList.add('wrong');
  }

  currentQuestionIndex++;
  generateQuestion();
  updateProgress();

  if (currentQuestionIndex === totalQuestions) {
    const answers = document.querySelectorAll('.correct');
    const userAnswers = Array.from(answers).map((answer) => answer.textContent);
    submitQuiz(userAnswers);
  }
  else if (currentQuestionIndex > totalQuestions) {
    const correctAnswers = calculateCorrectAnswers();
  }
}

function submitQuiz(userAnswers) {
  const data = {
    userid: userid,
    level: calculateLevel(userAnswers),
  };

  fetch('/update-user-level', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        const correctAnswers = calculateCorrectAnswers();
        calculateLevel(correctAnswers);
      } else {
        console.log('결과 처리 실패');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('능력 평가 결과 업데이트 중 오류가 발생했습니다.');
    });
}


function calculateCorrectAnswers() {
  let correctAnswers = 0;
  const answerElements = document.querySelectorAll('.correct');
  answerElements.forEach((element) => {
    if (element.classList.contains('correct')) {
      correctAnswers++;
    }
  });
  return correctAnswers;
}

function calculateLevel(correctAnswers) {
  let level;

  if (correctAnswers >= 0 && correctAnswers <= 3) {
    level = 1;
  } else if (correctAnswers >= 4 && correctAnswers <= 7) {
    level = 2;
  } else if (correctAnswers >= 8 && correctAnswers <= 10) {
    level = 3;
  } else {
    level = 1;
  }

  console.log(`현재 레벨: ${level}`);
  updateUserInfo(level); // calculateLevel 이후에 updateUserInfo 호출
}


function updateUserInfo(level) {
  fetch('/update-user-level', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ level }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = './daily-test-result.html';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const goBackButton = document.getElementById('go-back');

goBackButton.addEventListener('click', () => {
  window.location.href = 'daily-test-group.html';
});
