const findPasswordButton = document.getElementById('findPassword');
const goBackButton = document.getElementById('goBack');

findPasswordButton.addEventListener('click', () => {
  const nameInput = document.getElementById('name');
  const idInput = document.getElementById('id');
  const emailInput = document.getElementById('email');

  // 입력된 이름, ID, 이메일로 비밀번호를 찾는 로직을 구현합니다.
  const foundPassword = findPassword(nameInput.value, idInput.value, emailInput.value);

  if (foundPassword) {
    alert(`찾은 비밀번호: ${foundPassword}`);
  } else {
    alert('일치하는 비밀번호를 찾을 수 없습니다.');
  }
});

goBackButton.addEventListener('click', () => {
  window.location.href = 'login.html';
});

function findPassword(name, id, email) {
  // 여기에 실제로 비밀번호를 찾는 로직을 구현합니다.
  // 입력된 이름, ID, 이메일을 가지고 서버 등에서 비밀번호를 조회하고 반환합니다.
  // 예시로 임의의 비밀번호를 반환하도록 하겠습니다.
  if (name === '한규현' && id === 'sogong8' && email === 'sogong8@naver.com') {
    return 'pwsogong8';
  } else {
    return null;
  }
}
