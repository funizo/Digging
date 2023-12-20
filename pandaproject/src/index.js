import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

import Login from "./Page/loginPage/loginPage";
import Signup from "./components/signUpPage/signUpPage";
import MyPage from "./Page/myPage/myPage";
import Event from "./components/eventContent/event";

import Content from "./components/ContentItem/ContentItem";
import ContentDetail from "./components/ContentDetail/ContentDetail";
import ContentRegister from "./Page/ContentRegister/ContentRegister";
import ContentEdit from "./Page/ContentEdit/ContentEdit";

import Board from "./components/board/board";
import Write from "./components/board/write";
import BoardEdit from "./components/board/board_edit";
import BoardDetail from "./components/board/board_detail";
import Manager from "./Page/manager/manager";
import Rank from "./Page/Rank/rank";
import Privacy from "./Page/Privacy/privacy";
import Inquiry from "./Page/inquiry/inquiry";
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
      <Route path="/category/ticket" element={<Content Category="ticket" />} />

      <Route path="/register" element={<ContentRegister />} />

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
      <Route
        path="/category/ticket/detail/:id"
        element={<ContentDetail Category="ticket" />}
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
      <Route
        path="/edit/ticket/:id"
        element={<ContentEdit Category="ticket" />}
      />

      <Route path="/board/write" element={<Write />} />
      <Route path="/board_edit/:postId" element={<BoardEdit />} />
      <Route path="/board_detail/:postId" element={<BoardDetail />} />

      <Route path="/event" element={<Event />} />

      <Route path="/mypage" element={<MyPage />} />
      <Route path="/board" element={<Board />} />
      <Route path="/manager" element={<Manager />} />
      <Route path="/category/rank" element={<Rank />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/inquiry" element={<Inquiry />} />
      <Route path="*" element={<div>없는페이지에요</div>} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
