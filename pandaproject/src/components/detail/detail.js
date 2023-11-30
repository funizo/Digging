import Toolbar from "../toolbar/toolbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./detail.css";
import Tabs from "../../components/tabs/tabs";

function Detail() {
  const location = useLocation();
  const bookData = location.state?.bookData || {};
  const navigate = useNavigate();
  const isLoggedIn = false; // 로그인 상태 여부
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  const handleAddToWishlist = () => {
    //백엔드 와 통신내용 추가 필요
    setIsAddedToWishlist(!isAddedToWishlist);
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
      </div>

      <div>하단 추천제품 링크및 이미지 삽입공간</div>
    </div>
  );
}

export default Detail;