# 🎥당무땡(당신은 지금 무-비가 땡긴다)

    바닐라 자바스크립트로 구성한 영화 검색 사이트
    - 팀 노션 : https://www.notion.so/teamsparta/15-_15-cf7770cd26ef4373bcf6aa4011492758#ffb9976524e1422b80c85bc5f9d7e567

<br/>

### 프로젝트 소개

TMDB openAPI를 이용하여 영화 정보 및 목록 사이트를 밝고 귀여운 색감으로 구성하였습니다.

카테고리별로 슬라이드 버튼을 눌러 영화 리스트를 확인할 수 있습니다.

카드로 나열된 영화 리스트를 클릭하거나 영화 제목을 검색하여 상세 페이지 내용을 확인할 수 있습니다.

상세 카드 하단에 작성자/비밀번호/내용/별점을 작성하여 리뷰를 남길 수 있고, 리뷰 내용을 수정/삭제할 수 있습니다.

<br/>

### 프로젝트 기간

- 24.07.31(수) - 24.08.07(수) (8일)

  <br/>

### 맴버구성

- 정수희(팀장) : 메인 페이지 레이아웃, 상세 페이지 내부 리뷰 구현 (비밀번호, 수정, 삭제), js 모듈화
- 유재희 : 영화 id별 API 요청, 상세 페이지 연결 및 구성
- 장세희 : API 요청 및 메인 페이지 카드 목록 생성, 카드 마우스 오버시 상세정보 나타내기
- 권다정 : 메인 페이지 영화 목록 슬라이드 기능 구현, 적용

<br/>

### 와이어 프레임
[Figma 보러 가기!](https://www.figma.com/design/tEuWUymsHYKba4BljHZ5vj/15%EB%A8%B9%EC%9E%90?node-id=0-1&t=8aNHIGMWDyyyWwWi-1)


<br/>

### 프로젝트 화면 구성

#### 메인페이지
  ![](https://velog.velcdn.com/images/bsjaehee94/post/eed9ee7f-089b-49a7-aa86-f687365a8cf1/image.png)
<br/>

#### 상세페이지
  ![](https://velog.velcdn.com/images/bsjaehee94/post/7e10866a-0415-4697-b975-dfcfb4d13391/image.png)
<br/>
  
#### 한줄평(CRUD)
  ![](https://velog.velcdn.com/images/bsjaehee94/post/8cfba2a9-2315-411e-88e8-a2ea18c19af2/image.png)

<br/>

### 트러블슈팅

#### 1. 슬라이드 오류
  - 카드가 모여있는 긴 슬라이드 박스의 left값을 조정하여 이동하는 형식, 사용자의 디바이스에 따라 마지막 페이지 여백이 상이함
  - 개발자 도구 - 소스 / 브레이크 포인트를 사용하여 디버깅 (페이지 실행 중, 기능이 작동하지 않을 때 문제지점을 찾기 좋음!!!)
#### 2. 카드 Hover 효과 스크립트 충돌
  - 기존 포스터만 있을 땐 깔끔하게 잘 되던 Hover 효과가 줄거리 div를 추가해 스크립트를 통해 구현하니 어그러지는 현상 발생
  - class, id 값 통일하여 어그러진 css 수정, div 구조에 맞게 스크립트 변경, 변수명 재설정
#### 3. 상세 페이지 연결, 검색 기능 초기화
  - 2번 문제 해결 중 변경한 div 구조, class와 id명 변경으로 인해 검색 기능이 작동되지 않고 상세 페이지 이동이 안 됨
  - div 구조에 맞춰 스크립트 재설정하여 해결
#### 4. 기타 등등.. 우리를 덮친 고난과 시련들...
  - 수만가지 git 오류 / pull, push 중 가장 많이 발생. -> 세희님의 hover 스크립트가 1회 날아감.. 정말 죄송합니다
  - 비동기 숙련도 이슈 / 자꾸 온갖 함수가 돔 로드 전에 실행되어 오류 발생. -> 검색, 슬라이드, 상세페이지, 카드 붙여넣기, 댓글 레퍼런스 오류 안 본 기능이 없을 정도

<br/>

### 개발 환경

- Vanilla javascript, HTML5, CSS3
- Database : Local Storage
- environment : Visual Studio Code, git, github
- communication : figma, slack, notion, zep
