import React, { useState, useEffect } from "react";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import { useParams, useHistory, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function BoardDetail() {
  const { postId } = useParams(); // URL 파라미터에서 postId 추출
  const [postDetail, setPostDetail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const isAuthor = userInfo?.id === postDetail?.id;
  const handleEdit = () => {
    navigate(`/board_edit/${postId}`);
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/board_delete/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        navigate("/board");
      } else {
        const errorMessage = await response.text();
        console.error(
          `삭제하지 못했습니다. Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  const fetchPostDetail = async () => {
    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }

    try {
      const response = await fetch(
        `http://localhost:8080/board_detail/${postId}`
      );
      if (response.ok) {
        const data = await response.json();
        setPostDetail(data);
      } else {
        const errorMessage = await response.text();
        console.error(
          `Failed to fetch post detail. Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error fetching post detail:", error.message);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  return (
    <div>
      <Toolbar />
      <div className="post-detail-container">
        {postDetail ? (
          <div>
            <h2>{postDetail.title}</h2>
            <p>작성자: {postDetail.writer}</p>
            <p>조회수: {postDetail.views}</p>
            <p>날짜: {postDetail.date}</p>
            <p>{postDetail.content}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div>
        <div>
          <div className="">
            {isAuthor && <span onClick={handleEdit}>수정</span>}
          </div>
          <div>{isAuthor && <button onClick={handleDelete}>삭제</button>}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BoardDetail;
