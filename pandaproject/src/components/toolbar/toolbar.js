import { SlMagnifier } from "react-icons/sl";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";

import "./toolbar.css";

function ToolBar() {
  const [selectedAlarmCategory, setSelectedAlarmCategory] = useState("null");
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);

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

  const toggleAlarmDropdown = () => {
    setShowAlarmDropdown((prevShowAlarmDropdown) => !prevShowAlarmDropdown);
    if (!showAlarmDropdown) {
      //버튼을 닫았을때 기본값으로 리셋
      setSelectedAlarmCategory("alarm");
    }
  };

  const headerAlarmClick = (alarmcategory) => {
    setSelectedAlarmCategory(alarmcategory); //헤더알람 / 혜택 버튼 선택
  };

  return (
    <div className="header-container">
      <header>
        <div className="user-actions">
          <div className="join">
            <Link to="/signup">회원가입</Link>
          </div>

          <div className="login">
            <a href="/login">로그인</a>
          </div>

          <div className="mypage">
            <a href="/">
              {/* PUBLIC_URL 환경 변수를사용하여 퍼블릭에 접근해서 불러오기 */}
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
                    {/* 알림 내용을 표시하는 부분 */}
                    <div className="alarm-item">
                      {" "}
                      알림 1<p className="item-title">123</p>
                      <p className="title-dscs">1234</p>
                    </div>
                  </div>
                </>
              )}
              {selectedAlarmCategory === "benefit" && (
                <>
                  <div className="alarm-content">
                    {/* 알림 내용을 표시하는 부분 */}
                    <div className="alarm-item">
                      {" "}
                      알림 1<p className="item-title">123</p>
                      <p className="title-dscs">1234</p>
                    </div>
                    <div className="alarm-item">새로운 알림 2</div>
                    <div className="alarm-item">새로운 알림 2</div>
                    <div className="alarm-item">새로운 알림 2</div>
                    <div className="alarm-item">새로운 알림 2</div>
                    <div className="alarm-item">새로운 알림 2</div>
                    <div className="alarm-item">새로운 알림 2</div>
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
              src={`${process.env.PUBLIC_URL}/img/logo2.png`}
              alt="로고"
            ></img>
            <div className="sitename">
              <a href="/">책판다</a>
            </div>
          </div>
        </a>

        <div className="d-flex">
          <div className="nav_list">
            <a href="/">HOME</a>
            <a href="#home">찾아요</a>
            <a href="#home">공유해요</a>
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
