import Toolbar from "../toolbar/toolbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import "./detail.css";
import Footer from "../footer/footer";
import jwt_decode from "jwt-decode";


function Detail() {
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const bookData = location.state?.bookData || {};
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
    //백엔드 와 통신내용 추가 필요 
    try {
      const response = await fetch('/api/addToWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 서버에 도서 ID 등 필요한 데이터를 전송
        body: JSON.stringify({ bookId: bookData.id }),
      });
      if (response.ok) {
        // 성공 시 서버로부터 업데이트된 찜 수량을 받아와 상태에 저장
        const data = await response.json();
        setWishlistCount(data.wishlistCount);
      } else {
        // 실패 시 에러 처리
        console.error('찜하기 요청 실패');
      }
    } catch (error) {
      console.error('네트워크 오류', error);
    }
  };
  const handleDelete = async() => {
    if(userInfo.id === bookData.id) {
      try {
        const response = await fetch('http://localhost:8080/category/book/detail', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData)
        });
        if (response.ok) {
          console.log("서버전송완료");
          navigate('/category/book')
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("삭제할수없습니다")
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
    if (userInfo.id === bookData.id ) {
      navigate(`/edit/${bookData.id}`, {state:{bookData}});
    }
  }

  return (
    <div>

      <Toolbar />
      <div className="book_container">
        <img src={bookData.bookImg} alt={bookData.title} />
        <div className="title_deco">
          <h2>제목: {bookData.bookTitle}</h2>
          <p>내용: {bookData.bookContent}</p>
          <p>즉시 구매가: {bookData.price}</p>
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
        <button className="button_wishlist" onClick={handleAddToWishlist}>
            {isAddedToWishlist ? "찜 해제" : "관심 상품으로 찜하기"}
        </button>
        <button className="button_wishlist" onClick={handleDelete} style={
            { display: userInfo && userInfo.id === bookData.id ? 'block' : 'none' }
          }>
            삭제하기
        </button>
        <button className="button_wishlist" onClick={handleEdit} style={
            { display: userInfo && userInfo.id === bookData.id ? 'block' : 'none' }
          }>
            수정하기
        </button>
        <p>찜 수량: {wishlistCount}</p>
      </div>

      <div>하단 추천제품 링크및 이미지 삽입공간</div>
      <Footer/>

    </div>
  );
}


export default Detail;