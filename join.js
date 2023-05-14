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
  const id = idInput.value;
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

  if (name.trim() === '' || id.trim() === '' || email.trim() === '') {
    alert('입력되지 않은 항목이 있습니다.');
    return;
  }

  if (adminCode === 'sogong') {
    alert('관리자 회원으로 가입되었습니다.');
  } else {
    alert('일반 회원으로 가입되었습니다.');
  }
});

goBackButton.addEventListener('click', () => {
  window.location.href = 'login.html';
});
