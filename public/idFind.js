const findIdButton = document.getElementById('findId');
const goBackButton = document.getElementById('goBack');

findIdButton.addEventListener('click', async () => {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');

  const name = nameInput.value;
  const email = emailInput.value;

  try {
    const response = await fetch('/find-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`찾은 ID: ${data.id}`);
    } else {
      alert('일치하는 ID를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('아이디 찾기 중 오류:', error);
    alert('아이디 찾기 중 오류가 발생했습니다.');
  }
});

goBackButton.addEventListener('click', () => {
  window.location.href = 'login.html';
});
