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

const titleLogo = document.querySelector(".titleLogo");
titleLogo.addEventListener("click", function () {
  window.location.href = "index.html";
});
