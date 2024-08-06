document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("commnetWrite").style.display = "none";
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  loadComments(movieId);
  await boxToggle();
});

// 로컬 스토리지 코멘트
const commentBtn = document.getElementById("commnetBtn");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

commentBtn.addEventListener("click", () => {
  let user = document.getElementById("inputUser").value;
  let comment = document.getElementById("inputComment").value;
  let password = document.getElementById("inputPw").value;
  let star = document.getElementById("star").value;

  !user
    ? alert("닉네임을 입력해주세요!")
    : !comment
    ? alert("리뷰를 작성해주세요!")
    : !password
    ? alert("비밀번호를 입력해주세요!")
    : !star
    ? alert("별점을 선택해주세요!")
    : addComment(movieId, user, comment, password, star);

  function addComment(movieId, user, comment, password, star) {
    // 댓글 객체 생성
    let newComment = {
      user: user,
      comment: comment,
      password: password,
      star: star,
      time: new Date().toLocaleString()
    };

    let comments = getComments(movieId);

    // 새로운 댓글 추가
    comments.push(newComment);

    // 변경된 댓글 배열 저장
    localStorage.setItem(`${movieId}_comment`, JSON.stringify(comments));

    // 댓글 목록 다시 불러오기
    loadComments(movieId);

    // 폼 초기화
    document.querySelectorAll("input").forEach((e) => {
      e.value = "";
    });
    document.getElementById("star").value = "별점";
  }
});

function getComments(movieId) {
  let comments = localStorage.getItem(`${movieId}_comment`);

  if (comments) {
    return JSON.parse(comments);
  } else {
    return [];
  }
}

function loadComments(movieId) {
  let commentList = document.getElementById("commentBody");
  commentList.innerHTML = "";

  let comments = getComments(movieId);

  comments.forEach((comment) => {
    let listItem = document.createElement("div");
    listItem.className = "commentBox";
    listItem.innerHTML = `
      <p class="commentStar" id="commentStar">${comment.star}</p>
      <p class="commentText" id="commentText">${comment.comment}</p>
    <div>
      <p class="commentUser" id="commentUser">${comment.user}</p>
      <p class="commentTime" id="commentTime">${comment.time}</p>
    </div>
      <button class="edit" id="commentEdit" data-time="${comment.time}">수정</button>
      <button class="del" id="commentDel" data-time="${comment.time}">삭제</button>
    `;

    commentList.appendChild(listItem);
  });
  document.querySelectorAll("#commentEdit").forEach((button) => {
    button.addEventListener("click", editComment);
  });

  document.querySelectorAll("#commentDel").forEach((button) => {
    button.addEventListener("click", deleteComment);
  });
}

function editComment(event) {
  const editTime = event.target.getAttribute("data-time");
  let comments = getComments(movieId);
  const comment = comments.find((comment) => comment.time === editTime);

  if (comment) {
    const password = prompt("비밀번호 확인");
    if (password === comment.password) {
      const newComment = prompt("새로운 댓글 내용을 입력하세요", comment.comment);
      if (newComment) {
        comment.comment = newComment;
        localStorage.setItem(`${movieId}_comment`, JSON.stringify(comments));
        loadComments(movieId);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다");
    }
  }
}

function deleteComment(event) {
  const deleteTime = event.target.getAttribute("data-time");
  let comments = getComments(movieId);
  const commentIndex = comments.findIndex((comment) => comment.time === deleteTime);

  if (commentIndex !== -1) {
    const password = prompt("비밀번호 확인");
    if (password === comments[commentIndex].password) {
      comments.splice(commentIndex, 1);
      localStorage.setItem(`${movieId}_comment`, JSON.stringify(comments));
      loadComments(movieId);
    } else {
      alert("비밀번호가 일치하지 않습니다");
    }
  }
}

async function boxToggle() {
  const btn = document.getElementById("writeBtn");
  const box = document.getElementById("commnetWrite");

  btn.addEventListener("click", () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  });
}
