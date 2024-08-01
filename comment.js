window.onload = function () {
  loadComments();
};

// 로컬 스토리지 코멘트
const commentBtn = document.getElementById("commnetBtn");
commentBtn.addEventListener("click", () => {
  let user = document.getElementById("inputUser").value;
  let comment = document.getElementById("inputComment").value;
  let password = document.getElementById("inputPw").value;

  // 댓글 객체 생성
  let newComment = {
    user: user,
    comment: comment,
    password: password,
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
    <p class="commentText" id="commentText">${comment.comment}</p>
    <div>
    <p class="commentUser" id="commentUser">${comment.user}</p>
    <p class="commentTime" id="commentTime">${comment.time}</p>
    </div>
    `;

    commentList.appendChild(listItem);
  }
}
