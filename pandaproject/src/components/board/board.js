import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import "./board.css";

function Board() {
  const [boardData, setBoardData] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 2; // 한 페이지에 보여줄 게시글 수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/board?page=${page}&pageSize=${pageSize}`
        );
        if (response.ok) {
          const data = await response.json();
          setBoardData(data);
        } else {
          console.error("Failed to fetch board data");
        }
      } catch (error) {
        console.error("Error fetching board data:", error.message);
      }
    };

    fetchData();
  }, [page, pageSize]);

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
                <td>{index + 1}</td>
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
