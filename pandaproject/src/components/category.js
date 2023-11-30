import { Outlet, Link } from "react-router-dom";

function Category() {
  return (
    <div>
      <div>카테고리</div>
      <Link to="novel">소설</Link>
      <Outlet></Outlet>
    </div>
  );
}

export default Category;
