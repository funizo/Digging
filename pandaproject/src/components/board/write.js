import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./write.css";

const Write = ({ onPostSubmit }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwt_decode(token) : null;
  const [boardData, setBoardData] = useState({
    id: decoded?.id || "",
    number: "",
    title: "",
    content: "",
    writer: decoded?.username || "",
    views: "",
    date: "",
  });

  const handleTitleChange = (e) => {
    setBoardData((prevData) => ({
      ...prevData,
      title: e.target.value,
    }));
  };

  const handleContentChange = (e) => {
    setBoardData((prevData) => ({
      ...prevData,
      content: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("제목:", boardData.title);
    console.log("내용:", boardData.content);
    console.log("작성자:", boardData.writer);
    console.log("날짜:", boardData.date);
    console.log("id:", boardData.id);

    try {
      const res = await fetch("http://localhost:8080/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardData),
      });

      if (res.ok) {
        console.log("글 전송 ok.");

        if (onPostSubmit) {
          onPostSubmit();
        }
        navigate("/board");
      } else {
        console.error("글 전송 실패:", res.status);
      }
    } catch (error) {
      console.error("오류 발생:", error.message);
    }

    // 폼 초기화
    setBoardData({
      id: "",
      number: "",
      title: "",
      content: "",
      writer: "",
      views: "",
      date: "",
    });
  };

  return (
    <div>
      <Toolbar />
      <div className="write-container">
        <h2>글쓰기</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              value={boardData.title}
              onChange={handleTitleChange}
            />
          </label>
          <br />
          <label>
            <textarea
              value={boardData.content}
              onChange={handleContentChange}
            />
          </label>
          <br />
          <button type="submit">글쓰기</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Write;
