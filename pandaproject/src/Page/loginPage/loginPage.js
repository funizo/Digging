import React, { useState } from "react";
import "./loginPage.css";
import { Link ,useNavigate} from "react-router-dom";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: username, pw: password }),
      })

      if (result) {
        navigate('/')
      }
    } catch (e) {
      console.error(e)
      setError("아이디 또는 비밀번호가 틀렸습니다.")
    }
  };

  return (
    <div>
      {" "}
      <Link to="/" className="logo">
        <img src="img/logo.png" width="150" height="200" alt="로고" />
      </Link>
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="id">
            <label>아이디 :</label>
            <input
              className="id_input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="password">
            <label>패스워드 :</label>
            <input
              className="pw_input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
    </div>
  );
};

export default LoginPage;
