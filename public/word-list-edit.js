var addButton = document.getElementById('word-add');
var editButton = document.getElementById('word-mod');
var deleteButton = document.getElementById('word-del');
var goBackButton = document.getElementById('go-back');

addButton.addEventListener('click', function() {
  window.location.href = 'word-add.html';
});

editButton.addEventListener('click', function() {
  window.location.href = 'word-mod.html';
});

deleteButton.addEventListener('click', function() {
  window.location.href = 'word-del.html';
});

// 뒤로가기 버튼 클릭 이벤트 처리
goBackButton.addEventListener('click', function() {
  window.location.href = 'home.html'; // home.html로 이동
});

// 단어 데이터를 가져와 테이블에 렌더링하는 함수
function renderWordTable(words) {
  const tableBody = document.querySelector('.word-table tbody');
  tableBody.innerHTML = '';

  words.forEach((word) => {
    const row = document.createElement('tr');
    
    // English 열
    const englishCell = document.createElement('td');
    englishCell.textContent = word.English;
    row.appendChild(englishCell);

    // Meaning 열
    const meaningCell = document.createElement('td');
    meaningCell.textContent = word.Meaning;
    row.appendChild(meaningCell);

    // Type 열
    const typeCell = document.createElement('td');
    typeCell.textContent = word.Verb;
    row.appendChild(typeCell);

    // Day 열
    const dayCell = document.createElement('td');
    dayCell.textContent = word.Day;
    row.appendChild(dayCell);

    // Memo 열
    const memoCell = document.createElement('td');
    memoCell.textContent = word.Memo || ''; // Memo가 null인 경우 공백으로 처리
    memoCell.textContent = word.Memo;
    row.appendChild(memoCell);

    tableBody.appendChild(row);
  });
}

// 서버로부터 단어 데이터 가져와 테이블 렌더링
fetch('/words')
  .then((response) => response.json())
  .then((data) => {
    renderWordTable(data.words);
  })
  .catch((error) => {
    console.error('단어 데이터 가져오기 중 오류가 발생했습니다:', error);
  });