window.onload = async function () {
  loadComments();
  document.getElementById("commnetWrite").style.display = "none";
  await boxToggle();
};

// 로컬 스토리지 코멘트
const commentBtn = document.getElementById("commnetBtn");
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
    : addComment(user, comment, password, star);

  function addComment(user, comment, password, star) {
    // 댓글 객체 생성
    let newComment = {
      user: user,
      comment: comment,
      password: password,
      star: star,
      time: new Date().toLocaleString()
    };

    let comments = getComments();

    // 새로운 댓글 추가
    comments.push(newComment);

    // 변경된 댓글 배열 저장
    localStorage.setItem("comments", JSON.stringify(comments));

    // 댓글 목록 다시 불러오기
    loadComments();

    // 폼 초기화
    document.querySelectorAll("input").forEach((e) => {
      e.value = "";
    });
    document.getElementById("star").value = "별점";
  }
});

function getComments() {
  let comments = localStorage.getItem("comments");

  if (comments) {
    return JSON.parse(comments);
  } else {
    return [];
  }
}

function loadComments() {
  let commentList = document.getElementById("commentBody");
  commentList.innerHTML = "";

  let comments = getComments();

  for (let i = 0; i < comments.length; i++) {
    let comment = comments[i];

    let listItem = document.createElement("div");
    listItem.className = "commentBox";
    listItem.innerHTML = `
      <p class="commentStar" id="commentStar">${comment.star}</p>
      <p class="commentText" id="commentText">${comment.comment}</p>
    <div>
      <p class="commentUser" id="commentUser">${comment.user}</p>
      <p class="commentTime" id="commentTime">${comment.time}</p>
    </div>
      <button class="edit" id="commentEdit">수정</button>
      <button class="del" id="commentDel">삭제</button>
    `;

    commentList.appendChild(listItem);
  }
}

async function boxToggle() {
  const btn = document.getElementById("writeBtn");
  const box = document.getElementById("commnetWrite");

  btn.addEventListener("click", () => {
    box.style.display === "none" ? (box.style.display = "flex") : (box.style.display = "none");
  });
}
