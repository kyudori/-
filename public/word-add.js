// word-add.js
document.getElementById('go-back').addEventListener('click', () => {
    fetch('/go-back', {
      method: 'GET'
    })
      .then(response => {
        if (response.ok) {
          // 이전 페이지로 이동 성공
          window.location.href = response.url; // 이전 페이지로 리다이렉트
        } else {
          console.error('이전 페이지로 이동 중 오류가 발생했습니다.');
        }
      })
      .catch(error => {
        console.error('이전 페이지로 이동 중 오류가 발생했습니다.', error);
      });
  });
  
  document.getElementById('word-add').addEventListener('click', async () => {
    const englishInput = document.getElementById('english-input');
    const meaningInput = document.getElementById('meaning-input');
    const typeInput = document.getElementById('type-input');
    const dayInput = document.getElementById('day-input');
  
    const english = englishInput.value;
    const meaning = meaningInput.value;
    const verb = typeInput.value;
    const day = dayInput.value;
  
    const response = await fetch('/word-add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `english=${english}&meaning=${meaning}&verb=${verb}&day=${day}`
    });
  
    if (response.ok) {
      console.log('단어가 성공적으로 추가되었습니다.');
      englishInput.value = '';
      meaningInput.value = '';
      typeInput.value = '';
      dayInput.value = '';
    } else {
      console.error('단어 추가 중 오류가 발생했습니다.');
    }
  });
  