import React from "react";
import "./footer.css";
import { Nav, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <div id="logo">
        <img
          src={`${
            process.env.PUBLIC_URL
          }/img/logo-digging.png?${new Date().getTime()}`}
          alt="로고"
        />
      </div>

      <Navbar>
        <Nav id="footer2">
          <Nav.Link href="/privacy">이용약관</Nav.Link>
          <Nav.Link href="/privacy">개인정보처리방침</Nav.Link>
          <Nav.Link href="/privacy">청소년보호정책</Nav.Link>
          <Nav.Link href="/inquiry">문의사항</Nav.Link>
        </Nav>
      </Navbar>
    </footer>
  );
};

export default Footer;
