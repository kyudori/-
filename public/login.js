//login.js
const id = document.getElementById('id');
const password = document.getElementById('password');
const login = document.getElementById('login');
const idLink = document.getElementById('idLink');
const pwLink = document.getElementById('pwLink');
const signUpLink = document.getElementById('signUpLink');

let errStack = 0;

login.addEventListener('click', () => {
  const userId = id.value;
  const userPassword = password.value;

  // 서버로 로그인 데이터를 전송하는 부분
  const loginData = {
    userid: userId,
    password: userPassword
  };

  // 서버에 로그인 데이터를 전송하는 비동기 함수 호출
  sendLoginData(loginData);
});

// 서버로 로그인 데이터를 전송하는 비동기 함수
async function sendLoginData(loginData) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.loggedIn) {
        if (data.admin) {
          alert('관리자로 로그인되었습니다.');
        } else {
          alert('일반 회원으로 로그인되었습니다.');
        }
        window.location.href = 'home.html'; // 로그인 성공 시 home.html로 이동
      } else {
        alert('아이디와 비밀번호를 다시 한 번 확인해주세요!');
        errStack++;
      }
    } else {
      alert('로그인 중 오류가 발생했습니다.');
      errStack++;
    }

    if (errStack >= 5) {
      alert('비밀번호를 5회 이상 틀리셨습니다. 비밀번호 찾기를 권장드립니다.');
    }
    } catch (error) {
    console.error('로그인 요청 중 오류:', error);
    alert('로그인 요청 중 오류가 발생했습니다.');
    }
    }

idLink.addEventListener('click', () => {
  // ID찾기 페이지로 이동
  window.location.href = 'idFind.html';
});

pwLink.addEventListener('click', () => {
  // PW찾기 페이지로 이동
  window.location.href = 'pwFind.html';
});

signUpLink.addEventListener('click', () => {
  // 회원가입 페이지로 이동
  window.location.href = 'join.html';
});
