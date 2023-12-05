import Toolbar from "../toolbar/toolbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./detail.css";
import Tabs from "../../components/tabs/tabs";
import Footer from "../footer/footer";

function Detail() {
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const bookData = location.state?.bookData || {};
  const navigate = useNavigate();
  const isLoggedIn = false; // 로그인 상태 여부
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

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
  const handleBuy = () => {
    if (!isLoggedIn) {
      navigate("/signup");
    }
  };

  const handleAuction = () => {
    if (!isLoggedIn) {
      navigate("/signup");
    }
  };

  return (
    <div>
      <Toolbar />
      <Tabs />
      <div className="book_container">
        <img src={bookData.img} alt={bookData.title} />
        <div className="title_deco">
          <h2>{bookData.title}</h2>
          <p>작가: {bookData.writer}</p>
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
        <p>찜 수량: {wishlistCount}</p>
      </div>

      <div>하단 추천제품 링크및 이미지 삽입공간</div>
      <Footer/>
    </div>
  );
}

export default Detail;