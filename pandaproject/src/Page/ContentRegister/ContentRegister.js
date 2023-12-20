import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import { useState, useEffect } from "react";
import ToolBar from "../../components/toolbar/toolbar";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./ContentRegister.css";
import jwt_decode from "jwt-decode";

function ContentRegister(props) {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();
  const tagOptions = [
    { value: "fashion", label: "패션" },
    { value: "electronic", label: "전자제품" },
    { value: "toy", label: "장난감" },
    { value: "goods", label: "굿즈" },
    { value: "ticket", label: "티켓/기프티콘" },
    { value: "book", label: "도서" },
  ];
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }
  }, []);

  const [writeData, setWriteData] = useState({
    title: "",
    content: "",
    price: "",
    image: null,
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setWriteData((prevWriteData) => ({ ...prevWriteData, image: file }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (writeData.title === "" || writeData.content === "") {
      alert("내용을 작성해 주세요");
    } else {
      try {
        const formData = new FormData();
        formData.append("title", writeData.title);
        formData.append("content", writeData.content);
        formData.append("image", writeData.image);
        formData.append("price", writeData.price);
        formData.append("id", userInfo.id);
        formData.append("username", userInfo.username);
        formData.append("address", userInfo.address);
        formData.append("date", "");
        const res = await fetch(
          `http://localhost:8080/register/${
            selectedTag ? selectedTag.value : ""
          }`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (res.ok) {
          console.log("서버 전송 완료");
          navigate("/");
        } else {
          console.log("서버 전송 실패");
        }
      } catch (e) {
        console.log("서버에 요청 중 오류가 발생", e);
      }
    }
  };

  const animatedComponents = makeAnimated();
  const handleTagChange = (selectedOption) => {
    setSelectedTag(selectedOption);
  };

  return (
    <div>
      <ToolBar />
      <div className="contentRegister-container">
        <form
          className="contentRegister-formbox"
          onSubmit={handleSubmit}
          enctype="multipart/form-data"
        >
          <label>
            태그
            <Select
              className="contentRegister-custom-select"
              components={animatedComponents}
              isMulti={false}
              theme={(theme) => ({
                ...theme,
                borderRadius: 4,
                colors: {
                  ...theme.colors,
                  primary25: "primary25",
                  primary: "black",
                },
              })}
              options={tagOptions}
              value={selectedTag}
              onChange={handleTagChange}
              placeholder="태그를 입력하세요"
            />
          </label>
          <div id="contentRegister-titleInput">
            <label>
              제목
              <input
                placeholder="제목을 입력해주세요"
                type="text"
                value={writeData.title}
                onChange={(e) =>
                  setWriteData((prevWriteData) => ({
                    ...prevWriteData,
                    title: e.target.value,
                  }))
                }
              />
            </label>
          </div>
          <div id="contentRegister-contentInput">
            <label>
              내용
              <textarea
                placeholder="내용을 입력해주세요"
                type="text"
                value={writeData.content}
                onChange={(e) =>
                  setWriteData((prevWriteData) => ({
                    ...prevWriteData,
                    content: e.target.value,
                  }))
                }
              />
            </label>
          </div>
          <div id="contentRegister-priceInput">
            <label>
              가격
              <input
                placeholder="₩ 가격을 입력해주세요"
                type="text"
                value={writeData.price}
                onChange={(e) =>
                  setWriteData((prevWriteData) => ({
                    ...prevWriteData,
                    price: e.target.value,
                  }))
                }
              />
            </label>
          </div>
          <div id="contentRegister-imgBox">
            <input
              placeholder="  이미지"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div id="contentRegister-button">
            <button type="submit">작성하기</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ContentRegister;
