import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import formatTimeAgo from "../formatTime/formatTimeAgo";
import { LiaCommentDotsSolid } from "react-icons/lia";
import { IoEyeOutline } from "react-icons/io5";
import { ReactComponent as Back } from "./back.svg";
import { IoIosSearch } from "react-icons/io";
import "./board.css";

function Board() {
  const [boardData, setBoardData] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [tag, setTag] = useState(""); // 검색어 상태 추가

  const fetchData = async (pageNumber, selectedTag) => {
    try {
      const response = await fetch(
        `http://localhost:8080/board?&page=${pageNumber}&tag=${selectedTag}`
      );
      if (!response.ok) {
        throw new Error("서버 응답 에러");
      }

      const data = await response.json();
      console.log("data", data);
      let sortedData = data.result.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setBoardData(sortedData);
    } catch (error) {
      console.error("데이터를 가져오는 중 에러 발생:", error);
    }
  };

  const handleTagClick = (selectedTag) => {
    setTag(selectedTag === "전체보기" ? "" : selectedTag);
    fetchData(page, selectedTag);
  };
  const handlePaging = async (pageNumber) => {
    setPage(pageNumber);
  };
  useEffect(() => {
    fetchData(page, tag);
  }, [page, searchTerm, tag]);

  const goToPrevPage = () => {
    if (page > 1) {
      handlePaging(page - 1);
    }
  };

  const goToNextPage = () => {
    handlePaging(page + 1);
  };

  const handleSearchButtonClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/board?searchTerm=${searchTerm}`
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
  const handlePostClick = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/board_detail/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "handlePostClick",
          }),
        }
      );
      if (response.ok) {
        fetchData(page); // 페이지 데이터 새로고침
        navigate(`/board_detail/${postId}`); // postId를 전달하여 이동
      } else {
        console.error("Failed to increment views");
      }
    } catch (error) {
      console.error("Error incrementing views:", error.message);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleWriteClick = () => {
    // 버튼 클릭 시 토큰 확인 후 로그인 페이지로 이동
    if (!token) {
      navigate("/login"); // 로그인 페이지 경로로 변경
    } else {
      // 토큰이 있는 경우 글쓰기 페이지로 이동
      navigate("/board/write");
    }
  };
  const formattedComments = boardData
    ? boardData.map((post) => {
        const formattedTime = formatTimeAgo(post.date);
        return {
          ...post,
          formattedTime: formattedTime,
        };
      })
    : [];
  // formattedComments.sort((a, b) => a.parentId - b.parentId);
  return (
    <div>
      <Toolbar />
      <div className="board-container">
        <div className="board-box">
          <div className="board-title">
            <h5>커뮤니티</h5>
            <h6>다양한 사용자와 경험을 나누어보세요</h6>
          </div>
          <div className="board-backSvg">
            <Back />
          </div>
        </div>
        <div className="board-writeButton">
          <div className="board-tagbox">
            <p
              className="board-lifestory "
              onClick={() => handleTagClick("사는얘기")}
            >
              사는얘기
            </p>
            <p
              className="board-communication"
              onClick={() => handleTagClick("소통해요")}
            >
              소통해요
            </p>
            <p
              className="board-find"
              onClick={() => handleTagClick("찾아줘요")}
            >
              찾아줘요
            </p>
            <p
              className="board-allfind"
              onClick={() => handleTagClick("전체보기")}
            >
              전체보기
            </p>
          </div>
          <button onClick={handleWriteClick}>글쓰기</button>
        </div>
        <div className="board-serchInput-containerBox">
          <div className="board-serchInput-box">
            <label>
              <input
                className="board-serchInput"
                type="text"
                placeholder="검색어를 입력해주세요 "
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <span
                className="board-serchBtn-box"
                onClick={handleSearchButtonClick}
              >
                <IoIosSearch className="board-searchButton" />
              </span>
            </label>
          </div>
        </div>
        {formattedComments.map((post, index) => (
          <div
            className="board-infoContainer"
            key={index}
            onClick={() => handlePostClick(post._id)}
          >
            <div className="board-infoBox">
              <p className="board-postWriter">{post.writer}</p>
              <p className="board-formattedData">{post.formattedTime}</p>
            </div>
            <p className="board-postTitle">{post.title}</p>
            <div className="board-postView-container">
              <div className="board-tag-box">
                <p className="board-tag">{post.tag}</p>
              </div>
              <div className="board-postView-box">
                <p className="board-postViews">
                  <IoEyeOutline />
                  {post.views}
                </p>
                <p className="board-commentview">
                  <LiaCommentDotsSolid />
                  {post.views}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="pagination">
          <button onClick={goToPrevPage} disabled={page === 1}>
            이전
          </button>
          <span>{`${page}`}</span>
          <button onClick={goToNextPage}>다음</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Board;
