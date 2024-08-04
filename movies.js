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

// 개봉 예정작 카드 생성 부분
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

// 현재 상영작 카드 생성 부분
fetch(nowUrl, options)
  .then((response2) => response2.json())
  .then((data2) => {
    const Container2 = document.getElementById("nowContainer");
    data2.results.forEach((movie2) => {
      const img2 = document.createElement("img");
      img2.className = "nowPoster";
      img2.src = `https://image.tmdb.org/t/p/w500${movie2.poster_path}`;
      img2.alt = movie2.title;
      img2.id = movie2.id;
      img2.addEventListener("click", () => alert(`<${movie2.title}>의 ID는 ${movie2.id}입니다.`));
      Container2.appendChild(img2);
    });

      // 슬라이드에 쓸 변수들
      let slides2 = document.querySelector(".nowList");
      let slide2 = document.querySelectorAll(".nowList .nowPoster");
      let currentIdx2 = 0;
      let slideCount2 = slide2.length;
      let slideWidth2 = 300;
      let slideMargin2 = 30;
      let prevBtn2 = document.querySelector(".nowPrev");
      let nextBtn2 = document.querySelector(".nowNext");
  
      console.log("수정중2 => ", slideCount2);
  
      // 버튼 Event
      nextBtn2.addEventListener("click", function () {
        moveSlide2(currentIdx2 + 5);
      });
      prevBtn2.addEventListener("click", function () {
        moveSlide2(currentIdx2 - 5);
      });
  
      function moveSlide2(num2) {
        slides2.style.left = -num2 * (slideWidth2 + slideMargin2) + "px";
        currentIdx2 = num2;
        console.log(currentIdx2, slideCount2);
  
        // 마지막 도달 시 첫 번째로 돌아가기
        if (currentIdx2 === slideCount2 || currentIdx2 === -slideCount2) {
          setTimeout(function () {
            slides2.classList.remove("animated");
            slides2.style.left = "0px";
            currentIdx2 = 0;
          }, 500);
          console.log("끝이니까 처음으로 돌아가자!2");
  
          setTimeout(function () {
            slides2.classList.add("animated");
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
