// 1. 코드를 시간순에 맞게 정리(한국말로)
// 1) 최초에 화면(html)이 로드되면, TMDB로부터 데이터를 쭉 갖고 온다.
// 2) 쭉 갖고오면, 개수를 읽어서 슬라이드를 만든다.
// 3) 슬라이드의 가로 길이를 구한다.
// 4) 슬라이드의 첫 시작점 위치를 구한다.
// 5) 버튼을 누를수록 슬라이드 카운트가 올라간다.
// 6) 슬라이드의 인덱스와 카운트 값이 같아지면 처음 위치로 돌아간다.

// 2) 시간순에 맞게 재배치

// 개인 API 설정
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer 5a3488ac1342b3f9bcf2ad06969cd295"
  }
};
const API_KEY = "5a3488ac1342b3f9bcf2ad06969cd295";
const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko&page=1&region=KR`;
const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko&page=1&region=KR`;
const topUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko&page=1&region=KR`;
const nowUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=KR`;

// 검색: 윈도우가 준비됐을 때 해당 함수 실행
window.onload = function () {
  document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.toLowerCase();
    const movieCards = document.querySelectorAll(".moviePoster");
    movieCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      if (title.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
};

// 엔터키로 검색하기
const input = document.getElementById("search-input");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

// 1. 개봉 예정작 카드 생성 부분
fetch(upcomingUrl, options)
  .then((response) => response.json())
  .then((data) => {
    const Container = document.getElementById("upcomingContainer");
    data.results.forEach((movie) => {
      const img = document.createElement("img");
      img.className = "upcomingPoster";
      img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      img.alt = movie.title;
      img.id = movie.id;
      img.addEventListener("click", () => alert(`<${movie.title}>의 ID는 ${movie.id}입니다.`));
      Container.appendChild(img);
    });

    // 슬라이드에 쓸 변수들
    let slides = document.querySelector(".upcomingList");
    let slide = document.querySelectorAll(".upcomingList .upcomingPoster");
    let currentIdx = 0;
    let slideCount = slide.length;
    let slideWidth = 300;
    let slideMargin = 30;
    let prevBtn = document.querySelector(".upcomingPrev");
    let nextBtn = document.querySelector(".upcomingNext");

    console.log("수정중 => ", slideCount);

    // 슬라이드 복제
    // makeClone();
    // function makeClone() {
    //   for (let i = 0; i < slideCount; i++) {
    //     let cloneSlide = slide[i].cloneNode(true);
    //     cloneSlide.classList.add("clone");
    //     slides.appendChild(cloneSlide);
    //   }
    //   // index 번호 4번은 슬라이드 05임
    //   // slideCount -1 초기값
    //   for (let i = slideCount - 1; i >= 0; i--) {
    //     let cloneSlide = slide[i].cloneNode(true);
    //     cloneSlide.classList.add("clone");
    //     // 원래 있던 요소의 앞에 추가
    //     slides.prepend(cloneSlide);
    //   }
    //   updateWidth();
    //   setinit();
    //   setTimeout(function () {
    //     slides.classList.add("animated");
    //   }, 100);
    // }
    
    // 전체 너비를 구해서 포스터의 너비를 지정하는 함수
    // function updateWidth() {
    //   let currentSlides = document.querySelectorAll(".upcomingList .upcomingPoster");
    //   let newSlideCount = currentSlides.length;
    //   let newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + "px";
    //   slides.style.width = newWidth;
    // }

    // // 초기 위치 잡는 함수
    // function setinit() {
    //   // 왼쪽으로 움직일 거니까 '-' 붙임
    //   let TranslateValue = (slideWidth + slideMargin) * slideCount;
    //   slides.style.transform = "translateX(" + TranslateValue + "px)";
    // }

    // 버튼 Event
    nextBtn.addEventListener("click", function () {
      moveSlide(currentIdx + 5);
    });
    prevBtn.addEventListener("click", function () {
      moveSlide(currentIdx - 5);
    });

    function moveSlide(num) {
      slides.style.left = -num * (slideWidth + slideMargin) + "px";
      currentIdx = num;
      console.log(currentIdx, slideCount);

      // 마지막 도달 시 첫 번째로 돌아가기
      if (currentIdx === slideCount || currentIdx === -slideCount) {
        setTimeout(function () {
          slides.classList.remove("animated");
          slides.style.left = "0px";
          currentIdx = 0;
        }, 500);
        console.log("끝이니까 처음으로 돌아가자!");

        setTimeout(function () {
          slides.classList.add("animated");
        }, 600);
      }
    }
  })
  .catch((err) => console.error(err));

// 2. 현재 상영작 카드 생성 부분
fetch(nowUrl, options)
  .then((nowResponse) => nowResponse.json())
  .then((nowData) => {
    const nowContainer = document.getElementById("nowContainer");
    nowData.results.forEach((nowMovie) => {
      const nowImg = document.createElement("img");
      nowImg.className = "nowPoster";
      nowImg.src = `https://image.tmdb.org/t/p/w500${nowMovie.poster_path}`;
      nowImg.alt = nowMovie.title;
      nowImg.id = nowMovie.id;
      nowImg.addEventListener("click", () => alert(`<${nowMovie.title}>의 ID는 ${nowMovie.id}입니다.`));
      nowContainer.appendChild(nowImg);
    });

      // 슬라이드에 쓸 변수들
      let nowSlides = document.querySelector(".nowList");
      let nowSlide = document.querySelectorAll(".nowList .nowPoster");
      let nowCurrentIdx = 0;
      let nowSlideCount = nowSlide.length;
      let nowSlideWidth = 300;
      let nowSlideMargin = 30;
      let nowPrevBtn = document.querySelector(".nowPrev");
      let nowNextBtn = document.querySelector(".nowNext");
  
      console.log("수정중2 => ", nowSlideCount);
  
      // 버튼 Event
      nowNextBtn.addEventListener("click", function () {
        moveSlide2(nowCurrentIdx + 5);
      });
      nowPrevBtn.addEventListener("click", function () {
        moveSlide2(nowCurrentIdx - 5);
      });
  
      function moveSlide2(num2) {
        nowSlides.style.left = -num2 * (nowSlideWidth + nowSlideMargin) + "px";
        nowCurrentIdx = num2;
        console.log(nowCurrentIdx, nowSlideCount);
  
        // 마지막 도달 시 첫 번째로 돌아가기
        if (nowCurrentIdx === nowSlideCount || nowCurrentIdx === -nowSlideCount) {
          setTimeout(function () {
            nowSlides.classList.remove("animated");
            nowSlides.style.left = "0px";
            nowCurrentIdx = 0;
          }, 500);
          console.log("끝이니까 처음으로 돌아가자!2");
  
          setTimeout(function () {
            nowSlides.classList.add("animated");
          }, 600);
        }
      }
  })
  .catch((err) => console.error(err));

  // 3. 인기 영화 카드 생성 부분
fetch(popularUrl, options)
.then((popResponse) => popResponse.json())
.then((popData) => {
  const popContainer = document.getElementById("popularContainer");
  popData.results.forEach((popMovie) => {
    const popImg = document.createElement("img");
    popImg.className = "popularPoster";
    popImg.src = `https://image.tmdb.org/t/p/w500${popMovie.poster_path}`;
    popImg.alt = popMovie.title;
    popImg.id = popMovie.id;
    popImg.addEventListener("click", () => alert(`<${popMovie.title}>의 ID는 ${popMovie.id}입니다.`));
    popContainer.appendChild(popImg);
  });

    // 슬라이드에 쓸 변수들
    let popuSlides = document.querySelector(".popularList");
    let popSlide = document.querySelectorAll(".popularList .popularPoster");
    let popCurrentIdx = 0;
    let popSlideCount = popSlide.length;
    let popSlideWidth = 300;
    let popSlideMargin = 30;
    let popPrevBtn = document.querySelector(".popularPrev");
    let popNextBtn = document.querySelector(".popularNext");

    console.log("수정중2 => ", popSlideCount);

    // 버튼 Event
    popNextBtn.addEventListener("click", function () {
      moveSlide2(popCurrentIdx + 5);
    });
    popPrevBtn.addEventListener("click", function () {
      moveSlide2(popCurrentIdx - 5);
    });

    function moveSlide2(num2) {
      popuSlides.style.left = -num2 * (popSlideWidth + popSlideMargin) + "px";
      popCurrentIdx = num2;
      console.log(popCurrentIdx, popSlideCount);

      // 마지막 도달 시 첫 번째로 돌아가기
      if (popCurrentIdx === popSlideCount || popCurrentIdx === -popSlideCount) {
        setTimeout(function () {
          popuSlides.classList.remove("animated");
          popuSlides.style.left = "0px";
          popCurrentIdx = 0;
        }, 500);
        console.log("끝이니까 처음으로 돌아가자!2");

        setTimeout(function () {
          popuSlides.classList.add("animated");
        }, 600);
      }
    }
})
.catch((err) => console.error(err));

// top 버튼
document.getElementById("top-btn").addEventListener("click", function () {
  var body = document.getElementsByTagName("body")[0];
  //창의 스크롤을 본문 최상단으로 부드럽게 이동시킵니다.
  window.scroll({
    behavior: "smooth",
    top: body.offsetTop
  });
});

// // 개봉 예정작 슬라이드
// let slides = document.querySelector(".container1"),
//   slide = document.querySelectorAll(".container1 .upcomingPoster"),
//   currentIdx = 0,
//   slideCount = slide.length,
//   slideWidth = 900, // 슬라이드를 얼만큼 넘길 건지(1개씩 넘길 거면 300)
//   slideMargin = 30,
//   prevBtn = document.querySelector(".prev"),
//   nextBtn = document.querySelector(".next");
// console.log(slide);
// makeClone();

// function makeClone() {
//   for (let i = 0; i < slideCount; i++) {
//     let cloneSlide = slide[i].cloneNode(true);
//     cloneSlide.classList.add("clone");
//     slides.appendChild(cloneSlide);
//   }
//   //index 번호 4번은 슬라이드 05임
//   //  slideCount -1 초기값
//   for (let i = slideCount - 1; i >= 0; i--) {
//     let cloneSlide = slide[i].cloneNode(true);
//     cloneSlide.classList.add("clone");
//     // 원래 있던 내용 앞에 추가해야함(요소의 앞)
//     slides.prepend(cloneSlide);
//   }

//   updateWidth();
//   setinit();
//   setTimeout(function () {
//     slides.classList.add("animated");
//   }, 100);
// }

// // 전체 너비를 구해서 ul의 너비를 지정하는 함수
// function updateWidth() {
//   let currentSlides = document.querySelectorAll(".container1 .upcomingPoster");
//   let newSlideCount = currentSlides.length;

//   let newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + "px";
//   slides.style.width = newWidth;
// }

// //초기 위치 잡는 함수
// function setinit() {
//   // 왼쪽으로 움직일거니까 ( - )붙임
//   // 이동할 변수
//   let TranslateValue = -(slideWidth + slideMargin) * slideCount;
//   slides.style.transform = "translateX(" + TranslateValue + "px)";
// }

// nextBtn.addEventListener("click", function () {
//   // 지금 보고있는 슬라이드 수 +1 로 이동
//   moveSlide(currentIdx + 1);
//   // console.log("인덱스 => " + currentIdx);
// });
// prevBtn.addEventListener("click", function () {
//   // 지금 보고있는 슬라이드 수 -1 로 이동
//   moveSlide(currentIdx - 1);
// });

// // 숫자가 넘어와야 함수가 작동하도록
// // next 누를수록 왼쪽으로 translate left 값이 거리만큼 이동해야함
// // 전체가 슬라이드 너비+여백만큼 이동해야함
// function moveSlide(num) {
//   // 원래는 0이었는데 사용자가 이동하면 index가 1로 바뀌어있어야 함
//   slides.style.left = -num * (slideWidth + slideMargin) + "px";
//   //이동한 다음에는 currentIdx를 반드시 슬라이드가 최종적으로 보고있는 num 숫자만큼 바껴있어야 함.
//   currentIdx = num;
//   console.log(currentIdx, slideCount);
//   // 마지막이면 1번으로 다시 돌리기

//   if (currentIdx == slideCount || currentIdx == -slideCount) {
//     setTimeout(function () {
//       slides.classList.remove("animated");
//       slides.style.left = "0px";
//       currentIdx = 0;
//     }, 500);
//     console.log("확인"); // 이게 안 뜸 if문 작동 안 하는 것

//     setTimeout(function () {
//       slides.classList.add("animated");
//     }, 600);
//   }
// }
