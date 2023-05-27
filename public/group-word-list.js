// 그룹 이름 가져오기
const groupName = getGroupNameFromURL();
if (groupName) {
  document.getElementById('group-name').textContent = groupName;
  document.getElementById('group-title').textContent = `${groupName} 그룹 단어 리스트`;
}

function getGroupNameFromURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('groupName');
}

document.addEventListener('DOMContentLoaded', () => {
  const wordTableBody = document.querySelector('.word-table tbody');
  const addWordButton = document.getElementById('group-word-add');
  const deleteWordButton = document.getElementById('group-word-del');

    // Function to handle adding a word
    function addWord() {
      const englishInput = prompt('추가할 영어 단어를 입력하세요:');
      if (englishInput) {
        const word = {
          english: englishInput.trim(),
          meaning: '',
          type: '',
          day: '',
          memo: ''
        };
  
        addWordToTable(word);
      }
    }
  
    // Function to handle deleting a word
    function deleteWord() {
      const englishInput = prompt('삭제할 영어 단어를 입력하세요:');
      if (englishInput) {
        // Find the row with the matching English word
        const rows = wordTableBody.querySelectorAll('tr');
        for (const row of rows) {
          const englishCell = row.querySelector('td:first-child');
          if (englishCell && englishCell.textContent.trim().toLowerCase() === englishInput.trim().toLowerCase()) {
            // Remove the row
            row.remove();
            return; // Exit the function after deleting the word
          }
        }
  
        alert('해당 단어를 찾을 수 없습니다.');
      }
    }

  // Event listener for adding a word
  addWordButton.addEventListener('click', addWord);

  // Event listener for deleting a word
  deleteWordButton.addEventListener('click', deleteWord);


  // 단어 데이터 배열
  const wordData = [
    { english: 'accommodate', meaning: '수용하다', type: '동사', day: '1', memo: '' },
    { english: 'adequate', meaning: '충분한', type: '형용사', day: '2', memo: '' },
    { english: 'affordable', meaning: '저렴한', type: '형용사', day: '3', memo: '' },
    { english: 'ample', meaning: '충분한', type: '형용사', day: '4', memo: '' },
    { english: 'assert', meaning: '주장하다', type: '동사', day: '5', memo: '' },
    { english: 'complement', meaning: '보완하다', type: '동사', day: '1', memo: '' },
    { english: 'comprehensive', meaning: '포괄적인', type: '형용사', day: '2', memo: '' },
    { english: 'demonstrate', meaning: '증명하다', type: '동사', day: '3', memo: '' },
    { english: 'efficient', meaning: '효율적인', type: '형용사', day: '4', memo: '' },
    { english: 'endorse', meaning: '지지하다', type: '동사', day: '5', memo: '' },
    { english: 'feasible', meaning: '실행 가능한', type: '형용사', day: '1', memo: '' },
    { english: 'incentive', meaning: '동기', type: '명사', day: '2', memo: '' },
    { english: 'integrate', meaning: '통합하다', type: '동사', day: '3', memo: '' },
    { english: 'negotiate', meaning: '협상하다', type: '동사', day: '4', memo: '' },
    { english: 'optimum', meaning: '최적의', type: '형용사', day: '5', memo: '' },
    { english: 'precede', meaning: '앞서다', type: '동사', day: '1', memo: '' },
    { english: 'reliable', meaning: '신뢰할 수 있는', type: '형용사', day: '2', memo: '' },
    { english: 'substantial', meaning: '상당한', type: '형용사', day: '3', memo: '' },
    { english: 'validate', meaning: '확인하다', type: '동사', day: '4', memo: '' },
    { english: 'yield', meaning: '산출하다', type: '동사', day: '5', memo: '' }
  ];


  const filteredWordData = wordData.filter(word => word.group === '비슷한 단어');

  // 단어 데이터를 단어 테이블에 추가하는 함수
  function addWordToTable(word) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${word.english}</td>
      <td>${word.meaning}</td>
      <td>${word.type}</td>
      <td>${word.day}</td>
      <td>${word.memo}</td>
    `;
    wordTableBody.appendChild(row);
  }

  // 단어 데이터 배열을 순회하며 테이블에 단어 추가
  for (let i = 0; i < wordData.length; i++) {
    addWordToTable(wordData[i]);
  }
});



const goBackButton = document.getElementById('go-back');
goBackButton.addEventListener('click', () => {
  window.location.href = 'group.html';
});
