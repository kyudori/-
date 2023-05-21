const joinButton = document.getElementById('join');
const adminCodeInput = document.getElementById('grade');
const goBackButton = document.getElementById('goBack');

joinButton.addEventListener('click', () => {
  const nameInput = document.getElementById('name');
  const idInput = document.getElementById('id');
  const passwordInput = document.getElementById('password');
  const passwordCheckInput = document.getElementById('passwordchk');
  const emailInput = document.getElementById('email');
  
  const name = nameInput.value;
  const userid = idInput.value;
  const password = passwordInput.value;
  const passwordCheck = passwordCheckInput.value;
  const email = emailInput.value;
  const adminCode = adminCodeInput.value;

  if (password !== passwordCheck) {
    alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  if (password.trim() === '' || passwordCheck.trim() === '') {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  if (name.trim() === '' || userid.trim() === '' || email.trim() === '') {
    alert('입력되지 않은 항목이 있습니다.');
    return;
  }

  // 서버로 회원 가입 데이터를 전송하는 부분
  const userData = {
    name: name,
    userid: userid,
    password: password,
    email: email,
    adminCode: adminCode
  };

  // 서버에 회원 가입 데이터를 전송하는 비동기 함수 호출
  sendUserData(userData);
});

goBackButton.addEventListener('click', () => {
  window.location.href = 'login.html';
});

// 서버로 회원 가입 데이터를 전송하는 비동기 함수
async function sendUserData(userData) {
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.admin) {
        alert('관리자 회원으로 가입되었습니다.');
      } else {
        alert('일반 회원으로 가입되었습니다.');
      }
      window.location.href = 'login.html';
    } else {
      alert('회원 가입 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('회원 가입 요청 중 오류:', error);
  }
}
