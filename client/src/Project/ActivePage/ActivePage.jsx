import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ActivePanel from "./components/ActivePanel";
import { FaRegCircle } from "react-icons/fa6";
import { FaCircleHalfStroke } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ActivePage = () => {
  const [toDoIssues, setToDoIssues] = useState([]);
  const [inProgressIssues, setInProgressIssues] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [changeStatusVar, setChangeStatusVar] = useState(false);
  const workspaceId = useSelector((state) => state.workspaceNameId.value.id);
  const moveIssue = (issueId, currentStatus, newStatus) => {
    console.log("Function moveIssue Called with status", { newStatus });
    console.log(issueId);
    updateIssueStatus(issueId, newStatus);

  };
  const navigate=useNavigate();


  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      // Send a PATCH request to update the issue status
      const response = await axios.patch(`${process.env. REACT_APP_BACKEND_BASE_URL}/issues/${issueId}/changeStatus`, { newStatus });
      // Handle the response
      if (response.status === 200) {
        console.log(response.data);
        setChangeStatusVar(previousValue => !previousValue);
      }
    } catch (error) {
      // Handle errors
      console.error('Error updating issue status:', error);
    }
  }
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
    else if (workspaceId) {
      const fetchIssues = async () => {
        try {
          const response = await axios.get(
            `${process.env. REACT_APP_BACKEND_BASE_URL}/api/users/workspace/issues`,
            {
              params: {
                activeWorkspaceId: workspaceId,
              },
              withCredentials: true,
            }
          );
          const data = response.data;
          const modifiedIssues = data.map(issue => {
            // Extract the last four characters from the ID string
            const lastFourDigits = issue._id.slice(-4);
            const projectname=issue.projectname;
            // console.log(projectname);
    
            // Return the issue object with the modified ID
            return { ...issue, id: lastFourDigits,projectname:projectname };
          });
         

  
 

          const todoDummy = [];
          const inProgressDummy = [];
       
          modifiedIssues.forEach((issue) => {
            if (issue.stage === "ToDo") {
              todoDummy.push(issue);
            } else if (issue.stage === "InProgress") {
              inProgressDummy.push(issue);
            } 
          });

          setToDoIssues(todoDummy);
          setInProgressIssues(inProgressDummy);
        
          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching Issues:", error);
          // Handle errors as needed
        }
      };

      fetchIssues();
    }
  }, [workspaceId,changeStatusVar]);
 

  return (
    <div className="bg-[#171e28] overflow-x-scroll h-screen pl-10">
      {dataLoaded && (
        <div className="flex flex-row w-screen">
          <div className="w-[320px]">
            <ActivePanel
              stageName="To Do"
              issues={toDoIssues}
              onMoveIssue={moveIssue}
              icon={<FaRegCircle />}
              isWorkspace={true}
              
            />
          </div>
          <div className="w-[320px]">
            <ActivePanel
              stageName="In Progress"
              issues={inProgressIssues}
              onMoveIssue={moveIssue}
              icon={<FaCircleHalfStroke />}
              iconColor="text-yellow-400"
              isWorkspace={true}
              
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivePage;
