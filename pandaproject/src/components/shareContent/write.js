import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./write.css";

const ShareWrite = ({ onPostSubmit }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwt_decode(token) : null;
  const [shareData, setShareData] = useState({
    id: decoded?.id || "",
    number: "",
    title: "",
    content: "",
    writer: decoded?.username || "",
    views: "0",
    date: "",
  });
  console.log("shareData",shareData);

  const handleTitleChange = (e) => {
    setShareData((prevData) => ({
      ...prevData,
      title: e.target.value,
    }));
  };

  const handleContentChange = (e) => {
    setShareData((prevData) => ({
      ...prevData,
      content: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Received views:",
      shareData.views,
      "Type:",
      typeof shareData.views
    );
    console.log("123123");
    console.log("제목:", shareData.title);
    console.log("내용:", shareData.content);
    console.log("작성자:", shareData.writer);
    console.log("날짜:", shareData.date);
    console.log("id:", shareData.id);

    const numericViews = parseInt(shareData.views);
    try {
      const res = await fetch("http://localhost:8080/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...shareData, views: numericViews }),
      });

      if (res.ok) {
        console.log("글 전송 ok.");

        if (onPostSubmit) {
          onPostSubmit();
        }
        navigate("/share");
      } else {
        console.error("글 전송 실패:", res.status);
      }
    } catch (error) {
      console.error("오류 발생:", error.message);
    }

    // 폼 초기화
    setShareData({
      id: "",
      number: "",
      title: "",
      content: "",
      writer: "",
      views: "0",
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
              value={shareData.title}
              onChange={handleTitleChange}
            />
          </label>
          <br />
          <label>
            <textarea
              value={shareData.content}
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

export default ShareWrite;
