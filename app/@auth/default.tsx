// 모달이 활성 상태가 아닐 때 렌더링되지 않도록 한다.
// 병렬 라우트가 활성화되지 않게 하려면 default 파일을 생성.
// 링크를 눌렀을 때 병렬 라우트를 활성시켜야 되기 때문에 default 파일 작성
export default function Default() {
  return null;
}
