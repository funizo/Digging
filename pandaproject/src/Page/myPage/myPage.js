import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import "./myPage.css";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

function MyPage() {
  const [menu, setMenu] = useState(1);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }
  }, []);

  return (
    <div>
      <Toolbar />
      <div className="page_wrap">
        <h1>마이페이지</h1>
        <div className="content">
          <div className="sideArea">
            <p
              className={menu === 1 ? "selected" : ""}
              onClick={() => {
                setMenu(1);
              }}
            >
              내정보
            </p>
            <p
              className={menu === 2 ? "selected" : ""}
              onClick={() => {
                setMenu(2);
              }}
            >
              설정
            </p>
          </div>
          <div className="mainArea">
            <MenuContent menu={menu} userInfo={userInfo} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function MenuContent(props) {
  if (props.menu === 1) {
    return (
      <div>
        <p>이름: {props.userInfo?.username}</p>
        <p>주소: {props.userInfo?.address}</p>
        <p>상세주소: {props.userInfo?.subaddress}</p>
        <p>이메일: {props.userInfo?.email}</p>
      </div>
    );
  }
  if (props.menu === 2) {
    return (
      <div>
        <p>색상변경</p>
        <p>글씨 크기</p>
      </div>
    );
  }
}

export default MyPage;
