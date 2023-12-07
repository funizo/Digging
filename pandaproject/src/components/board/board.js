import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import "./board.css";

function Board() {
  const [boardData, setBoardData] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10; // 페이지당 보여줄 항목 수

  const handlePaging = async (pageNumber) => {
    try {
      const response = await fetch(
        `http://localhost:8080/board?page=${pageNumber}`
      );
      if (!response.ok) {
        throw new Error("서버 응답 에러");
      }
      const data = await response.json();
      setBoardData(data.result);
    } catch (error) {
      console.error("데이터를 가져오는 중 에러 발생:", error);
    }
  };

  // 페이지가 변경될 때마다 데이터를 가져오는 함수 호출
  useEffect(() => {
    handlePaging(page);
  }, [page]);

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <Toolbar />
      <div className="board-container">
        <div className="">
          <h3>게시판</h3>
        </div>
        <div className="write-button">
          <Link to="/board/write">
            <button>글쓰기</button>
          </Link>
        </div>
        <table className="table">
          {/* ... */}
          {/* 테이블 데이터 표시 부분은 여기에 있어야 함 */}
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
            {boardData.map((post, index) => (
              <tr key={index}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{post.title}</td>
                <td>{post.writer}</td>
                <td>2</td>
                <td>{post.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={goToPrevPage} disabled={page === 1}>
          이전
        </button>
        <span>{`${page}`}</span>
        <button onClick={goToNextPage}>다음</button>
      </div>

      <Footer />
    </div>
  );
}

export default Board;
