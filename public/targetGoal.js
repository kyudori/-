// 페이지 로드 시 초기 점수 설정
let score = 50;

// 점수 업데이트 함수
function updateScore(value) {
  // 현재 점수에 값을 더하거나 뺌
  score += value;

  // 점수가 0 미만이거나 100을 초과하면 범위를 조정
  if (score < 0) {
    score = 0;
  } else if (score > 100) {
    score = 100;
  }

  // 점수 업데이트
  const scoreElement = document.querySelector('.score');
  scoreElement.textContent = score.toString();
}

// + 버튼 클릭 이벤트 핸들러
const plusButton = document.querySelector('.plus_btn');
plusButton.addEventListener('click', () => {
  updateScore(5);
});

// - 버튼 클릭 이벤트 핸들러
const minusButton = document.querySelector('.minus_btn');
minusButton.addEventListener('click', () => {
  updateScore(-5);
});

// 확인 버튼 클릭 이벤트 핸들러
const confirmButton = document.querySelector('.black_btn');
confirmButton.addEventListener('click', () => {
  // 알림 표시
  alert(`Daily Test 목표 점수가 ${score}점으로 설정되었습니다.`);

  // 서버로 Goal 값 업데이트 요청 보내기
  fetch('/updateGoal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ score }),
    credentials: 'same-origin' // 쿠키 전송 설정
  })
    .then(response => response.json())
    .then(data => {
      // 서버 응답 처리
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // home.html로 이동
  window.location.href = './home.html';
});

// 서버에서 사용자 정보 가져오기
fetch('/getUser', {
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then(user => {
      // 사용자 정보를 표시할 DOM 요소 찾기
      const usernameElement = document.getElementById('username');
  
      // 사용자 이름 표시
      usernameElement.textContent = user.Name + ' 님';
    })
    .catch(error => {
      console.error('Error:', error);
    });

const goBackButton = document.getElementById('go-back');
goBackButton.addEventListener('click', () => {
  window.location.href = './home.html';
});
