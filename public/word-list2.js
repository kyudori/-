var goBackButton = document.getElementById('go-back');

goBackButton.addEventListener('click', function() {
  window.location.href = 'home.html';
});

// 단어 메모 입력란 생성 함수
function createMemoInput() {
  var memoInput = document.createElement('input');
  memoInput.type = 'text';
  memoInput.classList.add('memo-input');
  return memoInput;
}

// 메모 편집 모드 활성화 함수
function enableMemoEditing(td) {
  var memo = td.textContent;
  td.innerHTML = '';
  var memoInput = createMemoInput();
  memoInput.value = memo;
  td.appendChild(memoInput);
  memoInput.focus();
}

// 메모 편집 모드 비활성화 함수
function disableMemoEditing(td) {
  var memoInput = td.querySelector('.memo-input');
  var memo = memoInput.value;
  td.removeChild(memoInput);
  td.textContent = memo;
}

// 메모 편집 이벤트 리스너 등록
document.addEventListener('click', function(event) {
  var target = event.target;
  if (target.tagName === 'TD' && target.classList.contains('memo-cell') && !target.classList.contains('english')) {
    enableMemoEditing(target);
  }
});

document.addEventListener('keydown', function(event) {
  var target = event.target;
  if (event.key === 'Enter' && target.classList.contains('memo-input')) {
    var td = target.parentNode;
    disableMemoEditing(td);
  }
});

document.addEventListener('focusout', function(event) {
  var target = event.target;
  if (target.classList.contains('memo-input')) {
    var td = target.parentNode;
    disableMemoEditing(td);
  }
});

// 메모 열 추가
var table = document.querySelector('.word-table');
var rows = table.rows;
for (var i = 0; i < rows.length; i++) {
  var memoCell = document.createElement('td');
  memoCell.classList.add('memo-cell');
  if (i > 0) {
    rows[i].appendChild(memoCell);
  }
}
  
// 알파벳 순으로 단어 정렬하는 함수
function sortWordsByAlphabet() {
    var table = document.querySelector('.word-table');
    var tbody = table.querySelector('tbody');
    var rows = Array.from(tbody.querySelectorAll('tr'));
  
    rows.sort(function(row1, row2) {
      var word1 = row1.querySelector('td:nth-child(1)').textContent.toLowerCase();
      var word2 = row2.querySelector('td:nth-child(1)').textContent.toLowerCase();
      if (word1 < word2) {
        return -1;
      } else if (word1 > word2) {
        return 1;
      } else {
        return 0;
      }
    });
  
    // 기존 행을 모두 제거
    tbody.innerHTML = '';
  
    // 정렬된 행을 다시 테이블에 추가
    for (var i = 0; i < rows.length; i++) {
      tbody.appendChild(rows[i]);
    }
  }
  
  // ABCD순 알파벳 정렬 버튼 클릭 시
  document.getElementById('sort-alphabet').addEventListener('click', function() {
    sortWordsByAlphabet();
  });
  
  
var hideEnglishButton = document.getElementById('hide-english');
var hideMeaningButton = document.getElementById('hide-meaning');
var englishColumns = document.querySelectorAll('.word-table td:nth-child(1)');
var meaningColumns = document.querySelectorAll('.word-table td:nth-child(2)');
var englishHidden = false;
var meaningHidden = false;

hideEnglishButton.addEventListener('click', function() {
  toggleColumnsVisibility(englishColumns);
  englishHidden = !englishHidden;
  toggleButtonText(hideEnglishButton, englishHidden, '영어 가리기', '영어 보이기');
});

hideMeaningButton.addEventListener('click', function() {
  toggleColumnsVisibility(meaningColumns);
  meaningHidden = !meaningHidden;
  toggleButtonText(hideMeaningButton, meaningHidden, '뜻 가리기', '뜻 보이기');
});

function toggleColumnsVisibility(columns) {
  for (var i = 0; i < columns.length; i++) {
    var column = columns[i];
    column.classList.toggle('hidden');
  }
}

function toggleButtonText(button, hidden, originalText, alternativeText) {
  button.textContent = hidden ? alternativeText : originalText;
}
