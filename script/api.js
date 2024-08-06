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

        // 추가한 부분: 영화 정보 표시를 위한 div생성
        const infoDiv = document.createElement("div");
        infoDiv.className = "wrap";
        infoDiv.style.visibility = "hidden"; // 초기 상태를 숨김으로 설정
        infoDiv.style.opacity = "0"; // 초기 상태를 투명으로 설정
        infoDiv.style.transition = "opacity 0.3s"; // 부드러운 전환 효과

        // 추가한 부분: 영화카드 마우스 오버시 나오는 영화 디테일
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

        // 추가한 부분: 이미지와 정보를 포함하는 컨테이너 생성
        const wrapper = document.createElement("div");
        wrapper.className = "movieWrapper";
        wrapper.id = movie.title;
        wrapper.appendChild(img);
        wrapper.appendChild(infoDiv);

        // 추가한 부분: 마우스 오버 시 정보 표시
        wrapper.addEventListener("mouseenter", () => {
          infoDiv.style.visibility = "visible";
          infoDiv.style.opacity = "1";
          wrapper.style.transform = "scale(1.2)";
          wrapper.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
        });

        // 추가한 부분: 마우스 아웃 시 정보 숨김
        wrapper.addEventListener("mouseleave", () => {
          infoDiv.style.visibility = "hidden";
          infoDiv.style.opacity = "0";
          wrapper.style.transform = "scale(1)";
          wrapper.style.boxShadow = "none";
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

// 슬라이드에 쓸 변수들
function slider(containerId, box) {
  let slides = document.getElementById(`${containerId}`);
  let slide = document.querySelectorAll(`#${containerId} .movieWrapper`);
  let currentIdx = 0;
  let slideCount = slide.length;
  let slideWidth = 200;
  let slideMargin = 30;
  let prevBtn = document.querySelector(`#${box} .slideBtn .prev`);
  let nextBtn = document.querySelector(`#${box} .slideBtn .next`);

  console.log("수정중 => ", slideCount);

  // 슬라이드 복제
  makeClone();
  function makeClone() {
    for (let i = 0; i < slideCount; i++) {
      let cloneSlide = slide[i].cloneNode(true);
      cloneSlide.classList.add("clone");
      slides.appendChild(cloneSlide);
    }
    // index 번호 4번은 슬라이드 05임
    // slideCount -1 초기값
    for (let i = slideCount - 1; i >= 0; i--) {
      let cloneSlide = slide[i].cloneNode(true);
      cloneSlide.classList.add("clone");
      // 원래 있던 요소의 앞에 추가
      // slides.prepend(cloneSlide);
    }
    updateWidth();
  }
  
  // 전체 너비를 구해서 포스터의 너비를 지정하는 함수
  function updateWidth() {
    let currentSlides = document.querySelectorAll(`${containerId} .movieWrapper`);
    let newSlideCount = currentSlides.length;
    let newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + "px";
    slides.style.width = newWidth;
  }

  // 버튼 Event
  nextBtn.addEventListener("click", function () {
    console.log(currentIdx);
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
    if (currentIdx > slideCount || currentIdx < 0) {
      slides.classList.remove("animated");
      slides.style.left = "0px";
      currentIdx = 0;

      console.log("끝이니까 처음으로 돌아가자!");

      slides.classList.add("animated");
    }
  }
}

export { fetchMovies, fetchMovieDetails, upcomingUrl, popularUrl, topUrl, nowUrl };
