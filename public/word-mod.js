document.getElementById('search-button').addEventListener('click', async () => {
  const searchInput = document.getElementById('search-input');
  const englishInput = document.getElementById('english-input');
  const meaningInput = document.getElementById('meaning-input');
  const typeInput = document.getElementById('type-input');

  const searchValue = searchInput.value;

  try {
    const response = await fetch(`/search-word?search=${searchValue}`, {
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();

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

document.getElementById('mod-word').addEventListener('click', async () => {
  const searchInput = document.getElementById('search-input');
  const englishInput = document.getElementById('english-input');
  const meaningInput = document.getElementById('meaning-input');
  const typeInput = document.getElementById('type-input');

  const searchValue = searchInput.value;
  const englishValue = englishInput.value;
  const meaningValue = meaningInput.value;
  const typeValue = typeInput.value;

  try {
    const response = await fetch(`/mod-word?search=${searchValue}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: searchValue, // 수정된 부분
        English: englishValue,
        Meaning: meaningValue,
        Verb: typeValue
      })
    });

    if (response.ok) {
      console.log('단어가 성공적으로 수정되었습니다.');
      // 수정 후 필요한 작업을 수행하세요
    } else {
      console.error('단어 수정 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('단어 수정 중 오류가 발생했습니다.', error);
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
