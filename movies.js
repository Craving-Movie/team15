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

window.onload = async function () {
  try {
    // baseData 함수를 실행시켜 영화 기본 정보 로드
    await baseData();

    // URL 쿼리파라미터에서 영화 ID를 가져옴
    const urlParameter = new URLSearchParams(window.location.search);
    const selectedMovieId = urlParameter.get("id");
    // 카드를 선택하면 상세 정보를 가져와서 표시
    if (selectedMovieId) {
      const movieDetails = await fetchMovieDetails(selectedMovieId);
      printDetail(movieDetails);
    }
    // 검색
    // 윈도우가 준비됐을 때 해당 함수 실행
    document.getElementById("search-button").addEventListener("click", () => {
      const query = document.getElementById("search-input").value.toLowerCase();
      const movieCards = document.querySelectorAll(".moviePoster");
      let found = false;
      if (query === "") {
        alert("검색어를 입력하세요.");
        return;
      }
      movieCards.forEach((card) => {
        const posterTitle = card.alt.toLowerCase();
        // console.log(posterTitle);
        const posterId = card.id;
        if (posterTitle.includes(query)) {
          window.location.href = `index2.html?id=${posterId}`;
          found = true;
        }
      });

      if (!found) {
        alert(`<${query}>에 대한 검색 결과가 없습니다.`);
      }
    });
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

// 카드 생성 함수
function fetchMovies(url, containerId) {
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
          alert(`<${movie.title}>의 ID는 ${movie.id}입니다.`);
          // 클릭 시 상세 페이지로 이동
          window.location.href = `index2.html?id=${movie.id}`;
        });
        container.appendChild(img);
      });
    })
    .catch((error) => console.error("Error fetching movies:", error));
}
// top 버튼
document.getElementById("top-btn").addEventListener("click", function () {
  var body = document.getElementsByTagName("body")[0];
  //창의 스크롤을 본문 최상단으로 부드럽게 이동시킵니다.
  window.scroll({
    behavior: "smooth",
    top: body.offsetTop
  });
});

// base-url에서 영화 기본 데이터 받아오기
function baseData() {
  Promise.all([
    fetchMovies(upcomingUrl, "upcomingContainer"),
    fetchMovies(nowUrl, "nowContainer")
    // fetchMovies(topUrl, "topContainer"),
    // fetchMovies(popularUrl, "popularContainer")
  ])
    .then(() => {
      console.log("영화 title,overview...가 성공적으로 로드되었습니다.");
    })
    .catch((error) => {
      console.error("영화 title,overview... 로드 중 오류 발생:", error);
    });
}

// 상세 정보를 가져오는 함수
async function fetchMovieDetails(movieId) {
  try {
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`;
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    console.log("상세정보 data", data);
    //data가 객체기 때문에 별도의 가공 없이 key,value값 반환
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

// 상세 페이지에 데이터를 프린트하는 함수
function printDetail(movieDetails) {
  const detaillWrap = document.querySelector(".detaillWrap");
  const actorList = movieDetails.cast
    .map((actor) => {
      let profileImage;
      if (actor.profile_path) {
        profileImage = `https://image.tmdb.org/t/p/w500${actor.profile_path}`;
      } else {
        if (actor.gender === 0) {
          profileImage = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg`;
        } else {
          profileImage = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-36-user-female-grey-d9222f16ec16a33ed5e2c9bbdca07a4c48db14008bbebbabced8f8ed1fa2ad59.svg`;
        }
      }

      return `
    <li>
      <img class="actorImg" src="${profileImage}" alt="${actor.name} 사진" />
      <div class="actorInfo">
        <p class="actorName">${actor.name}</p>
        <p class="actorCharacter">역할: ${actor.character}</p>
      </div>
    </li>
  `;
    })
    .join(""); // 배열의 각 요소를 문자열로 결합

  // 상세 페이지 내용 생성
  const temp_html = `
  <div class="posterDiv">
    <img id="item" class="posterImg" src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" alt="${movieDetails.title} 포스터" />
    <h3 id="item" class="detailTitle">${movieDetails.title}</h3>
    <h3 id="item" class="detailRate">평점: ${movieDetails.vote_average}</h3>
    <p id="item" class="detailRelease">개봉일 : ${movieDetails.releaseDate}</p>
    <p id="item" class="detailRuntime">| 상영 시간: ${movieDetails.runtime}분</p>
    <p id="item" class="detailAge"> | 연령 제한: ${movieDetails.age}</p>
    <p id="item" class="detailOverview">줄거리: ${movieDetails.overview}</p>
  </div>
  <ul class="actorContainer">
    ${actorList}
  </ul>
`;

  detaillWrap.innerHTML = temp_html;
}
