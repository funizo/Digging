import React from "react";
import { Carousel } from "react-bootstrap";
import "../../App.css";
import "./slide.css";

function UncontrolledExample() {

  

  return (
    <div className="box">
      <div className="carousel-container">
        <Carousel className="carousel" interval={3000}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover", "border-radius":"15px" }}
              img
              src="img/panda-slide-001.png"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover", "border-radius":"15px" }}
              img
              src="img/panda-slide-002.png"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover", "border-radius":"15px" }}
              src="img/panda-slide-003.png"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
}

export default UncontrolledExample;
