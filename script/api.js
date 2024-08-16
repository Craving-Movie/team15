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

// 영화 목록을 불러오는 함수
function fetchMovies(url, containerId, box) {
  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById(containerId);
      data.results.forEach((movie) => {
        const img = document.createElement("img");
        img.className = "moviePoster";
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        img.id = movie.id;

        // 영화 정보 표시할 div 생성
        const infoDiv = document.createElement("div");
        infoDiv.className = "wrap"; // div 클래스에 이름 부여
        infoDiv.style.visibility = "hidden"; // 초기 상태를 숨김으로 설정
        infoDiv.style.opacity = "0"; // 초기 상태를 투명으로 설정
        infoDiv.style.transition = "opacity 0.3s"; // 투명도가 변할 때 부드러운 전환 효과

        // 영화 정보가 표시될 HTML구조 설정
        infoDiv.innerHTML = `
            <h3 class="title">${movie.title}</h3>
            <div class="summary">${movie.overview}</div>
            <div class="score">
            <div class="preview">
                <p class="tit">⭐ 평점 <span class="number">${movie.vote_average.toFixed(
                  2
                )}<span class="ir">점</span></span></p>
            </div>
            </div>
        `;

        // 이미지와 정보를 포함하는 div 생성
        const wrapper = document.createElement("div");
        wrapper.className = "movieWrapper"; // wrapper에 클래스 이름 부여
        wrapper.id = movie.title; // wrapper의 id값 부여
        wrapper.appendChild(img); // wrapper에 이미지 요소 추가
        wrapper.appendChild(infoDiv); // wrapper에 정보 div 요소 추가

        // wrapper에 마우스 들어갈 때 이벤트 처리
        wrapper.addEventListener("mouseenter", () => {
          infoDiv.style.visibility = "visible"; // 정보 div의 가시성을 표시로 설정
          infoDiv.style.opacity = "1"; // 정보 div의 투명도를 1로 설정하여 보이게 함
          wrapper.style.transform = "scale(1.2)"; // wrapper의 크기를 확대
          wrapper.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)"; // wrapper에 그림자 효과 추가
        });

        // wrapper에서 마우스가 나갈 때 이벤트 처리
        wrapper.addEventListener("mouseleave", () => {
          infoDiv.style.visibility = "hidden"; // 정보 div의 가시성을 숨김으로 설정
          infoDiv.style.opacity = "0"; // 정보 div의 투명도를 0으로 설정하여 숨김
          wrapper.style.transform = "scale(1)"; // wrapper의 크기를 원래대로 복원
          wrapper.style.boxShadow = "none"; // wrapper의 그림자 효과 제거
        });

        wrapper.addEventListener("click", () => {
          // 클릭 시 상세 페이지로 이동
          window.location.href = `detailpage.html?id=${movie.id}`;
        });
        container.appendChild(wrapper);
      });
      slider(containerId, box);
    })
    .catch((error) => console.error("Error fetching movies:", error));
}

