import { fetchMovieDetails } from "./api.js";

window.onload = async function () {
  try {
    // URL 쿼리파라미터에서 영화 ID를 가져옴
    const urlParameter = new URLSearchParams(window.location.search);
    const selectedMovieId = urlParameter.get("id");

    // 카드를 선택하면 상세 정보를 가져와서 표시
    if (selectedMovieId) {
      const movieDetails = await fetchMovieDetails(selectedMovieId);
      printDetail(movieDetails);
    }
  } catch (error) {
    console.error("에러 발생", error);
  }
};

// 상세 페이지에 데이터를 프린트하는 함수
function printDetail(movieDetails) {
  const detaillWrap = document.querySelector(".detaillWrap");
  const actorList = movieDetails.cast
    .filter(function (actor) {
      return actor.profile_path !== null;
    })
    .map(
      (actor) => `
      <li>
        <img class="actorImg" src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name} 사진" />
        <div class="actorInfo">
          <p class="actorName">${actor.name}</p>
          <p class="actorCharacter">${actor.character.replaceAll("/", "역<br>")} 역</p>
        </div>
      </li>
    `
    )
    .join(""); // 배열의 각 요소를 문자열로 결합

  // 상세 페이지 내용 생성
  const temp_html = `
    <div class="posterDiv">
      <img id="item" class="posterImg" src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" alt="${
    movieDetails.title
  } 포스터" />
      <div class="movieInfo">
      <div class="detailTitle">${movieDetails.title}</div>
      <div class="minText">
      <p class="detailRelease">개봉일 : ${movieDetails.releaseDate}</p>
      <p class="detailRuntime">&nbsp&nbsp | &nbsp&nbsp 평점: ${movieDetails.vote_average}</p>
      </div>
      <div class="minText">
      <p>장르 :${movieDetails.genres.map((e) => "&nbsp" + e.name)}</p>
      <p class="detailRuntime">&nbsp&nbsp | &nbsp&nbsp 상영 시간 : ${movieDetails.runtime}분</p>
      <p class="detailAge">&nbsp&nbsp | &nbsp&nbsp 연령 제한 : ${movieDetails.age}</p>
      </div>
      <p class="detailOverview"><span>줄거리</span><br>
      ${movieDetails.overview}</p>
      </div>
    </div>
    <div class="actorTitle">
    출연 배우
    </div>
    <ul class="actorContainer">
      ${actorList}
    </ul>
  `;

  detaillWrap.innerHTML = temp_html;
}

const titleLogo = document.querySelector(".titleLogo");
titleLogo.addEventListener("click", function () {
  window.location.href = "index.html";
});
