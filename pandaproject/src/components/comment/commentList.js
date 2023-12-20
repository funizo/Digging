import "./commentList.css";
import React, { useState } from "react";
import formatTimeAgo from "../formatTime/formatTimeAgo";
import "./commentList.css";

function CommentList(props) {
  const { comments, userInfo, postId, fetchPostDetail, getPlaceholderText } =
    props;
  const userInfoId = userInfo ? userInfo.id : null;
  const manager = "65703c972d7eba2e853faa06";
  const [showComment, setShowComment] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  console.log("comments-commentlist.js", comments);
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/board_detail/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId: commentId,
            action: "deleteComment",
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
      console.error("삭제 에러 post:", error.message);
    }
  };
  console.log("comments-list", comments);

  const handleAddComment = (commentId) => {
    setSelectedCommentId(commentId);
    setShowComment((prevShowComment) => !prevShowComment);
  };

  const handleAddReply = async () => {
    // replyContent를 서버에 전송하고, 댓글 목록을 갱신
    try {
      const response = await fetch(
        `http://localhost:8080/board_detail/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            parentId: selectedCommentId,
            writerId: userInfoId,
            writer: userInfo.username,
            content: replyContent,
            date: "",
            action: "addReply",
          }),
        }
      );

      if (response.ok) {
        fetchPostDetail();
        setShowComment(false); // 댓글 달기 폼 감추기
        setReplyContent(""); // 입력 내용 초기화
      } else {
        const errorMessage = await response.text();
        console.error(
          `댓글을 추가하지 못했습니다. Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("댓글 추가 에러:", error.message);
    }
  };

  const formattedComments = comments
    ? comments.map((comment) => {
        const formattedTime = formatTimeAgo(comment.date);
        return {
          ...comment,
          formattedTime: formattedTime,
        };
      })
    : [];

  formattedComments.sort((a, b) => new Date(b.date) - new Date(a.date));
  function findReplies(parentId) {
    return formattedComments.filter((comment) => comment.parentId === parentId);
  }

  function sortCommentsByPostAndParentId(comments, depth = 0) {
    let sortedComments = [];

    let originalComments = comments.filter((comment) => !comment.parentId);
    originalComments.forEach((originalComment) => {
      sortedComments.push(originalComment);

      let replies = findReplies(originalComment._id);
      replies.forEach((reply) => {
        console.log("reply", reply);
        sortedComments.push(reply);
      });
    });

    return sortedComments;
  }
  let sortedComments = sortCommentsByPostAndParentId(formattedComments);
  console.log("sortedComments", sortedComments);

  return (
    <div>
      <div className="commentList-container">
        <div className="commentList-box">
          {sortedComments &&
            sortedComments.map((comment) => (
              <div
                className="commentList-subBox"
                key={comment._id}
                style={{
                  marginLeft: `${comment.depth * 20}px`,
                }}
              >
                <div className="commentList-inofBox">
                  <div className="commentList-info">
                    <p className="commentList-writer">{comment.writer}</p>
                    <p className="commentList-date">{comment.formattedTime}</p>

                    <p className="commentList-content">{comment.content}</p>
                  </div>
                  <div className="commentList-buttonBox">
                    <button
                      className="commentList-commentButton"
                      onClick={() => handleAddComment(comment._id)}
                    >
                      {showComment === true ? "댓글 닫기" : "댓글 달기"}
                    </button>
                    {(comment.writerId === userInfoId ||
                      userInfoId === manager) && (
                      <button
                        className="commentList-deleteButton"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                {selectedCommentId === comment._id && showComment && (
                  <div className="commentList-inputBox">
                    <input
                      className="commentList-input"
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={getPlaceholderText(userInfo)}
                    />
                    <div className="commentList-addCommentBox">
                      <button
                        className="commentList-addComment"
                        onClick={handleAddReply}
                      >
                        댓글 추가
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CommentList;
