import jwt_decode from 'jwt-decode';
import { useState, useEffect } from 'react';

const useJwtDecode = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
            const decoded = jwt_decode(token);
            setUserInfo(decoded);
        }
    }, []);

    return userInfo;
};

export default useJwtDecode;
