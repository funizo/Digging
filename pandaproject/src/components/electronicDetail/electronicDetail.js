import Toolbar from "../toolbar/toolbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import "./electronicDetail.css";
import Footer from "../footer/footer";
import jwt_decode from "jwt-decode";


function ElectronicDetail() {

  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const electronicData = location.state?.electronicData || {};
  const navigate = useNavigate();
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    } 
  }, []);
  
  
  
  const handleAddToWishlist = async () => {
    setIsAddedToWishlist(!isAddedToWishlist);
     
    try {
      const formData = new FormData();
      formData.append('title', electronicData.bookTitle);
      formData.append('content', electronicData.bookContent);
      formData.append('image', electronicData.bookImg);
      formData.append('price', electronicData.price);
      formData.append('id',userInfo.id);
      formData.append('username',userInfo.username);
      const response = await fetch('http://localhost:8080/addToWishlist', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setWishlistCount(data.wishlistCount);
      } else {
        console.error('찜하기 요청 실패');
      }
    } catch (error) {
      console.error('네트워크 오류', error);
    }
  };

  const handleDelete = async() => {
      try {
        const response = await fetch('http://localhost:8080/category/electronic/electronicdetail', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(electronicData)
        });
        if (response.ok) {
          console.log("서버전송완료");
          navigate('/category/electronic')
        }
      } catch (error) {
        console.log(error);
      }
  }
  const handleBuy = () => {
      navigate("/login");
  };

  const handleAuction = () => {
    if (userInfo === null) {
      navigate("/login");
    }
  };

  const handleEdit = () => {
      navigate(`/electronicedit/${electronicData.id}`, {state:{electronicData}});
  }

  return (
    <div>

      <Toolbar />
      <div className="book_container">
        <img src={electronicData.electronicImg} alt={electronicData.title} />
        <div className="title_deco">
          <h2>제목: {electronicData.electronicTitle}</h2>
          <p>내용: {electronicData.electronicContent}</p>
          <p>즉시 구매가: {electronicData.price}</p>
        </div>
      </div>
      <div className="button_container">
        <button className="button_buy" onClick={handleBuy}>
          즉시구매
        </button>
        <button className="button_auction" onClick={handleAuction}>
          경매입찰
        </button>
      </div>
      <div className="wishlist">
        {/* 관심 상품으로 찜하기 버튼 */}
        <button className="button_wishlist" onClick={handleAddToWishlist} style={
          { display: userInfo && (userInfo.id === electronicData.id || userInfo.id === '65703c972d7eba2e853faa06') ? 'block' : 'none' }
          }>
            {isAddedToWishlist ? "찜" : "관심 상품으로 찜하기"}
        </button>
        <button className="button_wishlist" onClick={handleDelete} style={
            { display: userInfo && (userInfo.id === electronicData.id || userInfo.id === '65703c972d7eba2e853faa06') ? 'block' : 'none' }
          }>
            삭제하기
        </button>
        <button className="button_wishlist" onClick={handleEdit} style={
            { display: userInfo && (userInfo.id === electronicData.id || userInfo.id === '65703c972d7eba2e853faa06') ? 'block' : 'none' }
          }>
            수정하기
        </button>
      </div>

      <div>하단 추천제품 링크및 이미지 삽입공간</div>
      <Footer/>

    </div>
  );
}


export default ElectronicDetail;