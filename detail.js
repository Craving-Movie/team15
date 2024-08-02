const apiKey2 = "7b671e594628c64f37e495f1464a68e5";
const baseUrl2 = "https://api.themoviedb.org/3";
let movieArray = [];

// 영화 ID를 가져오는 함수
async function fetchIds(urls) {
  try {
    const fetchPromises = urls.map(async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      let rows = data.results;
      rows.forEach((row) => {
        movieArray.push({
          cardTitle: row.title,
          cardOverview: row.overview,
          cardPoster_path: row.poster_path,
          cardVote_average: row.vote_average,
          cardId: row.id
        });
      });
    });

    // 모든 fetch 요청이 완료될 때까지 기다림
    await Promise.all(fetchPromises);

    // fetchIds 함수가 완료된 후 fetchMovieDetails 함수 호출
    await fetchMovieDetails(movieArray.map((movie) => movie.cardId));
  } catch (error) {
    console.error("detail페이지 위해 아이디를 가져오는 중 에러 발생:", error);
  }
}

async function fetchMovieDetails(ids) {
  try {
    // 각 ID에 대해 fetch 요청을 수행하는 배열을 생성
    const fetchPromises = ids.map(async (id) => {
      const url = `${baseUrl2}/movie/${id}?api_key=${apiKey2}&language=ko-KR&append_to_response=credits`;
      const response = await fetch(url);
      const data = await response.json();
      const cast = data.credits.cast.slice(0, 5); // 처음 5명의 캐스트 정보만 가져옴
      const releaseDate = data.release_date;
      const runTime = data.runtime;
      const detailAge = data.adult ? "18+" : "All";

      castActors = castActors.concat(cast); // 캐스트 정보를 castActors 배열에 추가
      releaseDates.push(releaseDate); // release date 추가
      runTimes.push(runTime); // runtime 추가
      detailAges.push(detailAge); // age 정보 추가
    });

    // 모든 fetch 요청이 완료될 때까지 기다림
    await Promise.all(fetchPromises);

    console.log("모든 캐스트 정보가 여기에:", castActors);
    console.log("모든 릴리즈 날짜가 여기에:", releaseDates);
    console.log("모든 런타임이 여기에:", runTimes);
    console.log("모든 나이 정보가 여기에:", detailAges);

    // 페이지에 따라 함수 호출
    if (document.querySelector(".detaillWrap")) {
      detailPage(); // 상세 페이지
    } else {
      returnPage(); // 목록 페이지
    }
  } catch (error) {
    console.error("영화 상세 정보를 가져오는 중 에러 발생:", error);
  }
}

// (목록 페이지)
function returnPage() {
  // 영화 ID를 URL 쿼리 파라미터로 전달하는 함수
  const urlParameter = function (movieid) {
    window.location.href = `index2.html?id=${movieid}`; // 영화 ID를 URL 쿼리 파라미터로 전달
  };
}

// 상세 페이지에 데이터를 표시하는 함수
async function detailPage() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const selectedMovieId = urlParams.get("id"); // URL에서 영화 ID 추출

  console.log(`선택된 영화 ID: ${selectedMovieId}`); // 디버깅 메시지 추가

  if (!selectedMovieId) {
    console.error("선택된 영화 ID가 없습니다.");
    return;
  }

  try {
    const apiUrl = `${baseUrl2}/movie/${selectedMovieId}?api_key=${apiKey2}&language=ko-KR&append_to_response=credits`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const cast = data.credits.cast.slice(0, 5);
    const releaseDate = data.release_date;
    const runTime = data.runtime;
    const detailAge = data.adult ? "18+" : "All";

    const detailBox = document.querySelector(".detaillWrap");
    let temp_html = `
        <div class="detailBox">
          <div class="poster">
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="포스터" />
          </div>
          <div class="detailText">
            <h3 class="detailTitle">${data.title}</h3>
            <h3 class="detailRate">평점: ${data.vote_average}</h3>
            <p class="detailRelease">개봉일: ${releaseDate}</p>
            <p class="detailRuntime">상영 시간: ${runTime}분</p>
            <p class="detailAge">연령 등급: ${detailAge}</p>
          </div>
          <div class="detailOverview">줄거리: ${data.overview}</div>
        </div>
        <ul class="actorContainer">
          ${cast
            .map(
              (actor) => `
            <li>
              <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="출연 배우 사진" />
              ${actor.name} (${actor.character})
            </li>
            `
            )
            .join("")}
        </ul>
      `;

    detailBox.innerHTML = temp_html;
    console.log(data.title); // console.log 문을 템플릿 리터럴 바깥으로 이동
  } catch (error) {
    console.error("영화 상세 정보를 가져오는 중 에러 발생:", error);
  }
}

// 페이지 로딩 시 함수 호출
if (document.querySelector(".detaillWrap")) {
  detailPage();
} else {
  returnPage();
}
