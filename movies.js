// 개인 API 설정
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer 5a3488ac1342b3f9bcf2ad06969cd295"
  }
};

const API_KEY = "5a3488ac1342b3f9bcf2ad06969cd295";
const LANGUAGE = 'ko-KR';
const REGION = 'KR';

const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=1`;
const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=1`;
const topUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=1`;
const nowUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&page=1`;

// 검색
// 윈도우가 준비됐을 때 해당 함수 실행
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
            <p class="tit">⭐ 평점 <span class="number">${movie.vote_average.toFixed(2)}<span class="ir">점</span></span></p>
          </div>
        </div>
      `;

      // 추가한 부분: 이미지와 정보를 포함하는 컨테이너 생성
      const wrapper = document.createElement("div");
      wrapper.className = "movieWrapper";
      wrapper.appendChild(img);
      wrapper.appendChild(infoDiv);

      // 마우스 오버 시 정보 표시
      wrapper.addEventListener("mouseenter", () => {
        infoDiv.style.visibility = 'visible';
        infoDiv.style.opacity = '1';
        wrapper.style.transform = 'scale(1.2)';
        wrapper.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
      });

      // 마우스 아웃 시 정보 숨김
      wrapper.addEventListener("mouseleave", () => {
        infoDiv.style.visibility = 'hidden';
        infoDiv.style.opacity = '0';
        wrapper.style.transform = 'scale(1)';
        wrapper.style.boxShadow = 'none';
      });

      // 추가한 부분: 마우스 오버 시 정보 표시
      // wrapper.addEventListener("mouseenter", () => {
      //   // infoDiv.style.display = 'block';
      //   infoDiv.style.visibility = 'visible';
      //   infoDiv.style.opacity = '1';
      // });

      // // 추가한 부분: 마우스 아웃 시 정보 숨김
      // wrapper.addEventListener("mouseleave", () => {
      //   // infoDiv.style.display = "none";
      //   infoDiv.style.visibility = "hidden";
      //   infoDiv.style.opacity = '0';
      // });

      // // 추가한 부분: 마우스 오버될 시 컨테이너 내의 각 카드에 이벤트 할당
      // const movieCards = document.querySelectorAll(".movieWrapper");
      // movieCards.forEach((card) => {
      //   card.addEventListener("mouseenter", () => {
      //     card.style.transform = 'scale(1.2)';
      //     card.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
      //   });

      //   card.addEventListener("mouseleave", () => {
      //     card.style.transform = 'scale(1)';
      //     card.style.boxShadow = 'none';
      //   });
      // });
      
      img.addEventListener("click", () => alert(`<${movie.title}>의 ID는 ${movie.id}입니다.`));

      Container.appendChild(wrapper);
    });
  })
  .catch((err) => console.error(err));

// 현재 상영작 카드 생성 부분
fetch(nowUrl, options)
  .then((response) => response.json())
  .then((data) => {
    const Container = document.getElementById("nowContainer");
    data.results.forEach((movie) => {
      const img = document.createElement("img");
      img.className = "moviePoster";
      img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      img.alt = movie.title;
      img.id = movie.id;
      
      // 추가한 부분: 영화 정보 표시를 위한 div생성
      const infoDiv = document.createElement("div");
      infoDiv.className = "wrap";
      infoDiv.style.visibility = "hidden";
      infoDiv.style.opacity = "0";
      infoDiv.style.transition = "opacity 0.3s";    

      // 추가한 부분: 영화카드 마우스 오버시 나오는 영화 디테일
      infoDiv.innerHTML = `
        <h3 class="title">${movie.title}</h3>
        <div class="summary">${movie.overview}</div>
        <div class="score">
          <div class="preview">
            <p class="tit">⭐ 평점 <span class="number">${movie.vote_average.toFixed(2)}<span class="ir">점</span></span></p>
          </div>
        </div>
      `;

      // 추가한 부분: 이미지와 정보를 포함하는 컨테이너 생성
      const wrapper = document.createElement("div");
      wrapper.className = "movieWrapper";
      wrapper.appendChild(img);
      wrapper.appendChild(infoDiv);

      //  추가한 부분: 마우스 오버 시 정보 표시
      wrapper.addEventListener("mouseenter", () => {
        infoDiv.style.visibility = 'visible';
        infoDiv.style.opacity = '1';
        wrapper.style.transform = 'scale(1.2)';
        wrapper.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
      });

      //  추가한 부분: 마우스 아웃 시 정보 숨김
      wrapper.addEventListener("mouseleave", () => {
        infoDiv.style.visibility = 'hidden';
        infoDiv.style.opacity = '0';
        wrapper.style.transform = 'scale(1)';
        wrapper.style.boxShadow = 'none';
      });

      img.addEventListener("click", () => alert(`<${movie.title}>의 ID는 ${movie.id}입니다.`));
      Container.appendChild(wrapper);
    });
  })
  .catch((err) => console.error(err));

// 추천 영화 카드 생성 부분
fetch(topUrl, options)
  .then((response) => response.json())
  .then((data) => {
    const Container = document.getElementById("topRatedContainer");
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

      // 추가한 부분: 영화카드 마우스 오버시 나오는 영화 디테일
      infoDiv.innerHTML = `
        <h3 class="title">${movie.title}</h3>
        <div class="summary">${movie.overview}</div>
        <div class="score">
          <div class="preview">
            <p class="tit">⭐ 평점 <span class="number">${movie.vote_average.toFixed(2)}<span class="ir">점</span></span></p>
          </div>
        </div>
      `;

      // 추가한 부분: 이미지와 정보를 포함하는 컨테이너 생성
      const wrapper = document.createElement("div");
      wrapper.className = "movieWrapper";
      wrapper.appendChild(img);
      wrapper.appendChild(infoDiv);

      //  추가한 부분: 마우스 오버 시 정보 표시
      wrapper.addEventListener("mouseenter", () => {
        infoDiv.style.visibility = 'visible';
        infoDiv.style.opacity = '1';
        wrapper.style.transform = 'scale(1.2)';
        wrapper.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
      });

      //  추가한 부분: 마우스 아웃 시 정보 숨김
      wrapper.addEventListener("mouseleave", () => {
        infoDiv.style.visibility = 'hidden';
        infoDiv.style.opacity = '0';
        wrapper.style.transform = 'scale(1)';
        wrapper.style.boxShadow = 'none';
      });
      
      img.addEventListener("click", () => alert(`<${movie.title}>의 ID는 ${movie.id}입니다.`));
      Container.appendChild(wrapper);
    });
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
