import React, { useState, useEffect } from "react";
import "./loginPage.css";
import { Link, useNavigate } from "react-router-dom";
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
        setError("로그인 실패");
      }
    } catch (error) {
      console.error("서버에 요청 중 오류가 발생", error);
    }
  };

  return (
    <div>
      <Link to="/" className="logo">
        <img
          src={`${
            process.env.PUBLIC_URL
          }/img/logo-digging.png?${new Date().getTime()}`}
          alt="로고"
        />
      </Link>
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="id">
            <label>아이디 :</label>
            <input
              className="id_input"
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
          <div className="password">
            <label>패스워드 :</label>
            <input
              className="pw_input"
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
          <div className="login_button">
            <button type="submit">로그인</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <Link to="/signup" className="sign_up">
            Sign Up
          </Link>
          <Link to="/" className="home">
            Home
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
