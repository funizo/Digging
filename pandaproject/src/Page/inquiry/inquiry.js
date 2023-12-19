import ToolBar from "../../components/toolbar/toolbar";
import "./inquiry.css";

function Inquiry() {
  return (
    <div>
      <ToolBar />
      <h3 className="inquiry">문의사항</h3>
      <div className="mail">
        <p>
          문의사항은 하단 이메일 주소로 메일 전송 시 평일 기준 1~2일 내
          연락드립니다
        </p>
        <br />
        <p>고객문의 : digging@google.com</p>
        <p>제휴 및 광고 문의 : digging_m@google.com</p>
      </div>
    </div>
  );
}
export default Inquiry;