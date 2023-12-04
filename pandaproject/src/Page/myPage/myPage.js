import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import "./myPage.css";
import { useState,useEffect } from "react";
import axios from 'axios'


function MyPage() {
  const [menu, setMenu] = useState(1);
  const [data,setData]  = useState("");

  useEffect(() => {
    const getData = () => {
      axios.get("http://localhost:8080/mypage")
      .then((res) => {
          // console.log(res.data);
          console.log(res.data);
          setData(res.data);
  
      }).catch((err) => {
          console.log(err);
      })
    };
    getData();
    },[]
  );

  useEffect(() => {
    console.log("데이터 ",data);
  },[data])

  

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
              찜 목록
            </p>
            <p
              className={menu === 3 ? "selected" : ""}
              onClick={() => {
                setMenu(3);
              }}
              >
              설정
            </p>
          </div>
          <div className="mainArea">
            <MenuContent menu={menu} data={data}/>
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
        <p>아이디:{props.data.title}</p>
        <p>이름:</p>
        <p>주소:</p>
        <p>이메일:</p>
      </div>
    );
  }
  if (props.menu === 2) {
    return <div>찜목록</div>;
  }
  if (props.menu === 3) {
    return (
      <div>
        <p>색상변경</p>
        <p>글씨 크기</p>
      </div>
    );
  }
}

export default MyPage;
