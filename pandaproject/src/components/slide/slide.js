import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import "./slide.css";

function Slide({ interval }) {
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const handleSlideChange = (selectedIndex) => {
    // 슬라이드 변경 시 배경을 변경합니다.
    setBackgroundIndex(selectedIndex);
  };

  return (
    <div className="box">
      <div className={`carousel-container background-${backgroundIndex}`}>
        <Carousel
          className="carousel"
          interval={interval}
          onSelect={handleSlideChange}
          slide={false}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover" }}
              img
              src="img/slide/panda-slide-001.png"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover" }}
              img
              src="img/slide/panda-slide-002.png"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover" }}
              src="img/slide/panda-slide-003.png"
              alt="Third slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover" }}
              src="img/slide/panda-slide-004.png"
              alt="Fourth slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
}

export default Slide;
