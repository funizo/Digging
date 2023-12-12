import React, { useState, useEffect } from 'react';
// import useJwtDecode from '../../customHook/jwtDecode';
import CommentList from './commentList';
import jwt_decode from 'jwt-decode';
import './comment.css';

function Comment(props) {
    const [commentText, setCommentText] = useState('');
    const { comments, fetchPostDetail } = props;
    const postId = props.postId;
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // 토큰이 존재할 경우 디코드하여 사용자 정보 설정
            const decoded = jwt_decode(token);
            setUserInfo(decoded);
        }
    }, []);

    const handleCommentSubmit = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/board_detail/${postId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: postId,
                        content: commentText,
                        writerId: userInfo.id,
                        writer: userInfo.username,
                        // 추가로 필요한 댓글 정보
                    }),
                }
            );

            if (response.ok) {
                const result = await response.json();
                // CommentList 컴포넌트로 새로운 댓글 목록 전달
                props.onCommentSubmit(result.comments);
                // 댓글 작성이 성공적으로 처리됨
                // 필요한 경우, 새로운 댓글 목록을 서버로부터 다시 불러와 화면에 업데이트할 수 있음
            } else {
                console.error(
                    `Error adding comment. Status: ${response.status}`
                );
            }
        } catch (error) {
            console.error('Error adding comment:', error.message);
        }
        setCommentText('');
    };

    return (
        <div>
            <div>
                <div>
                    <label className="comment-label" htmlFor="comment">
                        댓글
                    </label>
                    <textarea
                        type="text"
                        className="comment-text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                </div>
                <div className="comment-button">
                    <button onClick={handleCommentSubmit}>댓글 쓰기</button>
                </div>
                <CommentList
                    postId={postId}
                    comments={comments}
                    userInfo={userInfo}
                    fetchPostDetail={fetchPostDetail}
                />
            </div>
        </div>
    );
}

export default Comment;
