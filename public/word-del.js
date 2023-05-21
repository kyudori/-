document.getElementById('search-button').addEventListener('click', async () => {
  const searchInput = document.getElementById('search-input');
  const englishInput = document.getElementById('english-input');
  const meaningInput = document.getElementById('meaning-input');
  const typeInput = document.getElementById('type-input');

  const searchValue = searchInput.value;

  // 서버로 검색 요청을 보내고 응답을 받음
  try {
    const response = await fetch(`/search-word?search=${searchValue}`, {
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();

      // 응답에서 받은 데이터를 입력란에 설정
      englishInput.value = data.English;
      meaningInput.value = data.Meaning;
      typeInput.value = data.Verb;
    } else {
      console.error('단어 검색 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('단어 검색 중 오류가 발생했습니다.', error);
  }
});

document.getElementById('del-word').addEventListener('click', async () => {
  const searchInput = document.getElementById('search-input');
  const englishInput = document.getElementById('english-input');
  const meaningInput = document.getElementById('meaning-input');
  const typeInput = document.getElementById('type-input');

  const searchValue = searchInput.value;

  try {
    const response = await fetch(`/delete-word?search=${searchValue}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('단어가 성공적으로 삭제되었습니다.');
      englishInput.value = '';
      meaningInput.value = '';
      typeInput.value = '';
    } else {
      console.error('단어 삭제 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('단어 삭제 중 오류가 발생했습니다.', error);
  }
});


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
