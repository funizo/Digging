import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./board_edit.css";

const BoardEdit = () => {
  const { postId } = useParams();
  const [postDetail, setPostDetail] = useState({
    title: "",
    content: "",
    tag: null,
  });
  const animatedComponents = makeAnimated();
  const handleTagChange = (selectedOption) => {
    const tag = selectedOption ? selectedOption.value : null;
    setPostDetail((prevData) => ({
      ...prevData,
      tag: tag,
    }));
  };
  const tagOptions = [
    { value: "사는얘기", label: "사는얘기" },
    { value: "소통해요", label: "소통해요" },
    { value: "찾아줘요", label: "찾아줘요" },
  ];
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/board_edit/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: postDetail.title,
            content: postDetail.content,
            tag: postDetail.tag,
          }),
        }
      );

      if (response.ok) {
        // 수정이 성공하면 다른 페이지로 이동 또는 다른 로직 수행
        navigate(`/board_detail/${postId}`);
      } else {
        const errorMessage = await response.text();
        console.error(
          `수정 실패. Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error editing post:", error.message);
    }
  };

  return (
    <div>
      <Toolbar />
      <div className="boardEdit-container">
        <form onSubmit={handleFormSubmit}>
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
              value={tagOptions.find((tag) => tag.value === postDetail.tag)}
              onChange={handleTagChange}
              placeholder="태그를 선택하세요"
            />
          </label>

          <div className="boardEdit-titleInput-box">
            <label>
              제목
              <input
                className="boardEdit-titleInput"
                type="text"
                placeholder="제목을 입력해주세요"
                value={postDetail.title}
                onChange={(e) =>
                  setPostDetail({
                    ...postDetail,
                    title: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <label>
            내용
            <textarea
              className="boardEdit-titleContent"
              placeholder="내용을 입력해주세요"
              value={postDetail.content}
              onChange={(e) =>
                setPostDetail({
                  ...postDetail,
                  content: e.target.value,
                })
              }
            />
          </label>
          <br />
          <div className="boardEdit-submitButton-box">
            <button className="boardEdit-submitButton" type="submit">
              글쓰기
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BoardEdit;
