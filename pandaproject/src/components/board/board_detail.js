import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./write.css";

function BoardDetail() {
    return(
        <div>
            <Toolbar/>
            <Footer/>
        </div>
    )
}
export default BoardDetail