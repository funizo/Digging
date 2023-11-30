import novel from "../../data/novel";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import Toolbar from "../toolbar/toolbar";
import "./novelContent.css";
import Footer from "../footer/footer";

function NovelContent() {
  const navigate  = useNavigate();
  const [novelData, setNovelData] = useState(novel);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const timer = setTimeout(() => {
          setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
  }, []);

  const goToBookDetail = (id, bookData) => {
      navigate(`/category/novel/detail/${id}`, { state: { bookData } });
      console.log('bookData',id)
  }

  return(
      
      <div className='novel'>
          <Toolbar/>
          <h2>소설</h2>
          {loading ? (
              novelData.map((_, i) => (
                  <div className="image-container" key={i}>
                      <TabContentSkeleton />
                  </div>
      ))
  ) : (
      <div className="novel-container">
      {novelData.map((a, i) => (
          <div className="image-container" key={i} onClick={() => goToBookDetail(a.id, a)}>
          {/* <Link to={`././detail/${a.id}`} key={a.id}> */}
              <TabContent key={i} novelData={novelData[i]} i={i} />
          {/* </Link> */}
      </div>
      
      ))}
          </div>
      )}
      
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
              <img src={props.novelData.img} alt=""/>
              </div>
              <div className='text-content'>
              <p className='novel-card-category'>{props.novelData.category}</p>
              <p className='novel-card-title'>{props.novelData.title}</p>
              <p className='novel-card-writer'>{props.novelData.writer}</p>
              <p className='novel-card-price'>{Number(props.novelData.price).toLocaleString()}원</p>
              
              </div>
          </div>
          
      )
  
}

export default NovelContent