import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import Toolbar from "../toolbar/toolbar";
import "./ContentItem.css";
import { IoIosSearch } from "react-icons/io";
import Footer from "../footer/footer";
import jwt_decode from "jwt-decode";

function ContentItem(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [sortOption, setSortOption] = useState("sort");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/category/${props.Category}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("서버 응답 실패");
        }
        const data = await res.json();
        let sortedData;

        // switch 문에서 sortedData를 정의하기 전에 사용하지 않도록 수정
        switch (sortOption) {
          case "sort":
            sortedData = data.result.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            break;
          case "lowPrice":
            sortedData = data.result.sort((a, b) => a.price - b.price);
            break;
          case "highPrice":
            sortedData = data.result.sort((a, b) => b.price - a.price);
            break;
          default:
            sortedData = data.result;
        }

        setContentData(sortedData);
      } catch (error) {
        console.error("데이터를 불러오는 중 에러 발생:", error);
      }
    };

    fetchData();
  }, [sortOption, props.Category]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchData === "") {
      alert("내용을 작성해 주세요");
    } else {
      try {
        const res = await fetch(
          `http://localhost:8080/${props.Category}/search?val=${searchData}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setContentData(data.result);
      } catch (e) {
        console.log("서버 요청중 오류발생", e);
      }
    }
  };

  const goToDetail = (id, contentData) => {
    navigate(`/category/${props.Category}/detail/${id}`, {
      state: { contentData },
    });
  };

  return (
    <div className="categoryContents">
      <Toolbar />

      <p
        style={{ display: "flex", justifyContent: "center", fontSize: "25px" }}
      >
        {(() => {
          switch (props.Category) {
            case "fashion":
              return "패션";
            case "electronic":
              return "전자제품";
            case "book":
              return "도서";
            case "toy":
              return "장난감";
            case "goods":
              return "굿즈";
            case "ticket":
              return "티켓/기프티콘";
            default:
              return "";
          }
        })()}
      </p>
      <div className="contentItem-searchBox-container">
        <div className="contentItem-searchBox">
          <label>
            <input
              className="search"
              placeholder="어떤 상품을 찾으시나요?"
              onChange={(e) => setSearchData(e.target.value)}
            />

            <span className="contentItem-searchButton-box">
              <IoIosSearch
                className="contentItem-searchButton"
                onClick={handleSearch}
              />
            </span>
          </label>
        </div>
      </div>
      <div className="contentItem-sort-options">
        <span
          className={`contentItem-sort-newData ${
            sortOption === "sort" ? "clicked" : ""
          }`}
          onClick={() => setSortOption("sort")}
        >
          최신순
        </span>
        <span className="separator">|</span>
        <span
          className={`contentItem-sort-lowPrice ${
            sortOption === "lowPrice" ? "clicked" : ""
          }`}
          onClick={() => setSortOption("lowPrice")}
        >
          낮은가격순
        </span>
        <span className="separator">|</span>
        <span
          className={`contentItem-sort-highPrice ${
            sortOption === "highPrice" ? "clicked" : ""
          }`}
          onClick={() => setSortOption("highPrice")}
        >
          높은가격순
        </span>
      </div>

      {loading ? (
        contentData.map((_, i) => (
          <div className="image-container" key={i}>
            <TabContentSkeleton />
          </div>
        ))
      ) : (
        <div className="categoryContents-container">
          {contentData.map((a, i) => (
            <div
              className="image-container"
              key={i}
              onClick={() => goToDetail(a.id, a)}
            >
              <TabContent key={i} contentData={contentData[i]} i={i} />
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}

function TabContentSkeleton() {
  return (
    <div className="skeleton-container">
      <h3 className="skeleton-title">
        <Skeleton duration={1} width={300} height={100} />
      </h3>
      <h3 className="skeleton-title">
        <Skeleton duration={1} width={300} height={20} />
      </h3>
      <p className="skeleton-text">
        <Skeleton duration={1} width={80} height={15} />
      </p>
      <p className="skeleton-text-small">
        <Skeleton duration={1} width={60} height={15} />
      </p>
    </div>
  );
}

function TabContent(props, i) {
  const addressParts = (props.contentData.address || "").split(" ");
  const processedAddress = addressParts.slice(0, 3).join(" ");

  return (
    <div className="categoryContents-item">
      <div className="categoryContents-img-box">
        <img src={props.contentData.image} alt="" />
      </div>
      <div className="text-content">
        <p className="categoryContents-card-title">{props.contentData.title}</p>
        <p className="categoryContents-card-price">
          {Number(props.contentData.price).toLocaleString()}원
        </p>
        <p className="categoryContents-card-address">{processedAddress}</p>
      </div>
    </div>
  );
}

export default ContentItem;
