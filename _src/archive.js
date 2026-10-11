// Wish Tower — Firebase logic. build.py inserts this into archive.html.
// The keyword list below decides the colour of each wish.
// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Firebase web config — this is public by design. Protection lives in the
// Realtime Database rules (see README: "Wish Tower 보안 규칙").
const firebaseConfig = {
  apiKey: "AIzaSyCe2XkYA_z_GRBc-iIC2joBGj6fiXIstEk",
  authDomain: "wish-tower.firebaseapp.com",
  databaseURL: "https://wish-tower-default-rtdb.firebaseio.com",
  projectId: "wish-tower",
  storageBucket: "wish-tower.appspot.com",
  messagingSenderId: "981933719218",
  appId: "1:981933719218:web:4df6e9c805529699a3d3ab",
  measurementId: "G-MBR0999ZZP"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// keyword → colour of desire
const keywordColors = {
  "여행": "rgba(101, 173, 255, 1)", // 파란색 자유
  "건강": "rgba(101, 173, 255, 1)", // 파란색 자유
  "낫기": "rgba(101, 173, 255, 1)", // 파란색 자유
  "자유": "rgba(101, 173, 255, 1)", // 파란색 자유
  "워라벨": "rgba(101, 173, 255, 1)", // 파란색 자유
  "시간": "rgba(101, 173, 255, 1)", // 파란색 자유
  "쉬기": "rgba(101, 173, 255, 1)", // 파란색 자유
  "이민": "rgba(101, 173, 255, 1)", // 파란색 자유
  "명품": "rgba(242, 165, 119, 1)", // 주황색 소유
  "루이비통": "rgba(242, 165, 119, 1)", // 주황색 소유
  "디올": "rgba(242, 165, 119, 1)", // 주황색 소유
  "구매": "rgba(242, 165, 119, 1)", // 주황색 소유
  "에르메스": "rgba(242, 165, 119, 1)", // 주황색 소유
  "구찌": "rgba(242, 165, 119, 1)", // 주황색 소유
  "컬렉팅": "rgba(242, 165, 119, 1)", // 주황색 소유
  "소유": "rgba(242, 165, 119, 1)", // 주황색 소유
  "사랑": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "연인": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "애인": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "유혹": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "매력": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "여자친구": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "남자친구": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "마음": "rgba(239, 175, 216, 1)", // 핑크색 애정
  "부동산": "rgba(244, 211, 173, 1)", // 노란색 영역
  "반포": "rgba(244, 211, 173, 1)", // 노란색 영역
  "자이": "rgba(244, 211, 173, 1)", // 노란색 영역
  "아파트": "rgba(244, 211, 173, 1)", // 노란색
  "서울" : "rgba(244, 211, 173, 1)", // 노란색
  "강남역" : "rgba(244, 211, 173, 1)", // 노란색
  "땅" : "rgba(244, 211, 173, 1)", // 노란색
  "재개발" : "rgba(244, 211, 173, 1)", // 노란색
  "역세권": "rgba(244, 211, 173, 1)", // 노란색
  "주택": "rgba(244, 211, 173, 1)", // 노란색
  "집": "rgba(244, 211, 173, 1)", // 노란색
  "인정": "rgba(231, 105, 132, 1)", // 빨간색 인정
  "영향": "rgba(231, 105, 132, 1)", // 빨간색 인정
  "의원": "rgba(231, 105, 132, 1)",// 빨간색 인정
  "1등": "rgba(231, 105, 132, 1)",// 빨간색 인정
  "뽑히기": "rgba(231, 105, 132, 1)", // 빨간색 인정
  "승진": "rgba(231, 105, 132, 1)" , // 빨간색
  "성공": "rgba(231, 105, 132, 1)", // 빨간색
  "합격": "rgba(231, 105, 132, 1)", // 빨간색
  "수술": "rgba(203, 250, 211, 1)", // 초록색 아름다움
  "예쁘": "rgba(203, 250, 211, 1)", // 초록색 아름다움
  "예뻐": "rgba(203, 250, 211, 1)", // 초록색 아름다움
  "잘생": "rgba(203, 250, 211, 1)", // 초록색 아름다움
  "인플루엔서": "rgba(203, 250, 211, 1)", // 초록색 아름다움
  "피부": "rgba(203, 250, 211, 1)", // 초록색 아름다움
  "옷": "rgba(203, 250, 211, 1)", // 초록색 아름다움
  "커지기": "rgba(203, 250, 211, 1)" // 초록색 아름다움
};

function setRandomPositionAndAnimation(el) {
  el.style.left = `${Math.random() * 92}vw`;
  el.style.top = `${Math.random() * 94}vh`;
  el.style.setProperty('--move-x', `${Math.random() * 100 - 50}px`);
  el.style.setProperty('--move-y', `${Math.random() * 100 - 50}px`);
  el.style.animationDuration = `${Math.random() * 5 + 5}s, .08s`;
}

function determineColor(text) {
  for (const keyword in keywordColors) {
    if (text.includes(keyword)) return keywordColors[keyword];
  }
  return "rgba(38, 198, 204, 1)";
}

function displaySavedTexts() {
  const container = document.getElementById("floating-text-container");
  onValue(ref(database, 'messages'), (snapshot) => {
    container.innerHTML = "";
    snapshot.forEach((child) => {
      const text = String(child.val()).slice(0, 120);
      const el = document.createElement("div");
      el.className = "float-text";
      el.textContent = text;              // textContent: never interpreted as HTML
      el.style.color = determineColor(text);
      container.appendChild(el);
      setRandomPositionAndAnimation(el);
    });
  });
}

const status = document.getElementById("wish-status");
const UI = status.dataset;
document.getElementById("wish-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("text-input");
  const text = input.value.trim();
  if (!text) { status.textContent = UI.empty; input.focus(); return; }
  push(ref(database, 'messages'), text).then(() => {
    input.value = "";
    status.textContent = UI.saved;
  }).catch(() => {
    status.textContent = UI.error;
  });
});

displaySavedTexts();
