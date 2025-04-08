// Firebase 초기화 (너의 Firebase 프로젝트 설정으로 바꿔야 해)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 교사용 난이도 설정
function setDifficulty(level) {
  db.ref("quiz/currentDifficulty").set(level);
  document.getElementById("status").innerText = `선택됨: ${level}`;
}

// 학생용 퀴즈 표시
const questionMap = {
  high: "겨울에 하늘에서 내리는 것은?",
  medium: "ㄴ + ㅜ + ㄴ 하면 어떤 낱말이 되나요?",
  low: "이미지 문제: 눈.JPG"
};

const questionDiv = document.getElementById("question");
if (questionDiv) {
  db.ref("quiz/currentDifficulty").on("value", (snapshot) => {
    const level = snapshot.val();
    if (level) {
      questionDiv.innerText = questionMap[level];
    } else {
      questionDiv.innerText = "난이도를 설정 중입니다...";
    }
  });
}
