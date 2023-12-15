import React, { useState, useEffect } from "react";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import Comment from "../comment/comment";
import { useParams, useNavigate } from "react-router-dom";
import "./board_detail.css";
import jwt_decode from "jwt-decode";
import formatTimeAgo from "../formatTime/formatTimeAgo";
import { IoEyeOutline } from "react-icons/io5";

function BoardDetail() {
  const { postId } = useParams(); // URL 파라미터에서 postId 추출
  const [postDetail, setPostDetail] = useState(null);
  const [comments, setComments] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthor =
    userInfo?.id === postDetail?.id ||
    userInfo?.id === "65703c972d7eba2e853faa06";
  const handleEdit = () => {
    navigate(`/board_edit/${postId}`);
  };
  const handleDelete = async () => {
    try {
      console.log("handle-postId", postId);
      const response = await fetch(
        `http://localhost:8080/board_detail/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "deletePost",
          }),
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
      console.error("삭제 에러 post:", error.message);
    }
  };

  const fetchPostDetail = async () => {
    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }
    // get 요청 해서 받아오는 부분
    try {
      const response = await fetch(
        `http://localhost:8080/board_detail/${postId}`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setPostDetail(data.post);
      } else {
        const errorMessage = await response.text();
        console.error(
          `디테일 에러. Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error fetching post detail:", error.message);
    }
  };
  const handleCommentSubmit = async () => {
    fetchPostDetail();
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);
  const postDate = postDetail ? postDetail.date : null;
  const formattedTime = postDate ? formatTimeAgo(postDate) : null;

  return (
    <div>
      <Toolbar />
      <div className="post-detail-box">
        <div className="boardDetail-box">
          <div className="boarDetail-findBox">
            <h5 className="boarDetail-boardtitle">커뮤니티</h5>
          </div>
          {postDetail && (
            <div>
              <div className="boarDetail-infoBox">
                <p className="boardDetail-writer">{postDetail.writer}</p>
                <div className="boardDetail-date-view-box">
                  <p className="boardDetail-date"> {formattedTime}</p>
                  <p className="boardDetail-view">
                    <IoEyeOutline /> {postDetail.views}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="boardDetail-title">{postDetail.title}</h2>
              </div>

              <p className="boarDetail-content">{postDetail.content}</p>
            </div>
          )}
          <div>
            <div className="boardDetail-handleBox">
              <div className="boardDetail-edit">
                {isAuthor && <span onClick={handleEdit}>수정</span>}
              </div>
              <div className="boardDetail-delete">
                {isAuthor && <span onClick={handleDelete}>삭제</span>}
              </div>
            </div>
          </div>
        </div>
        <Comment
          postId={postId}
          comments={comments}
          onCommentSubmit={handleCommentSubmit}
          userInfo={userInfo}
          fetchPostDetail={fetchPostDetail}
        />
      </div>

      <Footer />
    </div>
  );
}

export default BoardDetail;
