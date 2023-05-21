document.addEventListener('DOMContentLoaded', function() {
    const usernameElement = document.getElementById('username');
    const minusBtn = document.querySelector('.minus_btn_side');
    const plusBtn = document.querySelector('.plus_btn_side');
    const scoreInput = document.getElementById('scoreInput');

    minusBtn.addEventListener('click', function() {
        let score = parseInt(scoreInput.value);
        if (score > 0) {
            score -= 5;
            scoreInput.value = score;
        }
    });

    plusBtn.addEventListener('click', function() {
        let score = parseInt(scoreInput.value);
        if (score < 100) {
            score += 5;
            scoreInput.value = score;
        }
    });

    // 예시로 'sogong8' 사용
    const username = 'sogong8';
    usernameElement.textContent = `${username} 님`;
});

function goBack() {
    window.location.href = 'home.html';
}