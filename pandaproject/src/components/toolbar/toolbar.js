import { SlMagnifier } from "react-icons/sl";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./toolbar.css";
import jwt_decode from "jwt-decode";

function ToolBar(props) {
  const [selectedAlarmCategory, setSelectedAlarmCategory] = useState("null");
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const alaramRef = useRef(null);
  const handleOutsideClick = (e) => {
    if (alaramRef.current && !alaramRef.current.contains(e.target)) {
      setShowAlarmDropdown(false); // 외부를 클릭하면 알람이 닫히도록 합니다.
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    // 만료 시간을 가져오기
    const expirationDate = localStorage.getItem("tokenExpiration");
    const nowDate = Date.now();

    // 토큰이 있고 만료 시간이 지나지 않았으면 로그인 상태로 설정
    if (expirationDate && nowDate < expirationDate) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleAlarmDropdown = async () => {
    setShowAlarmDropdown((prevShowAlarmDropdown) => !prevShowAlarmDropdown);

    if (!showAlarmDropdown) {
      //버튼을 닫았을때 기본값으로 리셋
      setSelectedAlarmCategory("alarm");
    }
    try {
      console.log("fetchAlerts호출");
      console.log(userInfo);
      const response = await fetch(
        `http://localhost:8080/manager/alerts/${userInfo.id}`
      );
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAlertMsg(data);
      } else {
        throw new Error("Failed to fetch alerts");
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const headerAlarmClick = (alarmcategory) => {
    setSelectedAlarmCategory(alarmcategory); //헤더알람 / 혜택 버튼 선택
  };

  const handleLinkClick = (e) => {
    if (userInfo === null) {
      alert("로그인이 필요합니다.")
      e.preventDefault();
    } else {
      navigate("/register")
    }
  }

  return (
    <div className="header-container">
      <header>
        <div className="user-actions">
          <div className="join">
            {isLoggedIn ? (
              <p style={{ fontSize: "12px" }}>어서오세요</p>
            ) : (
              <a href="/signup">회원가입</a>
            )}
          </div>

          <div className="login">
            {isLoggedIn ? (
              <p style={{ fontSize: "12px" }} onClick={handleLogout}>
                로그아웃
              </p>
            ) : (
              <Link to="/login">로그인</Link>
            )}
          </div>

          <a
            href="/manager"
            style={{
              display:
                userInfo && userInfo.id === "65703c972d7eba2e853faa06"
                  ? "block"
                  : "none",
              fontSize: "12px",
            }}
          >
            관리자페이지이동
          </a>

          <div className="mypage">
            <a href="/mypage">
              <img
                src={`${process.env.PUBLIC_URL}/img/mypage.png`}
                alt="마이페이지"
              />
            </a>
          </div>
          <div className="alarm">
            <img
              src={`${process.env.PUBLIC_URL}/img/alarm.png`}
              alt="알람"
              onClick={() => toggleAlarmDropdown()}
            />
          </div>
          {showAlarmDropdown && (
            <div className="alarm-container" ref={alaramRef}>
              <div className="alarm-header">
                <span
                  className={`alarm-title1 ${
                    selectedAlarmCategory === "alarm" ? "selected" : ""
                  }`}
                  onClick={() => headerAlarmClick("alarm")}
                >
                  알림
                </span>
                <span
                  className={`alarm-title2 ${
                    selectedAlarmCategory === "benefit" ? "selected" : ""
                  }`}
                  onClick={() => headerAlarmClick("benefit")}
                >
                  혜택
                </span>
              </div>

              {selectedAlarmCategory === "alarm" && (
                <>
                  <div className="alarm-content">
                    <div className="alarm-item"> {alertMsg.alert}</div>
                  </div>
                </>
              )}
              {selectedAlarmCategory === "benefit" && (
                <>
                  <div className="alarm-content">
                    {/* 알림 내용을 표시하는 부분 */}
                    <div className="alarm-item">
                      {" "}
                      <p className="item-title">
                        12월 디깅 친구초대 이벤트 진행중!
                      </p>
                    </div>
                    <div className="alarm-item">방탄&디깅 콜라보</div>
                    <div className="alarm-item">
                      디깅을 이용해주시는 모든분들께 특별한 연말 혜택을
                      드립니다!
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="navbar">
        <a href="/">
          <div className="nav-logo">
            <img
              className="logo-img"
              src={`${
                process.env.PUBLIC_URL
              }/img/logo-digging.png?${new Date().getTime()}`}
              alt="로고"
            ></img>
          </div>
        </a>

        <div className="d-flex">
          <div className="nav_list">
            <a className="nav_home" href="/">
              HOME
            </a>
            <a href="/board">커뮤니티</a>
            <a href="/register" onClick={handleLinkClick}>판매하기</a>
            <a href="">사기조회</a>
          </div>
          <button className="searchbutton">
            <SlMagnifier />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToolBar;
