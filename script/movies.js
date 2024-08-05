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
    await slideSet();
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

async function slideSet() {
  slider("upcomingContainer");
  slider("nowContainer");
  slider("popularContainer");
  slider("topContainer");
}

function slider(containerId) {
  let slides = document.querySelector(`#${containerId}`),
    slide = slides.querySelectorAll(`#${containerId} .moviePoster`),
    currentIdx = 0,
    slideCount = slide.length,
    slideWidth = 900,
    slideMargin = 30,
    prevBtn = slides.parentNode.querySelector(".prev"),
    nextBtn = slides.parentNode.querySelector(".next");

  makeClone();

  function makeClone() {
    for (let i = 0; i < slideCount; i++) {
      let cloneSlide = slide[i].cloneNode(true);
      cloneSlide.classList.add("clone");
      slides.appendChild(cloneSlide);
    }
    //index 번호 4번은 슬라이드 05임
    //  slideCount -1 초기값
    for (let i = slideCount - 1; i >= 0; i--) {
      let cloneSlide = slide[i].cloneNode(true);
      cloneSlide.classList.add("clone");
      // 원래 있던 내용 앞에 추가해야함(요소의 앞)
      slides.prepend(cloneSlide);
    }

    updateWidth();
    // setinit();
    setTimeout(function () {
      slides.classList.add("animated");
    }, 100);
  }

  // 전체 너비를 구해서 ul의 너비를 지정하는 함수
  function updateWidth() {
    let currentSlides = document.querySelectorAll(`#${containerId} .moviePoster`);
    let newSlideCount = currentSlides.length;

    let newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + "px";
    slides.style.width = newWidth;
  }

  //초기 위치 잡는 함수
  function setinit() {
    // 왼쪽으로 움직일거니까 ( - )붙임
    // 이동할 변수
    let TranslateValue = -(slideWidth + slideMargin) * slideCount;
    slides.style.transform = "translateX(" + TranslateValue + "px)";
  }

  nextBtn.addEventListener("click", function () {
    // 지금 보고있는 슬라이드 수 +1 로 이동
    moveSlide(currentIdx + 1);
  });
  prevBtn.addEventListener("click", function () {
    // 지금 보고있는 슬라이드 수 +1 로 이동
    moveSlide(currentIdx - 1);
  });

  // 숫자가 넘어와야 함수가 작동 하도록
  // next 누를수록 왼쪽으로 translate left 값이 거리만큼 이동해야함
  // 전체가 슬라이드 너비+여백만큼 이동해야함
  function moveSlide(num) {
    // 원래는 0이었는데 사용자가 이동하면 index가 1로 바뀌어있어야 함
    slides.style.left = -num * (slideWidth + slideMargin) + "px";
    //이동한 다음에는 currentIdx를 반드시 슬라이드가 최종적으로 보고있는 num 숫자만큼 바껴있어야 함.
    currentIdx = num;
    console.log(currentIdx, slideCount);
    // 마지막이면 1번으로 다시 돌리기

    if (currentIdx == slideCount || currentIdx == -slideCount) {
      setTimeout(function () {
        slides.classList.remove("animated");
        slides.style.left = "0px";
        currentIdx = 0;
      }, 500);

      setTimeout(function () {
        slides.classList.add("animated");
      }, 600);
    }
  }
}
