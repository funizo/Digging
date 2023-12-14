import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import bookToday from "../../data/pyton_today_data/bookToday";
import electronicToday from "../../data/pyton_today_data/electronicToday";
import fashionToday from "../../data/pyton_today_data/fashionToday";
import goodsToday from "../../data/pyton_today_data/goodsToday";
import ticketToday from "../../data/pyton_today_data/ticketToday";
import toyToday from "../../data/pyton_today_data/toyToday";
import { useState } from "react";
import Card from 'react-bootstrap/Card';
import "./rank.css";

function Rank() {

    const [bookData,setBookData] = useState(bookToday);
    const [electronicData,setElectronicData] = useState(electronicToday);
    const [fashionData,setFashionData] = useState(fashionToday);
    const [goodsData,setGoodsData] = useState(goodsToday);
    const [ticketData,setTicketData] = useState(ticketToday);
    const [toyData,setToyData] = useState(toyToday);




    console.log(bookData);
    return (
        <div style={{ margin: '0 250px' }}>
            <Toolbar />
                <h1 style={{textAlign:"center"}}>인기 검색어</h1>
                <RankCard bookData={bookData} electronicData={electronicData} fashionData={fashionData} goodsData={goodsData} ticketData={ticketData} toyData={toyData}/>
                <p>※하루 10시 기준으로 선정된 검색어들입니다</p>
                
            <Footer />
        </div>
    )
}



function RankCard(props) {
    
    const categories = [
        { title: '책', data: props.bookData },
        { title: '전자제품', data: props.electronicData },
        { title: '패션', data: props.fashionData },
    ];

    const categoriesSecond = [
        { title: '굿즈', data: props.goodsData },
        { title: '티켓', data: props.ticketData },
        { title: '장난감', data: props.toyData },
    ]

    // return (
    //     <div>
    //         <div style={{ display: 'flex', justifyContent:'center', alignContent:'center' }}>
    //         {categories.map((category, i) => (
    //             <Card key={i} style={{ width: '15rem',margin:'30px 20px' }}>
    //                 <h5 style={{textAlign:'center',marginTop:'15px',marginBottom:'15px', borderBottom:"2px solid:#ccc",borderRadius:'10%'}}>{category.title}</h5>
    //                 {category.data.map((data, i) => (
    //                     <div key={i} style={{margin:'0 15px 7px'}}>
    //                         {data.id}위 {data.name}
    //                     </div>
    //                 ))}
    //             </Card>
    //         ))}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent:'center', alignContent:'center' }}>
    //         {categoriesSecond.map((category, i) => (
    //             <Card key={i} style={{ width: '15rem',margin:'30px 20px' }}>
    //                 <h5 style={{textAlign:'center'}}>{category.title}</h5>
    //                 {category.data.map((data, i) => (
    //                     <div key={i} style={{margin:'0 15px 3px'}}>
    //                         {data.id}위 {data.name}
    //                     </div>
    //                 ))}
    //             </Card>
    //         ))}
    //         </div>
    //     </div>
    // );
    return (
        <div>
            <div className="flex-container">
                {categories.map((category, i) => (
                <Card key={i} className="card-container">
                    <h5 className="card-header">{category.title}</h5>
                    {category.data.map((data, i) => (
                    <div key={i} className="card-content">
                        {data.id}위 {data.name}
                    </div>
                    ))}
                </Card>
                ))}
            </div>
            <div className="flex-container">
                {categoriesSecond.map((category, i) => (
                <Card key={i} className="card-container">
                    <h5 className="card-header">{category.title}</h5>
                    {category.data.map((data, i) => (
                    <div key={i} className="card-content2">
                        {data.id}위 {data.name}
                    </div>
                    ))}
                </Card>
                ))}
            </div>
            </div>
        );
}


export default Rank