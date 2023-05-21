const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

window.addEventListener('DOMContentLoaded', () => {
  // 관리자 여부 확인 로직
  let isAdmin = false; // 예시로 관리자 여부를 true로 설정
  
  // 단어 리스트 버튼 클릭 시
  const wordListButton = document.getElementById('word-list-button');
  wordListButton.addEventListener('click', () => {
      window.location.href = 'word-list.html'; // 단어 리스트 페이지로 이동
  });
  
  // 단어 그룹 버튼 클릭 시
  const wordGroupButton = document.getElementById('word-group-button');
  wordGroupButton.addEventListener('click', () => {
      window.location.href = 'word-group.html'; // 단어 그룹 페이지로 이동
  });
  
  // Daily Test 목표 점수 버튼 클릭 시
  const dailyTestGoalButton = document.getElementById('daily-test-goal-button');
  dailyTestGoalButton.addEventListener('click', () => {
      window.location.href = 'daily-test-goal.html'; // Daily Test 목표 점수 페이지로 이동
  });
  
  // Daily Test 버튼 클릭 시
  const dailyTestButton = document.getElementById('daily-test-button');
  dailyTestButton.addEventListener('click', () => {
      window.location.href = 'daily-test.html'; // Daily Test 페이지로 이동
  });
  
  // 능력 점검 Test 버튼 클릭 시
  const abilityTestButton = document.getElementById('ability-test-button');
  abilityTestButton.addEventListener('click', () => {
      window.location.href = 'ability-test.html'; // 능력 점검 Test 페이지로 이동
  });
  
  // 건의사항 게시판 버튼 클릭 시
  const suggestionBoardButton = document.getElementById('suggestion-board-button');
  suggestionBoardButton.addEventListener('click', () => {
      window.location.href = 'suggestion-board.html'; // 건의사항 게시판 페이지로 이동
  });
  
  // 단어 수정 버튼 클릭 시 (관리자만 표시)
  const editWordButton = document.getElementById('edit-word');
  isAdmin = true; // 관리자로 설정
  if (isAdmin) {
      editWordButton.addEventListener('click', () => {
          window.location.href = 'word-list-edit.html'; // 단어 수정 페이지로 이동
      });
  } else {
      editWordButton.style.display = 'none'; // 관리자가 아닌 경우 버튼을 숨김
  }
});
