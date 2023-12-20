import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import makeAnimated from "react-select/animated";
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
    tag: null,
    views: "0",
    date: "",
  });
  const animatedComponents = makeAnimated();

  const handleTagChange = (selectedOption) => {
    const tag = selectedOption ? selectedOption.value : null; // 변경: 하나의 태그만 선택 가능하도록 수정
    setBoardData((prevData) => ({
      ...prevData,
      tag: tag,
    }));
  };
  const tagOptions = [
    { value: "사는얘기", label: "사는얘기" },
    { value: "소통해요", label: "소통해요" },
    { value: "찾아줘요", label: "찾아줘요" },
  ];

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
    console.log(
      "Received views:",
      boardData.views,
      "Type:",
      typeof boardData.views
    );
    console.log("123123");
    console.log("제목:", boardData.title);
    console.log("내용:", boardData.content);
    console.log("작성자:", boardData.writer);
    console.log("날짜:", boardData.date);
    console.log("id:", boardData.id);
    console.log("id:", boardData.tag);

    const numericViews = parseInt(boardData.views);
    try {
      const res = await fetch("http://localhost:8080/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...boardData, views: numericViews }),
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
      views: "0",
      date: "",
    });
  };

  return (
    <div>
      <Toolbar />
      <div className="write-container">
        <form onSubmit={handleSubmit}>
          <label>
            태그
            <Select
              className="writer-select"
              components={animatedComponents}
              isMulti={false}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "primary25",
                  primary: "black",
                },
              })}
              options={tagOptions}
              value={tagOptions.find((tag) => tag.value === boardData.tag)}
              onChange={handleTagChange}
              placeholder="태그를 선택하세요"
            />
          </label>

          <div className="write-titleInput-box">
            <label>
              제목
              <input
                className="write-titleInput"
                type="text"
                placeholder="제목을 입력해주세요"
                value={boardData.title}
                onChange={handleTitleChange}
              />
            </label>
          </div>

          <label>
            내용
            <textarea
              className="write-titleContent"
              placeholder="내용을 입력해주세요"
              value={boardData.content}
              onChange={handleContentChange}
            />
          </label>
          <br />
          <div className="write-submitButton-box">
            <button className="write-submitButton" type="submit">
              글쓰기
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Write;
