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

// 단어 추가 버튼 이벤트 핸들러
document.getElementById('group-word-add').addEventListener('click', () => {
  const english = prompt('추가할 영어 단어를 입력하세요:');

  // Send a request to the server to check if the word exists in the database
  fetch(`/check-word?groupName=${encodeURIComponent(groupName)}&english=${encodeURIComponent(english)}`)
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        // The word exists in the database, send a request to add it to the group
        fetch(`/add-word?groupName=${encodeURIComponent(groupName)}&english=${encodeURIComponent(english)}`)
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log('단어가 추가되었습니다.');
              // Perform any necessary actions after adding the word to the group
            } else {
              console.error('단어 추가에 실패했습니다.');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        console.log('입력한 단어는 존재하지 않습니다.');
        alert('입력한 단어는 존재하지 않습니다.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// 단어 삭제 버튼 이벤트 핸들러
document.getElementById('group-word-del').addEventListener('click', () => {
  const english = prompt('삭제할 영어 단어를 입력하세요:');

  // Send a request to the server to check if the word exists in the group
  fetch(`/check-word-in-group?groupName=${encodeURIComponent(groupName)}&english=${encodeURIComponent(english)}`)
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        // The word exists in the group, send a request to remove it from the group
        fetch(`/remove-word?groupName=${encodeURIComponent(groupName)}&english=${encodeURIComponent(english)}`)
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log('단어가 삭제되었습니다.');
              // Perform any necessary actions after removing the word from the group
            } else {
              console.error('단어 삭제에 실패했습니다.');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        console.log('입력한 단어는 해당 그룹에 존재하지 않습니다.');
        alert('입력한 단어는 해당 그룹에 존재하지 않습니다.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// 단어 행들을 동적으로 추가하는 함수
function addWordRows(words) {
  const tableBody = document.querySelector('.word-table tbody');
  tableBody.innerHTML = ''; // 기존의 행들을 모두 삭제

  words.forEach(word => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${word.English}</td>
      <td>${word.Meaning}</td>
      <td>${word.Verb}</td>
      <td>${word.Day}</td>
      <td>${word.Memo || ''}</td>
    `;
    tableBody.appendChild(row);
  });
}

// 그룹에 속한 단어 목록을 가져오는 함수
function fetchGroupWords() {
  fetch(`/group-words?groupName=${encodeURIComponent(groupName)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const words = data.words;
        addWordRows(words);
      } else {
        console.error('단어 목록을 가져오는데 실패했습니다.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// 페이지 로드 시 그룹 단어 목록을 가져옴
fetchGroupWords();




const goBackButton = document.getElementById('go-back');
goBackButton.addEventListener('click', () => {
  window.location.href = 'group.html';
});
