const id = document.getElementById('id');
const password = document.getElementById('password');
const login = document.getElementById('login');
const idLink = document.getElementById('idLink');
const pwLink = document.getElementById('pwLink');
const signUpLink = document.getElementById('signUpLink');

let errStack = 0;

login.addEventListener('click', () => {
  if (id.value === 'sogong8') {
    if (password.value === 'sogong8') {
      alert('로그인 되었습니다!');
    } else {
      alert('아이디와 비밀번호를 다시 한 번 확인해주세요!');
      errStack++;
    }
  } else {
    alert('존재하지 않는 계정입니다.');
  }

  if (errStack >= 5) {
    alert('비밀번호를 5회 이상 틀리셨습니다. 비밀번호 찾기를 권장드립니다.');
  }
});

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
