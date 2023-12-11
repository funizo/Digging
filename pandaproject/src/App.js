import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Toolbar from "./components/toolbar/toolbar";
import Slide from "./components/slide/slide";
import Footer from "./components/footer/footer";
import Content from "./components/temp_content/temp_content";
import React, { useEffect } from "react";


function App() {


  useEffect(() => {
    console.log("실행");
    // 만료 시간을 가져오기
    //인터벌을 테스트 후 삭제
    const intervalId = setInterval(() => {
      const expirationDate = localStorage.getItem("tokenExpiration");
      const nowDate = Date.now();

 

      // 만료 시간이 지났으면 로그아웃
      if (expirationDate && nowDate > expirationDate) {
        console.log("토큰이 만료되어 자동 로그아웃됩니다.");
        logout();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
  };
  console.log();

  return (
    <div className="App">
      <Toolbar />
      {/* <Tabs/> */}
      <Slide />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
