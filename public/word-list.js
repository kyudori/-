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
    memoCell.setAttribute('contenteditable', 'true'); // 메모를 편집 가능하도록 설정
    memoCell.addEventListener('keydown', handleMemoKeydown); // Enter 키 이벤트 처리
    row.appendChild(memoCell);

    tableBody.appendChild(row);
  });
}

let isAlphabetSorted = false; // ABCD 순 정렬 상태 추적 변수
let isDaySorted = false; // Day 순 정렬 상태 추적 변수

// ABCD 순으로 정렬하는 함수
function sortAlphabetically() {
  const tableBody = document.querySelector('.word-table tbody');
  const rows = Array.from(tableBody.querySelectorAll('tr'));

  if (!isAlphabetSorted) {
    const sortedRows = rows.slice().sort((a, b) => { // 배열 복사 후 정렬
      const wordA = a.querySelector('td:nth-child(1)').textContent.toLowerCase();
      const wordB = b.querySelector('td:nth-child(1)').textContent.toLowerCase();
      return wordA.localeCompare(wordB);
    });

    tableBody.innerHTML = '';
    sortedRows.forEach((row) => {
      tableBody.appendChild(row);
    });

    isAlphabetSorted = true;
    isDaySorted = false; // 다른 정렬 상태를 false로 설정
  } else {
    // 원래 순서로 되돌리기 위해 배열을 인덱스순으로 정렬하여 테이블에 추가합니다.
    rows.sort((a, b) => {
      const indexA = Array.from(tableBody.children).indexOf(a);
      const indexB = Array.from(tableBody.children).indexOf(b);
      return indexA - indexB;
    });

    tableBody.innerHTML = '';
    rows.forEach((row) => {
      tableBody.appendChild(row);
    });

    isAlphabetSorted = false;
  }
}

// Day 순으로 정렬하는 함수
function sortByDay() {
  const tableBody = document.querySelector('.word-table tbody');
  const rows = Array.from(tableBody.querySelectorAll('tr'));

  if (!isDaySorted) {
    const sortedRows = rows.slice().sort((a, b) => { // 배열 복사 후 정렬
      const dayA = Number(a.querySelector('td:nth-child(4)').textContent);
      const dayB = Number(b.querySelector('td:nth-child(4)').textContent);
      return dayA - dayB;
    });

    tableBody.innerHTML = '';
    sortedRows.forEach((row) => {
      tableBody.appendChild(row);
    });

    isDaySorted = true;
    isAlphabetSorted = false; // 다른 정렬 상태를 false로 설정
  } else {
    // 원래 순서로 되돌리기 위해 배열을 인덱스순으로 정렬하여 테이블에 추가합니다.
    rows.sort((a, b) => {
      const indexA = Array.from(tableBody.children).indexOf(a);
      const indexB = Array.from(tableBody.children).indexOf(b);
      return indexA - indexB;
    });

    tableBody.innerHTML = '';
    rows.forEach((row) => {
      tableBody.appendChild(row);
    });

    isDaySorted = false;
  }
}


// 영어 가리기 버튼 클릭 이벤트 처리
function toggleEnglishVisibility() {
  const englishCells = document.querySelectorAll('.word-table tbody td:first-child');
  const englishHeader = document.querySelector('.word-table thead th:first-child');

  // 첫 번째 행과 헤더를 포함한 모든 영어 열에 대해서 클래스를 토글합니다.
  englishHeader.classList.toggle('hidden');
  englishCells.forEach((cell) => {
    cell.classList.toggle('hidden');
  });
}

// 뜻 가리기 버튼 클릭 이벤트 처리
function toggleMeaningVisibility() {
  const meaningCells = document.querySelectorAll('.word-table tbody td:nth-child(2)');
  const meaningHeader = document.querySelector('.word-table thead th:nth-child(2)');

  // 첫 번째 행과 헤더를 포함한 모든 뜻 열에 대해서 클래스를 토글합니다.
  meaningHeader.classList.toggle('hidden');
  meaningCells.forEach((cell) => {
    cell.classList.toggle('hidden');
  });
}

// Memo 편집 이벤트 처리
function handleMemoKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // 엔터 키의 기본 동작 방지

    const memo = event.target.textContent.trim(); // 편집된 메모 내용 가져오기
    const row = event.target.parentNode; // 현재 행(row) 가져오기
    const english = row.firstChild.textContent; // 해당 행의 첫 번째 열(영어)에서 텍스트 가져오기

    // Memo 업데이트를 서버로 전송
    updateMemo(english, memo)
      .then(() => {
        console.log('Memo가 업데이트되었습니다.');
      })
      .catch((error) => {
        console.error('Memo 업데이트 중 오류가 발생했습니다:', error);
      });
  }
}

// Memo 업데이트 함수
async function updateMemo(english, memo) {
  try {
    const response = await fetch(`/words/${english}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ memo }) // 업데이트할 Memo 값을 요청에 포함
    });

    if (!response.ok) {
      throw new Error('Memo 업데이트에 실패했습니다.');
    }
  } catch (error) {
    throw error;
  }
}

// ABCD 순 정렬 버튼 클릭 이벤트 처리
const sortAlphabetButton = document.getElementById('sort-alphabet');
sortAlphabetButton.addEventListener('click', () => {
  sortAlphabetically();
});

// Day 순 정렬 버튼 클릭 이벤트 처리
const sortDayButton = document.getElementById('sort-day');
sortDayButton.addEventListener('click', () => {
  sortByDay();
});

// 영어 가리기 버튼 클릭 이벤트 처리
const hideEnglishButton = document.getElementById('hide-english');
hideEnglishButton.addEventListener('click', () => {
  toggleEnglishVisibility();
});

// 뜻 가리기 버튼 클릭 이벤트 처리
const hideMeaningButton = document.getElementById('hide-meaning');
hideMeaningButton.addEventListener('click', () => {
  toggleMeaningVisibility();
});

// 뒤로 가기 버튼 클릭 이벤트 처리
const goBackButton = document.getElementById('go-back');
goBackButton.addEventListener('click', () => {
  window.location.href = 'home.html';
});

// 서버로부터 단어 데이터 가져와 테이블 렌더링
fetch('/words')
  .then((response) => response.json())
  .then((data) => {
    renderWordTable(data.words);
  })
  .catch((error) => {
    console.error('단어 데이터 가져오기 중 오류가 발생했습니다:', error);
  });
