import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./Inbox.css";
import InboxIssues from './InboxIssues';
//import IssueInfo from './Issue_Info';
import IssueInfo from "../../Project/ProjectIssues/IssueInfo/IssueInfo";
import { useSelector,useDispatch } from "react-redux";

// import { Axios } from "axios";
import axios from "axios";

const Inbox = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    const isUserLoggedIn = () => {
      const cookies = document.cookie.split(";");
      console.log(document.cookie);
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("usertoken=")) {
          const token = cookie.substring("usertoken=".length, cookie.length);
          // If token has some value, return true indicating user is logged in
          if (token) {
            return true;
          }
        }
      }
      // If no token found or token is empty, return false
      return false;
    };

    // Check if the user is logged in
    const isLoggedIn = isUserLoggedIn();
    console.log(isLoggedIn);
    if (!isLoggedIn) {
      navigate("/login");
    }
    else{
      fetchInboxMessages();
    }
  },[]);
  
  const [messages, setMessages] = useState([]);
  const [filteredList, setFilteredList] = useState([]); 
   
    const fetchInboxMessages = async () => {
        try {
            const response = await axios.get(
                `${process.env. REACT_APP_BACKEND_BASE_URL}/api/issues/user`,
                { withCredentials: true }
            );
            const data = response.data.messages; // Assuming the response structure
            setMessages(data);
        } catch (error) {
            console.error('Error fetching inbox messages:', error);
            // Handle errors as needed
            const dummyMessages = [
              {
                  id: 1,
                  title: 'Dummy Issue 1',
                  description: 'This is a dummy issue 1',
                  creator: 'Admin',
                  assigneeUsername: 'JohnDoe',
                  stage: 'Backlog',
                  priority: 'Low',
                  dueDate: new Date(),
                  projectId: 1,
                  projectTitle: 'Project A'
              },
              {
                  id: 2,
                  title: 'Dummy Issue 2',
                  description: 'This is a dummy issue 2',
                  creator: 'Admin',
                  assigneeUsername: 'JaneDoe',
                  stage: 'ToDo',
                  priority: 'High',
                  dueDate: new Date(),
                  projectId: 2,
                  projectTitle: 'Project B'
              }
              // Add more dummy data as needed
          ];
          setMessages(dummyMessages);
        }
    };



  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showIssueInfo, setShowIssueInfo] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filterOption, setFilterOption] = useState('all'); // Default filter option

  

  const handleSelectMessage = (messageId) => {
    setSelectedMessageId(messageId);
    setShowIssueInfo(true);
  };

  const handleCloseIssueInfo = () => {
    setSelectedMessageId(null);
    setShowIssueInfo(false);
  };

  // Function to filter messages based on search input and filter option
  const filteredMessages = messages.filter(message => {
    // Filter by search input
    const searchMatch = message.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                       message.priority.toLowerCase().includes(searchInput.toLowerCase()) ||
                       message.stage.toLowerCase().includes(searchInput.toLowerCase());
    // Filter by filter option
    const filterMatch = filterOption === 'all' || 
                        (filterOption === 'read' && message.isRead) ||
                        (filterOption === 'unread' && !message.isRead);
    return searchMatch && filterMatch;
  });

  // Filter by assignee
const handleFilterAssignee = (name) => {
  setFilteredList(messages.filter((message) => {
    // Check if assigneeUsername is defined before accessing toLowerCase()
    return message.assigneeUsername && message.assigneeUsername.toLowerCase() === name.toLowerCase();
  }));
};


// Filter by project
const handleFilterProject = (projectId) => {
  setFilteredList(messages.filter((message) => {
    // Check if projectId is defined before accessing it
    return message.projectId === projectId;
  }));
};

  
const selectedMessage = messages.find(message => message.id === selectedMessageId);



  return (
    <div className="inbox-container bg-navy-700">
      <div className="inbox-content">
        <div className="message-list">
          {/* Search Input */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            
      
            <div className="filter-dropdown">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="all">All</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
      <div className="dropdown-arrow"></div> {/* Arrow indicating dropdown */}
    </div>
          </div>
          {/* Message List */}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className='flex justify-end mx-2'>
          <div onClick={props.onCloseInbox} className="close-button">
              &#x2716;   
            </div>
            <br></br>
            </div>
          <h2 className="inbox-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H28V28H4Z" fill="#007BFF" />
              <path d="M22 6L16 12L10 6L9 7L13 11L22 6Z" fill="#fff" />
              <path d="M12 18L8 22L7 21L11 17L16 21L15 22L12 18Z" fill="#fff" />
            </svg>
            Inbox
          </h2>
          <ul>
            {filteredMessages.map((message) => (
              <li
                key={message.id}
                className={`message-item ${selectedMessageId === message.id ? 'selected' : ''}`}
                onClick={() => handleSelectMessage(message.id)}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="message-sender">{message.title}</div>
                <div className="message-subject">{message.stage}</div>
                {message.isRead && <div className="message-unread-dot"></div>}
              </li>
            ))}
          </ul>
        </div>
        {showIssueInfo && selectedMessage &&(
          
          <div className="issue-info">
           {/* <div onClick={handleCloseIssueInfo} className="close-button">
              &#x2716;
            </div>
              
                
                {messages.find(message => message.id === selectedMessageId) && (
                  <div key={selectedMessageId}>
                   
                    <h1>{messages.find(message => message.id === selectedMessageId).title}</h1><br></br>
                    <div className="message-task">
                      <h2>Task Details:</h2><br></br>
                      <p><strong>Task ID:</strong> {messages.find(message => message.id === selectedMessageId).id}</p><br></br>
                      <p><strong>Task Name:</strong> {messages.find(message => message.id === selectedMessageId).title}</p><br></br>
                      <p><strong>Deadline:</strong> {messages.find(message => message.id === selectedMessageId).dueDate}</p><br></br>
                      <p><strong>Status:</strong> {messages.find(message => message.id === selectedMessageId).stage}</p><br></br>
                    </div>
                    <div className="message-body">
                      <h2>Message Body:</h2>
                      <p>{messages.find(message => message.id === selectedMessageId).description}</p>
                    </div>
                  </div>
                )}*/}
              


              <div className="message-details">
              <IssueInfo message={messages.find(message => message.id === selectedMessageId)} onClick={handleCloseIssueInfo}
                />
              </div>
              
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;


  