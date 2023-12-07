import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import Toolbar from "../toolbar/toolbar";
import "./bookContent.css";
import Footer from "../footer/footer";
import jwt_decode from "jwt-decode";

function NovelContent() {

    const navigate  = useNavigate();
    const [loading, setLoading] = useState(true);
    const [bookData, setBookData] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [searchData, setSearchData] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
        // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
            const decoded = jwt_decode(token);
            setUserInfo(decoded);
        } 
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:8080/category/book');
            if (!res.ok) {
            throw new Error('서버 응답 실패');
            }
            const data = await res.json();
            setBookData(data.result);
        } catch (error) {
            console.error('데이터를 불러오는 중 에러 발생:', error);
        }
        };

        fetchData();
    }, []);


    console.log(searchData);
    const handleSearch = async(e) => {
        e.preventDefault();
     if (searchData === '') {
        alert("내용을 작성해 주세요");
        } else {
            try {
                const res = await fetch(`http://localhost:8080/search?val=${searchData}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const data = await res.json();
                setBookData(data.result);
            } catch(e) {
                console.log("서버 요청중 오류발생",e);
            }
        }
    }

    const goToBookDetail = (id, bookData) => {
        navigate(`/category/book/bookdetail/${id}`, { state: { bookData } });
    }

    return(
        
        <div className='novel'>
            <Toolbar/>
            <a href="/category/book" style={{display: 'flex', justifyContent:"center",fontSize:"25px" }}>도서</a>
            <input className="search" onChange={(e) => setSearchData(e.target.value)}/>
            <button className="search-send" onClick={handleSearch}>검색</button>

            {loading ? (
                bookData.map((_, i) => (
                    <div className="image-container" key={i}>
                        <TabContentSkeleton />
                    </div>
        ))
    ) : (
        <div className="novel-container">
        {bookData.map((a, i) => (
            <div className="image-container" key={i} onClick={() => goToBookDetail(a.id, a)}>
            {/* <Link to={`././detail/${a.id}`} key={a.id}> */}
                <TabContent key={i} bookData={bookData[i]} i={i} />
            {/* </Link> */}
        </div>
        
        ))}
            </div>
        )}
        <a href={userInfo === null ? null : '/bookregister'} onClick={() => userInfo === null && alert("로그인해주세요")} className="write">글쓰기</a>
        
        <Footer/>
    </div>
    
    )
}






function TabContentSkeleton() {
    return (
        <div className="skeleton-container">
            <h3 className="skeleton-title"><Skeleton duration={1} width={300} height={100} /></h3>
            <h3 className="skeleton-title"><Skeleton duration={1} width={300} height={20} /></h3>
            <p className="skeleton-text"><Skeleton  duration={1} width={80} height={15} /></p>
            <p className="skeleton-text-small"><Skeleton  duration={1} width={60} height={15} /></p>
        </div>
    )
    }

    function TabContent(props,i) {
        
        return (
            <div className='novel-item'>
                <div className='novel-img-box'>
                <img src={props.bookData.bookImg} alt="" />
                </div>
                <div className='text-content'>
                <p className='novel-card-title'>{props.bookData.bookTitle}</p>
                <p className='novel-card-writer'>{props.bookData.username}</p>
                <p className='novel-card-price'>{Number(props.bookData.price).toLocaleString()}원</p>
                
                </div>
            </div>
            
        )
    
}

export default NovelContent