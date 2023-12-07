import React, { useState, useEffect } from "react";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";
import "./board.css";

function Board() {
  const [boardData, setBoardData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const handlePostClick = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/board_detail/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("board_postId", postId);
      if (response.ok) {
        fetchData();
        navigate(`/board_detail/${postId}`); // postId를 전달하여 이동
      } else {
        console.error("Failed to increment views");
      }
    } catch (error) {
      console.error("Error incrementing views:", error.message);
    }
  };
  
  const handleWriteClick = () => {
    // 버튼 클릭 시 토큰 확인 후 로그인 페이지로 이동
    if (!token) {
      console.log(token);
      navigate("/login"); // 로그인 페이지 경로로 변경
    } else {
      console.log(token);
      // 토큰이 있는 경우 글쓰기 페이지로 이동
      navigate("/board/write");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Toolbar />
      <div className="board-container">
        <div className="board-box">
          <div className="board-title">
            <h3>게시판</h3>
            </div>
            <div className="write-button">
              <span onClick={handleWriteClick}>글쓰기</span>
            </div>
         
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
              <tr key={index} onClick={() => handlePostClick(post._id)}>
                <td>{index + 1}</td>
                <td>{post.title}</td>
                <td>{post.writer}</td>
                <td>{post.views}</td>
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
