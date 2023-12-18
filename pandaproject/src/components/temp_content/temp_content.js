import React from "react";
import { useState } from "react";
import popularItem from "../../data/popularItem";
import "./temp_content.css";

function Content() {
  const [popularData, setPopularData] = useState(popularItem);
  const [categoryUrl, setCategoryUrl] = useState([
    "/event",
    "/category/rank",
    "/category/fashion",
    "/category/electronic",
    "/category/toy",
    "/category/goods",
    "/category/ticket",
    "/category/book",
  ]);
  console.log("popularData", popularData);
  return (
    <div className="poular-content">
      <div className="content-container">
        {popularData.map((item) => (
          <div className="card-container" key={item.id}>
            <PopularContent
              key={item.id}
              popularData={item}
              categoryUrl={categoryUrl[item.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
function PopularContent(props) {
  return (
    <div className="card-box">
      <a href={props.categoryUrl} className="card-link">
        <img
          className="card-image"
          src={props.popularData.img}
          alt="카드 이미지"
        />
      </a>
      <div className="card-content">
        <p>{props.popularData.title}</p>
      </div>
    </div>
  );
}

export default Content;
