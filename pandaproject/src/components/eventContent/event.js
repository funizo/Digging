import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import "./event.css";

function Event() {
  return (
    <div>
      <Toolbar />
      <div className="event-background">
        <div className="event-title">
          <img src="img/event/event-slide-001.png" alt="배너넣는곳" />
        </div>
      </div>
      <div className="event-container">
        <div style={{ textAlign: "center" }}>
          <div>
            <h3 style={{ fontWeight: "bold" }}>이벤트</h3>
          </div>
        </div>
      </div>
      <div className="img-container">
        <img onClick="" src="img/event/event-slide-002.png" alt="" />
        <div></div>
        <img src="img/event/event-slide-003.png" alt="" />
        <div></div>
        <img src="img/event/event-slide-004.png" alt="" />
        <div></div>
        <img src="img/event/event-slide-005.png" alt="" />
        <div></div>
        <img src="img/event/event-slide-006.png" alt="" />
      </div>
      <Footer />
    </div>
  );
}

export default Event;
