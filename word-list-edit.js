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
