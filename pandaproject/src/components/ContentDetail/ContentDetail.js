import Toolbar from "../toolbar/toolbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ContentDetail.css";
import Footer from "../footer/footer";
import jwt_decode from "jwt-decode";
import formatTimeAgo from "../formatTime/formatTimeAgo";

function ContentDetail(props) {
  const location = useLocation();
  const contentData = location.state?.contentData || {};
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }
  }, []);
  console.log("contentData", contentData);
  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/categoryComment?category=${props.Category}&id=${contentData._id}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("서버 응답 실패");
        }
        const data = await res.json();
        setCommentList(data.result);
        console.log(data.result);
      } catch (error) {
        console.error("데이터를 불러오는 중 에러 발생:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/category/${props.Category}/detail`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contentData),
        }
      );
      if (response.ok) {
        console.log("서버전송완료");
        navigate(`/category/${props.Category}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${props.Category}/${contentData.id}`, {
      state: { contentData },
    });
  };

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        contentId: contentData._id,
        contentWriterId: contentData.id,
        contentWriterName: contentData.username,
        loginName: userInfo.username,
        loginId: userInfo.id,
        comment: comment,
      };
      const response = await fetch("http://localhost:8080/comment?", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("서버 전송 완료");
        window.location.reload();
      } else {
        console.log("서버 전송 실패");
      }
    } catch (e) {
      console.log("서버에 요청 중 오류가 발생", e);
    }
  };

  const handleDeleteComment = async (e) => {
    try {
      const id = e.target.value;
      const response = await fetch(
        `http://localhost:8080/commentdelete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("서버 전송 완료");
        window.location.reload();
      } else {
        console.log("서버 전송 실패");
      }
    } catch (e) {
      console.log("서버에 요청 중 오류가 발생", e);
    }
  };
  const addressParts = (contentData.address || "").split(" ");
  const processedAddress = addressParts.slice(0, 3).join(" ");

  const formattedTime = formatTimeAgo(contentData.date);
  console.log("commentList", commentList.length);
  return (
    <div className="contentDetailContainer">
      <Toolbar />
      <div className="book_container-box">
        <div className="book_container">
          <div className="book-img-box">
            <img src={contentData.image} alt={contentData.title} />
          </div>
        </div>
        <div className="fashion-writeBox">
          <div className="fashion-userInfo">
            <p id="fashion-username">{contentData.username}</p>
            <p id="fashion-userAddress">{processedAddress}</p>
            <p id="fashion-userAddress">{formattedTime}</p>
          </div>
          <div className="title_deco">
            <h2 id="fashion-title">{contentData.title}</h2>
            <p id="fashion-price">
              {Number(contentData.price).toLocaleString()}원
            </p>

            <p id="fashion-content"> {contentData.content}</p>
          </div>
        </div>

        <div className="button_container">
          <button
            className="button_wishlist"
            onClick={handleEdit}
            style={{
              display:
                userInfo &&
                (userInfo.id === contentData.id ||
                  userInfo.id === "65703c972d7eba2e853faa06")
                  ? "block"
                  : "none",
            }}
          >
            수정
          </button>
          <button
            className="button_wishlist"
            onClick={handleDelete}
            style={{
              display:
                userInfo &&
                (userInfo.id === contentData.id ||
                  userInfo.id === "65703c972d7eba2e853faa06")
                  ? "block"
                  : "none",
            }}
          >
            삭제
          </button>
        </div>
        <div className="comment_wrap">
          <div className="button_wrap">
            <div className="totalComment">
              <p>댓글 {commentList.length}개</p>
            </div>
            <input
              className="comment_input"
              name="content"
              onChange={(e) => setComment(e.target.value)}
              autocomplete="off"
              placeholder="내용을 입력해주세요"
            />
            <div className="comment_submitButton-box">
              <button
                id="comment_submitButton"
                comment_submitButton
                type="submit"
                onClick={handleComment}
              >
                댓글작성
              </button>
            </div>
          </div>
          {commentList.map((a, i) => (
            <div className="user_comment">
              <Comment
                commentList={a}
                i={i}
                key={i}
                handleDeleteComment={handleDeleteComment}
                userInfo={userInfo}
              />
              <button
                onClick={handleDeleteComment}
                value={a._id}
                style={{
                  backgroundColor: "gray",
                  display:
                    userInfo &&
                    (userInfo.id === commentList[i].loginId ||
                      userInfo.id === "65703c972d7eba2e853faa06")
                      ? "block"
                      : "none",
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Comment(props) {
  return (
    <div>
      <p>{props.commentList.loginName}</p>
      <p>{props.commentList.comment}</p>
    </div>
  );
}

export default ContentDetail;
