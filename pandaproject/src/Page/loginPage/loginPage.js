import React, { useState } from "react";
import "./loginPage.css";
import { Link, useNavigate } from "react-router-dom";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";

const LoginPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (result.ok) {
        const data = await result.json();
        const { token, expiration } = data;

        const expirationDate = new Date(expiration);

        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expirationDate.getTime());
        console.log("로그인 성공");
        navigate("/");
        console.log("login-expiration", expirationDate);
      } else {
        const errorData = await result.json();
        console.log("서버에서 오류가 발생했습니다.", errorData.error);
        setError("아이디와 비밀번호를 확인해주세요");
      }
    } catch (error) {
      console.error("서버에 요청 중 오류가 발생", error);
    }
  };

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
        <h5>로그인</h5>
        <form onSubmit={handleSubmit}>
          <div className="id">
            <input
              className="id_input"
              type="text"
              value={userData.username}
              placeholder="아이디"
              onChange={(e) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div className="password">
            <input
              className="pw_input"
              type="password"
              value={userData.password}
              placeholder="비밀번호"
              onChange={(e) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <div className="login_button">
            <button type="submit">로그인</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </form>
      </div>
      <div className="loginPage-signUpWithHome">
        <Link to="/signup" className="sign_up">
          회원가입
        </Link>
        <Link to="/" className="home">
          Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
