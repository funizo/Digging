import { Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import magazine from "../../data/magazine";
import learning from "../../data/learning";
import novel from "../../data/novel";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import "./tabBar.css";

function TabBar() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const [novelData, setNovelData] = useState(novel);
  const [magazineData, setMagazineData] = useState(magazine);
  const [learningData, setLearningData] = useState(learning);
  const [loading, setLoading] = useState(true);
  const goToBookDetail = (bookData) => {
    navigate("detail", { state: { bookData } });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Nav variant="tabs" defaultActiveKey="link0">
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setTab(0);
            }}
            eventKey="link0"
          >
            소설
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setTab(1);
            }}
            eventKey="link1"
          >
            학습지
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setTab(2);
            }}
            eventKey="link2"
          >
            잡지
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="TabBar">
        {loading
          ? novelData.map((_, i) => (
              <div className="image-container" key={i}>
                <TabContentSkeleton />
              </div>
            ))
          : novelData.map((a, i) => (
              <div
                className="image-container"
                key={i}
                onClick={() => goToBookDetail(novelData[i])}
              >
                <TabContent
                  key={i}
                  tab={tab}
                  novelData={novelData[i]}
                  magazineData={magazineData[i]}
                  learningData={learningData[i]}
                  i={i}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

// 1.각 아이템을 누르면
// 2.카테고리/아이템id 로 주소변환이 되면서
// 3.내용출력

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
  if (props.tab === 0) {
    return (
      <div className="novel">
        <img src={props.novelData.img} alt="" />
        <h3 className="card-title">{props.novelData.title}</h3>
        <p>{props.novelData.writer}</p>
        <p>{props.novelData.price}</p>
      </div>
    );
  }
  if (props.tab === 1) {
    return (
      <div className="learning">
        <img src={props.learningData.img} alt="" />
        <h3 className="card-title">{props.learningData.title}</h3>
        <p>{props.learningData.writer}</p>
        <p>{props.learningData.price}</p>
      </div>
    );
  }
  if (props.tab === 2) {
    return (
      <div className="magazine">
        <img src={props.magazineData.img} alt="" />
        <h3 className="card-title">{props.magazineData.title}</h3>
        <p>{props.magazineData.writer}</p>
        <p>{props.magazineData.price}</p>
      </div>
    );
  }
}

export default TabBar;
