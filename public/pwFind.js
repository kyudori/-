const findPasswordButton = document.getElementById('findPassword');
const goBackButton = document.getElementById('goBack');

findPasswordButton.addEventListener('click', async () => {
  const nameInput = document.getElementById('name');
  const idInput = document.getElementById('id');
  const emailInput = document.getElementById('email');

  const name = nameInput.value;
  const id = idInput.value;
  const email = emailInput.value;

  try {
    const response = await fetch('/find-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, id, email })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`찾은 비밀번호: ${data.password}`);
    } else {
      alert('일치하는 비밀번호를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('비밀번호 찾기 중 오류:', error);
    alert('비밀번호 찾기 중 오류가 발생했습니다.');
  }
});

goBackButton.addEventListener('click', () => {
  window.location.href = 'login.html';
});
