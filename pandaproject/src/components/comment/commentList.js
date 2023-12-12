import './commentList.css';
import React, { useEffect } from 'react';

function CommentList(props) {
    const { comments, userInfo, postId, fetchPostDetail } = props;
    const userInfoId = userInfo ? userInfo.id : null;
    const manager = '65703c972d7eba2e853faa06';
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/board_detail/${postId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // 버튼 상태 정보를 요청에 실어 보냄
                        commentId: commentId,
                        action: 'deleteComment',
                    }),
                }
            );

            if (response.ok) {
                fetchPostDetail();
            } else {
                const errorMessage = await response.text();
                console.error(
                    `삭제하지 못했습니다. Status: ${response.status}, Message: ${errorMessage}`
                );
            }
        } catch (error) {
            console.error('삭제 에러 post:', error.message);
        }
    };

    useEffect(() => {
        // comments를 사용하여 필요한 작업 수행
        console.log('comments', comments);
    }, [comments]);

    return (
        <div>
            <div>
                <div>
                    {comments &&
                        comments.map((comment) => (
                            <div key={comment._id}>
                                <p>{comment.writer}</p>
                                <p>{comment.content}</p>
                                {(comment.writerId === userInfoId ||
                                    userInfoId === manager) && (
                                    <button
                                        onClick={() =>
                                            handleDeleteComment(comment._id)
                                        }
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default CommentList;
