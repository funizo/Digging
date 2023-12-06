import React, { useState, useEffect } from "react";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import "./board.css";

function Board() {
  const [boardData, setBoardData] = useState([]);
  console.log(boardData);
  useEffect(() => {
    // 서버에서 게시글 데이터를 가져오는 로직
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/board");
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
  }, []);

  return (
    <div>
      <Toolbar />
      <div className="board-container">
        <div className="">
          <h3>게시판</h3>
        </div>
        <div className="write-button">
          <a href="/board/write">글쓰기</a>
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
      <Footer />
    </div>
  );
}

export default Board;
