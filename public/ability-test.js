//ability-test.js

const questionContainer = document.querySelector('#question-container');
const option1 = document.querySelector('#option1');
const option2 = document.querySelector('#option2');
const option3 = document.querySelector('#option3');
const option4 = document.querySelector('#option4');

// 현재 문제 인덱스
let currentQuestionIndex = 0;
const words = []; // Words 모델에서 받아온 데이터를 저장하는 배열
let wrongChoices = []; // 오답 선지를 저장하는 배열

Promise.all([
  fetch('/words2').then((response) => response.json()),
  fetch('/wrong-choices?currentQuestionIndex=' + currentQuestionIndex).then((response) => response.json())
])
  .then((data) => {
    words.push(...data[0]);
    wrongChoices = data[1]; // 서버에서 받아온 오답 선지를 할당
    generateQuestion();
  })
  .catch((error) => {
    console.error('Error:', error);
  });

const totalQuestions = 10; // 총 문항 수

// 문제 생성 함수
function generateQuestion() {
  if (currentQuestionIndex >= totalQuestions) {
    // 모든 문제가 끝난 경우 처리
    setTimeout(() => {
      const answers = document.querySelectorAll('.correct');
      const userAnswers = Array.from(answers).map((answer) => answer.textContent);
      submitQuiz(userAnswers);
    }, 1000);
    return;
  }

  const currentWord = words[currentQuestionIndex];

  // 문제 및 선택지 표시
  questionContainer.textContent = currentWord.English;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  

  shuffleArray(wrongChoices);

// 선택지 배열 생성
const choices = [currentWord.Meaning];

// 오답 선지를 선택지 배열에 추가
choices.push(
  wrongChoices[0], // 첫 번째 오답 선지
  wrongChoices[1], // 두 번째 오답 선지
  wrongChoices[2]  // 세 번째 오답 선지
);

  // 정답을 포함한 4개의 선택지를 랜덤하게 섞음
  shuffleArray(choices);

  // 선택지 텍스트 설정
  option1.textContent = choices[0];
  option2.textContent = choices[1];
  option3.textContent = choices[2];
  option4.textContent = choices[3];

  // 이벤트 리스너 등록
  option1.addEventListener('click', checkAnswer);
  option2.addEventListener('click', checkAnswer);
  option3.addEventListener('click', checkAnswer);
  option4.addEventListener('click', checkAnswer);

  // 정답을 나타내는 선택지에 'correct' 클래스 추가
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

// 정답 확인 함수
function checkAnswer(event) {
  const selectedOption = event.target;
  const currentWord = words[currentQuestionIndex];

  if (selectedOption.textContent === currentWord.Meaning) {
    // 정답 처리
    selectedOption.classList.add('correct');
  } else {
    // 오답 처리
    selectedOption.classList.add('wrong');
  }

  // 다음 문제로 넘어가기
  currentQuestionIndex++;

  // 다음 문제 생성
  generateQuestion();
}

// 퀴즈 결과 처리 및 사용자 레벨 업데이트
function handleQuizResult(result) {
  if (result.success) {
    const correctAnswers = result.correctAnswers;
    let level;

    if (correctAnswers >= 0 && correctAnswers <= 3) {
      level = 1;
    } else if (correctAnswers >= 4 && correctAnswers <= 7) {
      level = 2;
    } else if (correctAnswers >= 8 && correctAnswers <= 10) {
      level = 3;
    } else {
      // 예외 처리: 유효한 범위를 벗어나는 경우
      level = 1;
    }

    // 서버에 사용자 레벨 업데이트 요청 보내기
    updateUserInfo(level);
  } else {
    // 결과 처리 실패
    console.log('결과 처리 실패');
  }
}

// 사용자 레벨 업데이트 요청
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
      // 결과 페이지로 이동
      window.location.href = './ability-test-score.html';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// 퀴즈 결과 제출 함수
function submitQuiz(userAnswers) {
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers: userAnswers }),
  })
    .then((response) => response.json())
    .then((data) => {
      // 퀴즈 결과 처리
      handleQuizResult(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const goBackButton = document.getElementById('go-back');

goBackButton.addEventListener('click', () => {
  window.location.href = './home.html';
});

