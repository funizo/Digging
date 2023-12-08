import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/footer'
import { useState,useEffect } from 'react';
import ToolBar from '../../components/toolbar/toolbar';
import "./electronicRegister.css";
import jwt_decode from "jwt-decode";

function ElectronicRegister() {
    
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token) {
          // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
          const decoded = jwt_decode(token);
          setUserInfo(decoded);
        }
      }, []);
    
    const [writeData,setWriteData] = useState({
        title:"",
        content:"",
        price:"",
        image:null
    })
    const navigate = useNavigate();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setWriteData((prevWriteData) => ({ ...prevWriteData, image: file }));
    };
    const handleSubmit = async(e) => {
        e.preventDefault();

        if (writeData.title === '' || writeData.content === '') {
            alert("내용을 작성해 주세요");
        } else {
            try {
                const formData = new FormData();
                formData.append('title', writeData.title);
                formData.append('content', writeData.content);
                formData.append('image', writeData.image);
                formData.append('price', writeData.price);
                formData.append('id',userInfo.id);
                formData.append('username',userInfo.username);
                const res = await fetch("http://localhost:8080/electronicregister", {
                    method: "POST",
                    body: formData,
                });

                if (res.ok) {
                    console.log("서버 전송 완료");
                    navigate('/category/electronic');
                } else {
                    console.log("서버 전송 실패");
                }
            } catch (e) {
                console.log("서버에 요청 중 오류가 발생", e);
            }
        }
    }

    return (
        <div>
            <ToolBar/>
            
            <div>
                <form onSubmit={handleSubmit} enctype="multipart/form-data">
                    <div className="input_container">
                        <input
                        placeholder="  제목"
                        style={{width:"80%"}}
                        type="text"
                        value={writeData.title}
                        onChange={(e) => setWriteData((prevWriteData) => ({ ...prevWriteData, title: e.target.value }))}
                        />
                    </div>
                    <div className="input_container">
                        <input
                        placeholder="  내용"
                        type="text"
                        style={{width:"80%",height:"500px"}}
                        value={writeData.content}
                        onChange={(e) => setWriteData((prevWriteData) => ({ ...prevWriteData, content: e.target.value }))}
                        />
                    </div>
                    <div className="input_container">
                        <input
                        placeholder="  가격"
                        style={{width:"80%"}}
                        type="text"
                        value={writeData.price}
                        onChange={(e) => setWriteData((prevWriteData) => ({ ...prevWriteData, price: e.target.value }))}
                        />
                    </div>
                    <div className="input_container">
                        <input
                        placeholder="  이미지"
                        type="file"
                        name='image'
                        accept='image/*'
                        onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" style={{ margin: "auto", width: "100px", display: "block" }}>작성하기</button>
                </form>
            </div>
            <Footer/>
        </div>

    )
}

export default ElectronicRegister