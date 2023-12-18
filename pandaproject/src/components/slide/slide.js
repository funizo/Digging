import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import "../../App.css";
import "./slide.css";

function Slide({ interval }) {
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const handleSlideChange = (selectedIndex) => {
    // Change the background when the slide changes
    setBackgroundIndex(selectedIndex);
  };

  return (
    <div className="box">
      <div className={`carousel-container background-${backgroundIndex}`}>
        <Carousel
          className="carousel"
          interval={interval}
          onSelect={handleSlideChange}
        >
          <Carousel.Item>
            <img
              className="d-block w-100 "
              style={{ objectFit: "cover" }}
              img
              src="img/panda-slide-001.png"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover" }}
              img
              src="img/panda-slide-002.png"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover" }}
              src="img/panda-slide-003.png"
              alt="Third slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover" }}
              src="img/panda-slide-004.png"
              alt="Fourth slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
}

export default Slide;
