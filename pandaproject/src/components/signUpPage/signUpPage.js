import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Post from "../post";
import "./signUpPage.css";
import Toolbar from "../toolbar/toolbar";
import Footer from "../footer/footer";

const SignUpPage = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const navigate = useNavigate();
  const handleAddressButtonClick = () => {
    setShowAddress((prevShowAddress) => !prevShowAddress);
  };
  // Post 컴포넌트에서 선택한 주소를 처리
  const handlePostComplete = (data) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      address: data.address,
    }));
    setShowAddress(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
    } else {
      try {
        const res = await fetch("http://localhost:8080/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (res.ok) {
          console.log("서버전송완료");
          navigate("/");
        } else {
          console.log("서버전송실패");
        }
      } catch (e) {
        console.log("서버에 요청중 오류가 발생", e);
      }
    }
  };

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    subaddress: "",
  });

  return (
    <div>
      <Toolbar />
      <Link to="/" className="logo">
        <img
          src={`${
            process.env.PUBLIC_URL
          }/img/logo-digging.png?${new Date().getTime()}`}
          alt="로고"
        />
      </Link>
      <div className="container">
        <h5 className="singup-title">회원가입</h5>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              placeholder="  아이디"
              type="text"
              value={userData.username}
              onChange={(e) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <input
              placeholder="  이메일"
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <input
              placeholder="  주소"
              className="address"
              type="text"
              value={userData.address}
              onChange={(e) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  address: e.target.value,
                }))
              }
              onClick={handleAddressButtonClick}
            />
            <div>
              <input
                placeholder="  상세주소"
                className="input-subaddress"
                type="text"
                value={userData.subaddress}
                onChange={(e) =>
                  setUserData((prevUserData) => ({
                    ...prevUserData,
                    subaddress: e.target.value,
                  }))
                }
              />
            </div>

            {showAddress && (
              <Post
                setcompany={{ address: setUserData.address }}
                onComplete={handlePostComplete}
                subaddress={setUserData.subaddress}
              />
            )}
          </div>
          <div>
            <input
              placeholder="  비밀번호"
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <input
              placeholder="  비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="signUpPage-signUpButton">
            <button type="submit">가입하기</button>
          </div>
          <Link to="/login">이미 계정이 있으신가요? 로그인</Link>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
