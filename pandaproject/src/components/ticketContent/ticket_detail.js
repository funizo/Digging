import React, { useState, useEffect } from "react";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import { useParams, useHistory, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./ticket_detail.css";

function TicketDetail() {
  const { postId } = useParams(); // URL 파라미터에서 postId 추출
  const [postDetail, setPostDetail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("postDetail11111111111111111111", postDetail);
  console.log("userInfo", userInfo);
  const isAuthor =
    userInfo?.id === postDetail?.id ||
    userInfo?.id === "65703c972d7eba2e853faa06";
  const handleEdit = () => {
    navigate(`/category/ticket_edit/${postId}`);
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/category/ticket_detail/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        navigate("/category/ticket");
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

    try {
      const response = await fetch(
        `http://localhost:8080/category/ticket_detail/${postId}`
      );
      if (response.ok) {
        const data = await response.json();
        setPostDetail(data);
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

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  return (
    <div>
      <Toolbar />

      <div className="post-detail-container">
        {postDetail ? (
          <div className="detail_innerContent">
            <h2 className="ticket">{postDetail.title}</h2>
            <p>{postDetail.writer}</p>
            <div className="divide_box">
              <p>{postDetail.date}</p>
              <p>조회수: {postDetail.views}</p>
            </div>
            <div className="main_text">{postDetail.content}</div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="button_container">
        <div>
          {isAuthor && (
            <button className="button_delete" onClick={handleDelete}>
              삭제하기
            </button>
          )}
        </div>
        <div>
          {isAuthor && (
            <button className="button_edit" onClick={handleEdit}>
              수정하기
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TicketDetail;
