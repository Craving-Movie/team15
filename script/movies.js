import { fetchMovies, upcomingUrl, popularUrl, topUrl, nowUrl } from "./api.js";

window.onload = async function () {
  // window.onload = async function () {
  //   try {
  //     // 검색
  //     document.getElementById("search-button").addEventListener("click", () => {
  //       const query = document.getElementById("search-input").value.toLowerCase();
  //       const movieCards = document.querySelectorAll(".moviePoster");
  //       movieCards.forEach((card) => {
  //         const title = card.alt.toLowerCase();
  //         if (title.includes(query)) {
  //           card.style.display = "block";
  //         } else {
  //           card.style.display = "none";
  //         }
  //       });
  //     });

  try {
    // 검색
    document.getElementById("search-button").addEventListener("click", () => {
      const query = document.getElementById("search-input").value.toLowerCase();
      const movieCards = document.querySelectorAll(".moviePoster");
      let found = false;
      let matchedCardId = null; // 일치하는 카드의 ID를 저장할 변수
      let matchCount = 0; // 일치하는 카드의 개수를 셀 변수

      if (query === "") {
        alert("검색어를 입력하세요.");
        return;
      }
      movieCards.forEach((card) => {
        const title = card.alt.toLowerCase();
        const posterId = card.id;
        if (title.includes(query)) {
          card.style.display = "block";
          matchCount++;
          matchedCardId = posterId; // 일치하는 카드의 ID 저장
        } else {
          card.style.display = "none";
        }
      });

      if (matchCount === 1) {
        // 일치하는 카드가 한 장이라면 상세 페이지로 이동
        window.location.href = `detailpage.html?id=${matchedCardId}`;
      } else if (matchCount === 0) {
        alert(`<${query}>에 대한 검색 결과가 없습니다.`);
        window.location.href = `index.html`;
      }
    });

    // baseData 함수를 실행시켜 영화 기본 정보 로드
    await baseData();
  } catch (error) {
    console.error("에러 발생", error);
  }
};

// 엔터키로 검색하기
const input = document.getElementById("search-input");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

// 타이틀로고 클릭시 메인 페이지 이동
const titleLogo = document.querySelector(".titleLogo");
titleLogo.addEventListener("click", function () {
  window.location.href = "index.html";
});

// top 버튼
document.getElementById("top-btn").addEventListener("click", function () {
  window.scroll({
    behavior: "smooth",
    top: 0
  });
});

// base-url에서 영화 기본 데이터 받아오기
function baseData() {
  return Promise.all([
    fetchMovies(upcomingUrl, "upcomingContainer"),
    fetchMovies(nowUrl, "nowContainer"),
    fetchMovies(topUrl, "topContainer"),
    fetchMovies(popularUrl, "popularContainer")
  ])
    .then(() => {
      console.log("영화 title, overview 등이 성공적으로 로드되었습니다.");
    })
    .catch((error) => {
      console.error("영화 title, overview 로드 중 오류 발생:", error);
    });
}
