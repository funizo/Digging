import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./Page/loginPage/loginPage";
import Signup from "./components/signUpPage/signUpPage";
import Book from "./components/bookContent/bookContent";
import Category from "./components/category";
import BookDetail from "./components/bookDetail/bookDetail";
import BookRegister from "./Page/bookRegister/bookRegister";
import reportWebVitals from "./reportWebVitals";
import MyPage from "./Page/myPage/myPage";
import Board from "./components/board/board";
import Edit from "./Page/edit/edit";
import Manager from "./Page/manager/manger";
import Write from "./components/board/write";
import BoardEdit from "./components/board/board_edit";
import BoardDetail from "./components/board/board_detail";

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
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/board" element={<Board />} />
      <Route path="/board/write" element={<Write />} />
      <Route path="/bookRegister" element={<BookRegister />} />{" "}
      <Route path="/board/write" element={<Write />} />
      <Route path="/board_edit/:postId" element={<BoardEdit />} />
      <Route path="/board_detail/:postId" element={<BoardDetail />} />
      <Route path="*" element={<div>없는페이지에요</div>} />
      <Route path="/edit/:id" element={<Edit />} />
      <Route path="/manager" element={<Manager />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
