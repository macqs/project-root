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
