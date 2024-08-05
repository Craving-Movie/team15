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
        img.addEventListener("click", () => {
          // 클릭 시 상세 페이지로 이동
          window.location.href = `detailpage.html?id=${movie.id}`;
        });
        container.appendChild(img);
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
  let Slides = document.getElementById(`${containerId}`);
  let Slide = document.querySelectorAll(`#${containerId} .moviePoster`);
  let CurrentIdx = 0;
  let SlideCount = Slide.length;
  let SlideWidth = 200;
  let SlideMargin = 30;
  let PrevBtn = document.querySelector(`#${box} .slideBtn .prev`);
  let NextBtn = document.querySelector(`#${box} .slideBtn .next`);

  console.log("수정중 => ", SlideCount);

  // 버튼 Event
  NextBtn.addEventListener("click", function () {
    console.log(CurrentIdx);
    moveSlide(CurrentIdx + 5);
  });
  PrevBtn.addEventListener("click", function () {
    moveSlide(CurrentIdx - 5);
  });

  function moveSlide(num) {
    Slides.style.left = -num * (SlideWidth + SlideMargin) + "px";
    CurrentIdx = num;
    console.log(CurrentIdx, SlideCount);

    // 마지막 도달 시 첫 번째로 돌아가기
    if (CurrentIdx > SlideCount || CurrentIdx < 0) {
      // Slides.classList.remove("animated");
      Slides.style.left = "0px";
      CurrentIdx = 0;

      console.log("끝이니까 처음으로 돌아가자!");

      // Slides.classList.add("animated");
    }
  }
}

export { fetchMovies, fetchMovieDetails, upcomingUrl, popularUrl, topUrl, nowUrl };
