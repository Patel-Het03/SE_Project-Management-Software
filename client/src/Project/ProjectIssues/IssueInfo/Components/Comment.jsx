import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

function Comment() {
  const [commentInput, setCommentInput] = useState("");
  const activeIssue = useSelector((state) => state.activeIssue.value);
  const [assigne, setAssigne] = useState("");
  const [commentList, setCommentList] = useState([
    { commentText: "Apple", commentedBy: "Dummy User" },
    { commentText: "Banana", commentedBy: "Dummy User" },
    { commentText: "Orange", commentedBy: "Dummy User" },
    { commentText: "Grapes", commentedBy: "Dummy User" },
  ]);

  const assigneeChange = (e) => {
    e.preventDefault();
    console.log("assignee");
  };

  const subscribeToIssue = (e) => {
    e.preventDefault();
    console.log("subscribe");
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (commentInput !== "") {
      const newComment = { commentText: commentInput, commentedBy: assigne }; 
      try {
        // Make a POST request to the add comment API
        const response = await axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/comment`, {
          issueId: activeIssue._id, // replace with actual issue ID
          comment: newComment
        }, {
          withCredentials: true
        });
  
        // Update the comment list with the new comment
        setCommentList(prevList => [...prevList, newComment]);
        setCommentInput("");
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/comments`, {
          params: {
            issueId: activeIssue._id, // replace with actual issue ID
          },
          withCredentials: true
        });
  
        setCommentList(response.data.comments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
  
    fetchComments();
  }, []);
  
  

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/users/profile`, {
          params: {
            activeIssueId: activeIssue._id,
          },
          withCredentials: true,
        });
    
        const assigneeUsername = response.data;
        console.log(assigneeUsername);
        const username = assigneeUsername.username;
        
        setAssigne(username);
        console.log("details", assigneeUsername.assigneeUser.username);
      } catch (error) {
        console.error('Failed to fetch issue:', error);
      }
    };
  
    fetchIssue();
  }, []);

  const topCommentTitle = {
    display: "flex",
    justifyContent: "space-between",
    color: "white",
  };

  const commentFontStyle = {
    display: "flex",
    color: "white",
    padding: "4px",
    overflowWrap: "break-word",
  };

  const textStyleComment = {
    padding: "2px",
    wordBreak: "break-word", 
  };

  const submitButtonStyle = {
    marginLeft: "4px",
    marginRight: "4px",
    paddingBottom: "4px",
    paddingTop: "1px",
    paddingLeft: "12px",
    paddingRight: "12px",
    borderRadius: "0.25rem",
    // border: "1px solid gray ",
  };
 
  

  return (
    <div className="bg-gray-900 h-full m-2 mt-0">
      <div className="p-2">
        {/* Top Section */}
        <div className="topCommentTitle" style={topCommentTitle}>
          <div className="justify-self-start">Comments</div>
          <div className="justify-self-end">
            <button
              className="text-xs p-1 rounded-sm hover:bg-gray-800"
              onClick={subscribeToIssue}
            >
              Subscribe
            </button>
            <button
              className="text-xs ml-2 p-1 rounded-sm hover:bg-gray-800"
              onClick={assigneeChange}
            >
              {assigne}
            </button>
          </div>
        </div>

        {/* Comment Section */}
        <div className="p-2">
          <div className="commentSection" style={commentFontStyle}>
            <ul className="text-sm">
              {commentList.map((comment, index) => (
                <li key={index} style={textStyleComment}>
                  <strong>{comment.commentedBy}:</strong> {comment.commentText}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comment Input Section */}
        <div className="w-full">
          <form
            onSubmit={addComment}
            style={{
              width: "100%",
              backgroundColor: "gray-800",
              padding: "4px",
              color: "white",
              border: "1px solid gray ",
              borderRadius: "5px",
            }}
          >
            <div style={{ width: "95%" }}>
              <input
                type="text"
                placeholder="Write Comment"
                style={{
                  margin: "10px",
                  width: "100%",
                  background: "none",
                  border: "none",
                  outline: "none",
                }}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div style={{ width: "98%" }}>
              <div
                style={{
                  display: "flex",
                  marginBottom: "4px",
                  marginLeft: "2px",
                  marginRight: "2px",
                  padding: "1px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="submit"
                  className="text-sm bg-gray-800"
                  style={submitButtonStyle}
                >
                  Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comment;
