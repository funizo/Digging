import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import bookToday from "../../data/pyton_today_data/bookToday";
import electronicToday from "../../data/pyton_today_data/electronicToday";
import fashionToday from "../../data/pyton_today_data/fashionToday";
import goodsToday from "../../data/pyton_today_data/goodsToday";
import ticketToday from "../../data/pyton_today_data/ticketToday";
import toyToday from "../../data/pyton_today_data/toyToday";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import "./rank.css";

function Rank() {
  const [bookData, setBookData] = useState(bookToday);
  const [electronicData, setElectronicData] = useState(electronicToday);
  const [fashionData, setFashionData] = useState(fashionToday);
  const [goodsData, setGoodsData] = useState(goodsToday);
  const [ticketData, setTicketData] = useState(ticketToday);
  const [toyData, setToyData] = useState(toyToday);

  console.log(bookData);
  return (
    <div style={{ margin: "0 250px" }}>
      <Toolbar />
      <div className="rank-title">
      <h3 style={{fontWeight:"bold"}}>인기 검색어 차트</h3>
        </div>
      <RankCard
        bookData={bookData}
        electronicData={electronicData} 
        fashionData={fashionData}
        goodsData={goodsData}
        ticketData={ticketData}
        toyData={toyData}
      />
      <p style={{textAlign:"center"}}>※ 매일 오전 10시 기준으로 선정된 검색어들입니다</p>

      <Footer />
    </div>
  );
}

function RankCard(props) {
  const categories = [
    { title: "책", data: props.bookData },
    { title: "전자제품", data: props.electronicData },
    { title: "패션", data: props.fashionData },
  ];

  const categoriesSecond = [
    { title: "굿즈", data: props.goodsData },
    { title: "티켓", data: props.ticketData },
    { title: "장난감", data: props.toyData },
  ];




    return (
        <div>
            <div className="flex-container2">
                {categories.map((category, i) => (
                  <div>
                    <h5 className="card-header2">{category.title}</h5>
                    <Card key={i} className='card-container2'>
                    {category.data.map((data, i) => (
                    <div key={i} className="card-content2">
                        {data.id}위 -  {data.name}
                    </div>
                    ))}
                </Card>
                </div>
                ))}
            </div>
            <div className="flex-container2">
                {categoriesSecond.map((category, i) => (
                  <div>
                    <h5 className="card-header2">{category.title}</h5>
                  <Card key={i} className="card-container2">
                    {category.data.map((data, i) => (
                    <div key={i} className="card-content2">
                        {data.id}위 -  {data.name}
                    </div>
                    ))}
                </Card>
                </div>
                ))}
            </div>
            </div>
        );
}

export default Rank;
