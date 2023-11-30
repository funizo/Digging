import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import "./board.css";

function Board() {
  return (
    <div>
      <Toolbar />
      <h1>게시판</h1>
      <table className="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1</th>
            <th>임시제목</th>
            <th>김세준</th>
            <th>1</th>
            <th>2023-11-23</th>
          </tr>
        </tbody>
      </table>
      <Footer />
    </div>
  );
}

export default Board;
