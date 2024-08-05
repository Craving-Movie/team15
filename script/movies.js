import { fetchMovies, upcomingUrl, popularUrl, topUrl, nowUrl } from "./api.js";

window.onload = async function () {
  try {
    // 검색
    document.getElementById("search-button").addEventListener("click", () => {
      const query = document.getElementById("search-input").value.toLowerCase();
      const movieCards = document.querySelectorAll(".moviePoster");
      movieCards.forEach((card) => {
        const title = card.alt.toLowerCase();
        if (title.includes(query)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
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
    fetchMovies(upcomingUrl, "upcomingContainer", "upBox"),
    fetchMovies(nowUrl, "nowContainer", "nowBox"),
    fetchMovies(topUrl, "topContainer", "topBox"),
    fetchMovies(popularUrl, "popularContainer", "popularBox")
  ])
    .then(() => {
      console.log("영화 title, overview 등이 성공적으로 로드되었습니다.");
    })
    .catch((error) => {
      console.error("영화 title, overview 로드 중 오류 발생:", error);
    });
}
