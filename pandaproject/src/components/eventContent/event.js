// import React, { useState, useEffect } from "react";
// import {  useNavigate } from "react-router-dom";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
// import jwt_decode from "jwt-decode";
import "./event.css";

function Event() {
  // const [eventData, setEventData] = useState([]);
  // const [page, setPage] = useState(1);
  // const pageSize = 10; // 페이지당 보여줄 항목 수
  // const navigate = useNavigate();
  // const [userInfo, setUserInfo] = useState(null);
  // const token = localStorage.getItem("token");
  
  // const isAuthor = userInfo?.id === '65703c972d7eba2e853faa06';
  // const fetchData = async (pageNumber) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/event?page=${pageNumber}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("서버 응답 에러");
  //     }
  //     const data = await response.json();
  //     setEventData(data.result);
  //   } catch (error) {
  //     console.error("데이터를 가져오는 중 에러 발생:", error);
  //   }
  // };

  // const handlePaging = async (pageNumber) => {
  //   setPage(pageNumber);
  // };

  // useEffect(() => {
  //   if (token) {
  //     // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
  //     const decoded = jwt_decode(token);
  //     setUserInfo(decoded);
  //   }

  //   fetchData(page);
  // }, [page]);

  // const goToPrevPage = () => {
  //   if (page > 1) {
  //     handlePaging(page - 1);
  //   }
  // };

  // const goToNextPage = () => {
  //   handlePaging(page + 1);
  // };

  // const handlePostClick = async (postId) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/event_detail/${postId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.ok) {
  //       fetchData(page); // 페이지 데이터 새로고침
  //       navigate(`/event_detail/${postId}`); // postId를 전달하여 이동
  //     } else {
  //       console.error("Failed to increment views");
  //     }
  //   } catch (error) {
  //     console.error("Error incrementing views:", error.message);
  //   }
  // };

  // const handleWriteClick = () => {
  //   // 버튼 클릭 시 토큰 확인 후 로그인 페이지로 이동
  //   if (!token) {
  //     navigate("/login"); // 로그인 페이지 경로로 변경
  //   } else {
  //     // 토큰이 있는 경우 글쓰기 페이지로 이동
  //     navigate("/event/write");
  //   }
  // };

  return (
    <div>
      <Toolbar />
      <div className="event-background">
        <div className="event-title">
          <img src="img/event/event-slide-001.png" alt="배너넣는곳"/>
        </div>
      </div>
      <div className="event-container">
        <div style={{textAlign:"center"}}>
          <div>
            <h3 style={{fontWeight:"bold"}}>이벤트</h3>
          </div>
          {/* <div className="write-button">
          {isAuthor && <span onClick={handleWriteClick}>글쓰기</span>}
          </div> */}
        </div>

        {/* <table className="table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>조회수</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((post, index) => (
              <tr key={index} onClick={() => handlePostClick(post._id)}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{post.title}</td>
                <td>{post.writer}</td>
                <td>{post.views}</td>
                <td>{post.date}</td>
              </tr>
            ))}
          </tbody>
        </table> */}



      </div>

      <div className="img-container">
        <img onClick="" src="img/event/event-slide-002.png" alt=""/>
        <div></div>
        <img src="img/event/event-slide-003.png" alt=""/>
        <div></div>
        <img src="img/event/event-slide-004.png" alt=""/>
        <div></div>
        <img src="img/event/event-slide-005.png" alt=""/>
        <div></div>
        <img src="img/event/event-slide-006.png" alt=""/>
      </div>
      <Footer />
    </div>
  );
}

export default Event;
