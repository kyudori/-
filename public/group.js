const wordGroupButton1 = document.getElementById('group-add');
wordGroupButton1.addEventListener('click', () => {
  window.location.href = 'group-word-add.html'; // 단어 그룹 페이지로 이동
});

const wordGroupButton2 = document.getElementById('group-del');
wordGroupButton2.addEventListener('click', () => {
  window.location.href = 'group-word-del.html'; // 단어 그룹 페이지로 이동
});


const goBackButton = document.getElementById('go-back');
goBackButton.addEventListener('click', () => {
  window.location.href = 'home.html';
});
