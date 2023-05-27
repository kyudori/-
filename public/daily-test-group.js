document.addEventListener('DOMContentLoaded', () => {
  // 그룹 추가 버튼
  const groupAddButton = document.getElementById('group-add');
  groupAddButton.style.display = 'block'; // 버튼을 보이게 함

  // 그룹 삭제 버튼
  const groupDelButton = document.getElementById('group-del');
  groupDelButton.style.display = 'block'; // 버튼을 보이게 함

  // 기타 코드...
});

// 그룹 추가
async function addGroup() {
  const groupName = prompt('추가하려는 그룹 이름을 입력하세요:');

  try {
    const response = await fetch('/add-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupName })
    });

    const data = await response.json();
    if (data.success) {
      console.log('그룹이 추가되었습니다.');
      
      // 버튼 요소 생성
      const groupButton = document.createElement('button');
      groupButton.textContent = groupName;
      groupButton.classList.add('white_btn'); // 스타일 클래스 추가

      // 그룹 삭제를 위한 이벤트 핸들러 등록
      groupButton.addEventListener('click', () => {
        // 그룹 단어 목록 페이지로 이동
        window.location.href = `dailyTest.html?groupName=${groupName}`;
      });

      // 생성된 버튼을 그룹 리스트에 추가
      document.getElementById('group-list').appendChild(groupButton);
    } else {
      console.error('그룹 추가에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 그룹 삭제
async function deleteGroup(groupName) {
  try {
    const response = await fetch('/delete-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupName })
    });

    const data = await response.json();
    if (data.success) {
      console.log('그룹이 삭제되었습니다.');
      const groupButton = document.getElementById(`group-${groupName}`);
      if (groupButton) {
        groupButton.parentNode.removeChild(groupButton); // 버튼을 삭제하는 부분 수정
        location.reload(); // HTML 화면을 새로고침
      }
    } else if (data.error === '그룹 없음') {
      console.log('입력한 그룹 이름은 존재하지 않습니다.');
      alert('입력한 그룹 이름은 존재하지 않습니다.');
    } else {
      console.error('그룹 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


// 그룹 목록 가져오기
async function loadGroups() {
  try {
    const response = await fetch('/get-groups');
    const data = await response.json();
    if (data.success) {
      const groups = data.groups;
      for (let i = 0; i < groups.length; i++) {
        const groupName = groups[i].Name;
        const groupButton = document.createElement('button');
        groupButton.textContent = groupName;
        groupButton.id = `group-${groupName}`;
        groupButton.addEventListener('click', () => {
          // 그룹 단어 목록 페이지로 이동
          window.location.href = `dailyTest.html?groupName=${groupName}`;
        });
        document.getElementById('group-list').appendChild(groupButton);
      }
    } else {
      console.error('그룹 목록 가져오기에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 그룹 추가 버튼 이벤트 핸들러
document.getElementById('group-add').addEventListener('click', addGroup);

// 그룹 삭제 버튼 이벤트 핸들러
document.getElementById('group-del').addEventListener('click', () => {
  const groupName = prompt('삭제하려는 그룹 이름을 입력하세요:');
  deleteGroup(groupName);
});

// 페이지 로드 시 그룹 목록 가져오기
window.addEventListener('DOMContentLoaded', loadGroups);

const goBackButton = document.getElementById('go-back');
goBackButton.addEventListener('click', () => {
  window.location.href = 'home.html';
});
