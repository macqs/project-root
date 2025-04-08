// Firebase SDK 초기화 (compat 방식 사용)
const firebaseConfig = {
  apiKey: "AIzaSyD7r3ynx6_GoRQHUxnEyTW1smnRflge6W0",
  authDomain: "qr-quiz-74448.firebaseapp.com",
  databaseURL: "https://qr-quiz-74448-default-rtdb.asia-southeast1.firebasedatabase.app/", // <- 이거 Realtime Database 만들면 나오는 주소야!
  projectId: "qr-quiz-74448",
  storageBucket: "qr-quiz-74448.appspot.com",
  messagingSenderId: "1061064370375",
  appId: "1:1061064370375:web:05f3a5fdacdf78d05b36e2",
  measurementId: "G-DESQCKLJ64"
};

// Firebase 앱 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 난이도별 퀴즈 텍스트
const questionMap = {
  high: "겨울에 하늘에서 내리는 것은?",
  medium: "ㄴ + ㅜ + ㄴ 하면 어떤 낱말이 되나요?",
  low: "이미지 문제: 눈.JPG"
};

// ================================
// 교사용: 난이도 설정 함수
// ================================
function setDifficulty(level) {
  db.ref("quiz/currentDifficulty").set(level)
    .then(() => {
      const status = document.getElementById("status");
      if (status) {
        status.innerText = `선택됨: ${level}`;
      }
    })
    .catch((error) => {
      alert("오류 발생: " + error);
    });
}

// ================================
// 학생용: 실시간 퀴즈 불러오기
// ================================
const questionDiv = document.getElementById("question");
if (questionDiv) {
  db.ref("quiz/currentDifficulty").on("value", (snapshot) => {
    const level = snapshot.val();
    if (level && questionMap[level]) {
      questionDiv.innerText = questionMap[level];
    } else {
      questionDiv.innerText = "퀴즈를 불러오는 중입니다...";
    }
  });
}
// ===== 캔버스 터치/마우스 그리기 기능 =====
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// 좌표 구하기 (정확히)
function getPosition(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// 마우스
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  const pos = getPosition(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  const pos = getPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

// 터치
canvas.addEventListener('touchstart', (e) => {
  drawing = true;
  const touch = e.touches[0];
  const pos = getPosition(touch);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});
canvas.addEventListener('touchmove', (e) => {
  if (!drawing) return;
  e.preventDefault(); // 스크롤 방지
  const touch = e.touches[0];
  const pos = getPosition(touch);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
});
canvas.addEventListener('touchend', () => drawing = false);
canvas.addEventListener('touchcancel', () => drawing = false);

// ===== 제출 버튼 누르면 Tesseract로 인식 =====
function submitCanvas() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "인식 중...";

  Tesseract.recognize(
    canvas,
    'kor',  // 한글 언어팩 사용
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log("인식된 글자:", text);
    const cleanText = text.trim().replace(/\s/g, '');
    if (cleanText.includes("눈")) {
      resultDiv.innerText = `정답! (${cleanText})`;
    } else {
      resultDiv.innerText = `오답입니다. (${cleanText})`;
    }
  }).catch(err => {
    resultDiv.innerText = "인식 실패: " + err.message;
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
