// ===== 1단계: 데이터 준비 =====
// 카드에 쓸 이모지 8개 
const EMOJIS = ['🦊', '🐼', '🦋', '🌈', '🎸', '🍕', '🚀', '💎'];



// ===== 2단계: 게임 상태 변수 =====
// 힌트: 뒤집힌 카드 목록, 이동 횟수, 맞춘 쌍 수, 잠금 여부 등이 필요해요
let flippedCards = [];   // 현재 뒤집힌 카드들 (최대 2장)
let matchedPairsCount = 0;  // 현재 맞춘 쌍 수
let isLock = false;    // 현재 카드를 뒤집었는지 확인
let movesCount = 0;


// ===== 3단계: DOM 요소 가져오기 =====
const boardEl = document.getElementById('gameBoard');
const movesCountEl = document.getElementById('movesCount');
const timerDisplayEl = document.getElementById('timerDisplay');
const pairsCountEl = document.getElementById('pairsCount');


// ===== 4단계: 카드 섞기 함수 =====
// 힌트: Fisher-Yates 알고리즘
// for 루프를 뒤에서부터 돌면서 랜덤 위치와 교환해요
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}


// ===== 5단계: 카드 HTML 만들기 =====
// 힌트: 카드 하나는 아래 구조예요
// <div class="card">
//   <div class="card-inner">
//     <div class="card-front">이모지</div>   ← 뒤집었을 때 보임
//     <div class="card-back">?</div>         ← 기본 상태
//   </div>
// </div>
function createCard(emoji) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">${emoji}</div>
            <div class="card-back">?</div>
        </div>
    `;
    card.addEventListener('click', () => onCardClick(card, emoji));
    return card;
}


// ===== 6단계: 카드 클릭 처리 =====
// 힌트: 고려할 예외 상황들
// - 이미 뒤집힌 카드 클릭 → 무시
// - 이미 맞춘 카드 클릭   → 무시
// - 비교 중(잠금) 상태     → 무시
// - 두 장이 뒤집히면 → checkMatch() 호출
function onCardClick(card, emoji) {
    if (isLock) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push({ card, emoji });
    movesCount++;
    movesCountEl.textContent = movesCount;

    if (flippedCards.length === 2) {
        isLock = true;
        checkMatch();
    }
}


// ===== 7단계: 매칭 확인 =====
// 힌트: flippedCards 배열에서 두 카드의 이모지가 같으면 성공!
// setTimeout을 써서 잠깐 기다렸다가 처리하면 더 자연스러워요
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.emoji === card2.emoji) {
        setTimeout(() => {
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            flippedCards = [];
            isLock = false;
            matchedPairsCount++;
            pairsCountEl.textContent = `${matchedPairsCount} / 8`;

            if (matchedPairsCount === 8) endGame();
        }, 1000)
    } else {
        setTimeout(() => {
            card1.card.classList.remove('flipped');
            card2.card.classList.remove('flipped');
            flippedCards = [];
            isLock = false;
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    alert(`축하합니다! ${movesCount}번의 이동과 ${timerDisplayEl.textContent}초만에 게임을 클리어했습니다!`);
    alert("게임을 다시 플레이하려면 '게임 시작' 버튼을 클릭하세요.");
}


// ===== 8단계: 게임 시작 =====
function startGame() {
    // 1. 상태 초기화
    flippedCards = [];
    matchedPairsCount = 0;
    isLock = false;
    movesCount = 0;

    movesCountEl.textContent = '0';
    pairsCountEl.textContent = '0/8'
    timerDisplayEl.textContent = '00:00';

    // 2. 이모지 배열 2배로 만들고 셔플
    const cards = shuffleArray([...EMOJIS, ...EMOJIS]);

    // 3. 보드 비우고 카드 생성해서 붙이기
    boardEl.innerHTML = ``;
    cards.forEach(emoji => {
        const card = createCard(emoji);
        boardEl.appendChild(card);
    })

    // 4. 타이머 시작
    clearInterval(timerInterval);
    startTimer();

}


// ===== 9단계 (선택): 타이머 =====
// setInterval / clearInterval 을 활용해보세요

let timerInterval = null;
let seconds = 0;

function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const displayMinutes = String(minutes).padStart(2, '0');
        const displaySeconds = String(remainingSeconds).padStart(2, '0');

        timerDisplayEl.textContent = `${displayMinutes}:${displaySeconds}`;
    }, 1000);
}

document.getElementById('startGameBtn').addEventListener('click', startGame);
