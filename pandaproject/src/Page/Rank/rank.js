import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
// import { useEffect } from "react";


function Rank() {
    // useEffect(() => {
    //     console.log("1");
    //     const fetchData = async () => {
    //       const url = `http://localhost:5000/keywords_json/10`;
    //     try {
    //         console.log("2");
    //         const res = await fetch(url);
    //         console.log("3",res);
    //         if (!res.ok) {
    //             console.log("4");
    //         throw new Error('서버 응답 실패');
    //         } 
    //         const data = await res.json();
    //         console.log("5",JSON.stringify(data));
    //     } catch (error) {
    //         console.error('데이터를 불러오는 중 에러 발생:', error);
    //     }
    //     };
    
    //     fetchData();
    //   }, []);
    
        
    return (
        <div>
            <Toolbar />
            <p>실시간 랭킹</p>
            <Footer />
        </div>
    )
}

export default Rank