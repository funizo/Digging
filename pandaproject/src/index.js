import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

import Login from "./Page/loginPage/loginPage";
import Signup from "./components/signUpPage/signUpPage";
import MyPage from "./Page/myPage/myPage";

import Content from "./components/ContentItem/ContentItem";
import ContentDetail from "./components/ContentDetail/ContentDetail";
import ContentRegister from "./Page/ContentRegister/ContentRegister";
import ContentEdit from "./Page/ContentEdit/ContentEdit";

import Board from "./components/board/board";
import Write from "./components/board/write";
import BoardEdit from "./components/board/board_edit";
import BoardDetail from "./components/board/board_detail";
import Manager from "./Page/manager/manager";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/category/book" element={<Content Category="book" />} />
      <Route
        path="/category/fashion"
        element={<Content Category="fashion" />}
      />
      <Route
        path="/category/electronic"
        element={<Content Category="electronic" />}
      />
      <Route path="/category/toy" element={<Content Category="toy" />} />
      <Route path="/category/goods" element={<Content Category="goods" />} />

      <Route
        path="/register/book"
        element={<ContentRegister Category="book" />}
      />
      <Route
        path="/register/fashion"
        element={<ContentRegister Category="fashion" />}
      />
      <Route
        path="/register/electronic"
        element={<ContentRegister Category="electronic" />}
      />
      <Route
        path="/register/toy"
        element={<ContentRegister Category="toy" />}
      />
      <Route
        path="/register/goods"
        element={<ContentRegister Category="goods" />}
      />

      <Route
        path="/category/book/detail/:id"
        element={<ContentDetail Category="book" />}
      />
      <Route
        path="/category/fashion/detail/:id"
        element={<ContentDetail Category="fashion" />}
      />
      <Route
        path="/category/electronic/detail/:id"
        element={<ContentDetail Category="electronic" />}
      />
      <Route
        path="/category/toy/detail/:id"
        element={<ContentDetail Category="toy" />}
      />
      <Route
        path="/category/goods/detail/:id"
        element={<ContentDetail Category="goods" />}
      />

      <Route path="/edit/book/:id" element={<ContentEdit Category="book" />} />
      <Route
        path="/edit/fashion/:id"
        element={<ContentEdit Category="fashion" />}
      />
      <Route
        path="/edit/electronic/:id"
        element={<ContentEdit Category="electronic" />}
      />
      <Route path="/edit/toy/:id" element={<ContentEdit Category="toy" />} />
      <Route
        path="/edit/goods/:id"
        element={<ContentEdit Category="goods" />}
      />

      <Route path="/board/write" element={<Write />} />
      <Route path="/board_edit/:postId" element={<BoardEdit />} />
      <Route path="/board_detail/:postId" element={<BoardDetail />} />

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
