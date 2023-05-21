const findIdButton = document.getElementById('findId');
const goBackButton = document.getElementById('goBack');

findIdButton.addEventListener('click', () => {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');

  // 입력된 이름과 이메일로 ID를 찾는 로직을 구현합니다.
  const foundId = findId(nameInput.value, emailInput.value);

  if (foundId) {
    alert(`찾은 ID: ${foundId}`);
  } else {
    alert('일치하는 ID를 찾을 수 없습니다.');
  }
});

goBackButton.addEventListener('click', () => {
    window.location.href = 'login.html';
  });

function findId(name, email) {
  // 여기에 실제로 ID를 찾는 로직을 구현합니다.
  // 입력된 이름과 이메일을 가지고 서버 등에서 ID를 조회하고 반환합니다.
  // 예시로 임의의 ID를 반환하도록 하겠습니다.
  if (name === '한규현' && email === 'sogong8@naver.com') {
    return 'sogong8';
  } else {
    return null;
  }
}