// 영화 상세 정보를 가져오는 함수
async function fetchMovieDetails(movieId) {
  try {
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`;
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    console.log("상세정보 data", data);
    return {
      cast: data.credits.cast.slice(0, 8),
      releaseDate: data.release_date,
      runtime: data.runtime,
      age: data.adult ? "18+" : "All",
      ...data
    };
  } catch (error) {
    console.error("영화 상세 정보를 가져오는 중 에러 발생:", error);
  }
}

// 슬라이드 이동 범위 = 한 화면에 들어가는 카드 갯수 * 카드 넓이
// 카드 넓이 = 285 (마진값 포함)
// 디스플레이 폭 = 100vw - 80px (왼쪽 패딩값 제외) / 카드 넓이 265 = 몫 (한 화면에 들어가는 카드 갯수) 소숫점은 버리기
// 카드 갯수 20개 / 몫 (한 화면 카드 갯수) = 몫2 (필요한 클릭 횟수) 나머지2 (남는 포스터 갯수)
// 나머지가 있을 경우 - 클릭 횟수 = 몫2 + 1 나머지2 x 285 이동하면 끝에 도달 / 몫 + 2 일 경우 처음으로 초기화
// 나머지가 없을 경우 - 클릭 횟수 = 몫 + 1 일 때 처음으로 초기화

// 슬라이드에 쓸 변수들
function slider(containerId, box) {
  function getWidth() {
    const vwInPx = (100 / 100) * window.innerWidth; // 100vw 픽셀로 변환
    const slideWidth = vwInPx - 140; //140px 빼기
    return slideWidth;
  }

  let slides = document.getElementById(`${containerId}`);
  let slide = document.querySelectorAll(`#${containerId} .moviePoster`);
  let NextBtn = document.querySelector(`#${box} .slideBtn .next`);
  let PrevBtn = document.querySelector(`#${box} .slideBtn .prev`);
  // 카드 한 개 넓이
  let cardWidth = 285;
  // 디스플레이 넓이
  let display = getWidth();
  // 한 화면에 들어가는 카드 갯수
  let onedisCard = display / cardWidth;
  // 총 카드 갯수
  let totalCard = slide.length;
  // 클릭 횟수 계산
  let clickSlide = Math.floor(totalCard / onedisCard);
  let spareCard = totalCard % onedisCard;
  // 카드 남는지 안 남는지 계산
  let totalClick = spareCard === 0 ? clickSlide : clickSlide + 1;
  // 나머지 카드 넓이
  let spareCardWidth = spareCard * cardWidth;
  // 슬라이드 이동 넓이
  let moveWidth = onedisCard * cardWidth;

  console.log(`디스플레이 넓이: ${display}px`);
  console.log(`한 화면에 들어가는 카드 갯수: ${onedisCard}`);
  console.log(`총 필요한 클릭 횟수: ${totalClick}`);
  console.log(`나머지 카드: ${spareCard}`);
  console.log(`슬라이드 이동 넓이: ${moveWidth}`);
  console.log(`마지막 이동 넓이: ${spareCardWidth}`);

  let clickCount = 0;

  NextBtn.addEventListener("click", function () {
    moveSlide(clickCount + 1);
  });
  PrevBtn.addEventListener("click", function () {
    moveSlide(clickCount - 1);
  });

  function moveSlide(click) {
    if (spareCard == 0) {
      slides.style.left = -1 * click * moveWidth + "px";
      clickCount = click;
    } else {
      slides.style.left = -1 * click * moveWidth + "px";
      clickCount = click;
      if (click === totalClick - 1) {
        slides.style.left = -1 * (click - 1) * moveWidth - spareCardWidth + "px";
      }
    }

    if (clickCount === totalClick || clickCount < 0) {
      slides.style.left = 0;
      clickCount = 0;
    }
    console.log(slides.style.left, clickCount);
  }
}
// let Slides = document.getElementById(`${containerId}`);
// let Slide = document.querySelectorAll(`#${containerId} .moviePoster`);
// let CurrentIdx = 0;
// let SlideCount = Slide.length;
// let SlideWidth = 200;
// let SlideMargin = 30;
// let PrevBtn = document.querySelector(`#${box} .slideBtn .prev`);
// let NextBtn = document.querySelector(`#${box} .slideBtn .next`);}

//   console.log("수정중 => ", SlideCount);

//   // 버튼 Event
//   NextBtn.addEventListener("click", function () {
//     console.log(CurrentIdx);
//     moveSlide(CurrentIdx + 5);
//   });
//   PrevBtn.addEventListener("click", function () {
//     moveSlide(CurrentIdx - 5);
//   });

//   function moveSlide(num) {
//     const yposition = -num * (SlideWidth + SlideMargin);
//     Slides.style.left = -num * (SlideWidth + SlideMargin) + "px";
//     CurrentIdx = num;
//     console.log(CurrentIdx, SlideCount);

//     if (yposition <= -4600) {
//       console.log("못지나간다");
//     }

//     // 마지막 도달 시 첫 번째로 돌아가기
//     if (CurrentIdx > SlideCount || CurrentIdx < 0) {
//       // Slides.classList.remove("animated");
//       Slides.style.left = "0px";
//       CurrentIdx = 0;

//       console.log("끝이니까 처음으로 돌아가자!");

//       // Slides.classList.add("animated");
//     }
//   }
// }

export { fetchMovies, fetchMovieDetails, upcomingUrl, popularUrl, topUrl, nowUrl };
