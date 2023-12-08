import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./Page/loginPage/loginPage";
import Signup from "./components/signUpPage/signUpPage";
import Book from "./components/bookContent/bookContent";
import BookDetail from "./components/bookDetail/bookDetail";
import BookRegister from "./Page/bookRegister/bookRegister";
import BookEdit from "./Page/bookEdit/bookEdit";
import Fashion from "./components/fashionContent/fashionContent";
import FashionDetail from "./components/fashionDetail/fashionDetail";
import FashionRegister from "./Page/fashionRegister/fashionRegister";
import FashionEdit from "./Page/fashionEdit/fashionEdit";
import Electronic from "./components/electronicContent/electronicContent";
import ElectronicRegister from "./Page/electronicRegister/electronicRegister";
import ElectronicDetail from "./components/electronicDetail/electronicDetail";
import ElectronicEdit from "./Page/electronicEdit/electronicEdit";
import Toy from "./components/toyContent/toyContent";
import ToyDetail from "./components/toyDetail/toyDetail";
import ToyRegister from "./Page/toyRegister/toyRegister";
import ToyEdit from "./Page/toyEdit/toyEdit";
import Goods from "./components/goodsContent/goodsContent";
import GoodsDetail from "./components/goodsDetail/goodsDetail";
import GoodsRegister from "./Page/goodsRegister/goodsRegister";
import GoodsEdit from "./Page/goodsEdit/goodsEdit";
import Category from "./components/category";
import reportWebVitals from "./reportWebVitals";
import MyPage from "./Page/myPage/myPage";
import Board from "./components/board/board";
import Edit from "./Page/edit/edit";
import Write from "./components/board/write";
import BoardEdit from "./components/board/board_edit";
import BoardDetail from "./components/board/board_detail";
import Manager from "./Page/manager/manger";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/category" element={<Category />} />
      <Route path="/category/book" element={<Book />} />
      <Route path="/category/book/bookdetail/:id" element={<BookDetail />} />
      <Route path="/bookregister" element={<BookRegister />} />
      <Route path="/bookedit/:id" element={<BookEdit />} />
      <Route path="/category/fashion" element={<Fashion />} />
      <Route
        path="/category/fashion/fashiondetail/:id"
        element={<FashionDetail />}
      />
      <Route path="/fashionregister" element={<FashionRegister />} />
      <Route path="/fashionedit/:id" element={<FashionEdit />} />
      <Route path="/category/electronic" element={<Electronic />} />
      <Route path="/electronicregister" element={<ElectronicRegister />} />
      <Route
        path="/category/electronic/electronicdetail/:id"
        element={<ElectronicDetail />}
      />
      <Route path="/electronicedit/:id" element={<ElectronicEdit />} />

      <Route path="/category/toy" element={<Toy />} />
      <Route path="/category/toy/toydetail/:id" element={<ToyDetail />} />
      <Route path="/toyregister" element={<ToyRegister />} />
      <Route path="/toyedit/:id" element={<ToyEdit />} />

      <Route path="/category/goods" element={<Goods />} />
      <Route path="/category/goods/goodsdetail/:id" element={<GoodsDetail />} />
      <Route path="/goodsregister" element={<GoodsRegister />} />
      <Route path="/goodsedit/:id" element={<GoodsEdit />} />
      <Route path="/board/write" element={<Write />} />
      <Route path="/board_edit/:postId" element={<BoardEdit />} />
      <Route path="/board_detail/:postId" element={<BoardDetail />} />
      <Route path="/edit/:id" element={<Edit />} />

      <Route path="/mypage" element={<MyPage />} />
      <Route path="/board" element={<Board />} />
      <Route path="/manager" element={<Manager />} />
      <Route path="*" element={<div>없는페이지에요</div>} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
