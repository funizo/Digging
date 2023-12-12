import Toolbar from '../../components/toolbar/toolbar';
import Footer from '../../components/footer/footer';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './write.css';

const EventWrite = ({ onPostSubmit }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = token ? jwt_decode(token) : null;
    const [eventData, setEventData] = useState({
        id: decoded?.id || '',
        number: '',
        title: '',
        content: '',
        writer: decoded?.username || '',
        views: '0',
        date: '',
    });
    console.log('eventData', eventData);

    const handleTitleChange = (e) => {
        setEventData((prevData) => ({
            ...prevData,
            title: e.target.value,
        }));
    };

    const handleContentChange = (e) => {
        setEventData((prevData) => ({
            ...prevData,
            content: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(
            'Received views:',
            eventData.views,
            'Type:',
            typeof eventData.views
        );
        console.log('123123');
        console.log('제목:', eventData.title);
        console.log('내용:', eventData.content);
        console.log('작성자:', eventData.writer);
        console.log('날짜:', eventData.date);
        console.log('id:', eventData.id);

        const numericViews = parseInt(eventData.views);
        try {
            const res = await fetch('http://localhost:8080/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...eventData, views: numericViews }),
            });

            if (res.ok) {
                console.log('글 전송 ok.');

                if (onPostSubmit) {
                    onPostSubmit();
                }
                navigate('/event');
            } else {
                console.error('글 전송 실패:', res.status);
            }
        } catch (error) {
            console.error('오류 발생:', error.message);
        }

        // 폼 초기화
        setEventData({
            id: '',
            number: '',
            title: '',
            content: '',
            writer: '',
            views: '0',
            date: '',
        });
    };

    return (
        <div>
            <Toolbar />
            <div className="write-container">
                <h2>글쓰기</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            type="text"
                            placeholder="제목을 입력해주세요"
                            value={eventData.title}
                            onChange={handleTitleChange}
                        />
                    </label>
                    <br />
                    <label>
                        <textarea
                            className="event-write"
                            value={eventData.content}
                            onChange={handleContentChange}
                        />
                    </label>
                    <br />
                    <button type="submit">글쓰기</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EventWrite;
