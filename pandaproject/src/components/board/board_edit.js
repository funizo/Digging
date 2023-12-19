import Toolbar from '../../components/toolbar/toolbar';
import Footer from '../../components/footer/footer';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './board_edit.css';

const BoardEdit = () => {
    const { postId } = useParams();
    const [postDetail, setPostDetail] = useState({
        title: '',
        content: '',
    });
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // 실제로 수정할 때 서버로 데이터를 전송하는 로직이 필요합니다.
        try {
            const response = await fetch(
                `http://localhost:8080/board_edit/${postId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: postDetail.title,
                        content: postDetail.content,
                    }),
                }
            );

            if (response.ok) {
                // 수정이 성공하면 다른 페이지로 이동 또는 다른 로직 수행
                navigate(`/board_detail/${postId}`);
            } else {
                const errorMessage = await response.text();
                console.error(
                    `수정 실패. Status: ${response.status}, Message: ${errorMessage}`
                );
            }
        } catch (error) {
            console.error('Error editing post:', error.message);
        }
    };

    return (
        <div>
            <Toolbar />
            <div className="edit-container">
                <h2>글 수정하기</h2>
                <form onSubmit={handleFormSubmit}>
                    <label>
                        <input
                            type="text"
                            placeholder="제목을 입력해주세요"
                            value={postDetail.title}
                            onChange={(e) =>
                                setPostDetail({
                                    ...postDetail,
                                    title: e.target.value,
                                })
                            }
                        />
                    </label>
                    <br />
                    <label>
                        <textarea
                            className="board-text"
                            placeholder="내용을 입력해주세요"
                            value={postDetail.content}
                            onChange={(e) =>
                                setPostDetail({
                                    ...postDetail,
                                    content: e.target.value,
                                })
                            }
                        />
                    </label>
                    <br />
                    <button type="submit">글 수정하기</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default BoardEdit;
