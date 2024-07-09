import { useEffect, useState } from "react";
import IssuesList from "./components/issuesList";
import IssuePanel from "./components/issuePanel";
import { LuCircleDashed } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa6";
import { FaCircleHalfStroke } from "react-icons/fa6";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import CreateNewProject from "../CreateNewProject/CreateNewProject";
import FilterSidebar from "./components/FilterSidebar";
import { changeIssueStage } from "../../redux/ProjectData/activeProjectIssuesSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const WorkspaceIssues = (props) => {
  const [toDoIssues, setToDoIssues] = useState([]);
  const [inProgressIssues, setInProgressIssues] = useState([]);
  const [backlogIssues, setBacklogIssues] = useState([]);
  const [doneIssues, setDoneIssues] = useState([]);
  const [cancelledIssues, setCancelledIssues] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const workspaceId = useSelector((state) => state.workspaceNameId.value.id);
  const [IssuesList, setIssueList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [ changeStatusVar, setChangeStatusVar] = useState(false);
  const dispatch=useDispatch();


 const moveIssue = (issueId, currentStatus, newStatus) => {
    console.log("Function moveIssue Called with status", { newStatus });
    console.log(issueId);
    updateIssueStatus(issueId, newStatus);

  };
  // console.log(workspaceId);

  useEffect(() => {
    if (workspaceId) {
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
          setIssueList(modifiedIssues);
          setFilteredList(modifiedIssues);
          props.setIssue(true);
          console.log(props.issue);

  
 

          const todoDummy = [];
          const inProgressDummy = [];
          const backlogDummy = [];
          const doneDummy = [];
          const cancelledDummy = [];
          modifiedIssues.forEach((issue) => {
            if (issue.stage === "ToDo") {
              todoDummy.push(issue);
            } else if (issue.stage === "InProgress") {
              inProgressDummy.push(issue);
            } else if (issue.stage === "Backlog") {
              backlogDummy.push(issue);
            } else if (issue.stage === "Cancelled") {
              cancelledDummy.push(issue);
            } else if (issue.stage === "Done") {
              doneDummy.push(issue);
            }
          });

          setToDoIssues(todoDummy);
          setInProgressIssues(inProgressDummy);
          setBacklogIssues(backlogDummy);
          setCancelledIssues(cancelledDummy);
          setDoneIssues(doneDummy);
          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching Issues:", error);
          // Handle errors as needed
        }
      };

      fetchIssues();
    }
  }, [workspaceId,changeStatusVar]);
  // console.log(IssuesList)


  const handleFilterAssignee = (name) => {
    setSelectedAssignee(name);
  };

  const handleFilterPriority = (priority) => {
    setSelectedPriority(priority);
  };

  const handleFilterProject = (projectid) => {
    setSelectedProject(projectid);
  };
  const handleClear = () => {
    setSelectedAssignee(null);
    setSelectedPriority(null);
    setSelectedProject(null);
  };
  

  useEffect(() => {
    if (IssuesList.length > 0) {
      const todoDummy = [];
      const inProgressDummy = [];
      const backlogDummy = [];
      const doneDummy = [];
      const cancelledDummy = [];

      let filteredList = IssuesList;
      if (selectedAssignee) {
        filteredList = filteredList.filter(
          (issue) => issue.assigneename.toLowerCase() === selectedAssignee.toLowerCase()
        );

      }
      if (selectedPriority) {
        filteredList = filteredList.filter(
          (issue) =>
            issue?.priority?.toLowerCase() === selectedPriority.toLowerCase()
        );
      }
      if (selectedProject) {
        filteredList = filteredList.filter(
          (issue) => issue?.projectname === selectedProject
        );
      }

      setFilteredList(filteredList);

      filteredList.forEach((issue) => {
        switch (issue.stage) {
          case "ToDo":
            todoDummy.push(issue);
            break;
          case "InProgress":

            inProgressDummy.push(issue);
            break;
          case "Backlog":
            backlogDummy.push(issue);
            break;
          case "Cancelled":
            cancelledDummy.push(issue);
            break;
          case "Done":
            doneDummy.push(issue);

            break;
          default:
            break;
        }
      });


      setToDoIssues(todoDummy);
      setInProgressIssues(inProgressDummy);
      setBacklogIssues(backlogDummy);
      setCancelledIssues(cancelledDummy);
      setDoneIssues(doneDummy);
      setDataLoaded(true);
    }
  }, [IssuesList, selectedAssignee, selectedPriority, selectedProject]);




  
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      // Send a PATCH request to update the issue status
      const response = await axios.patch(`${process.env. REACT_APP_BACKEND_BASE_URL}/issues/${issueId}/changeStatus`, { newStatus });
      // Handle the response
      if (response.status === 200) {
        console.log(response.data);
        setChangeStatusVar(previousValue => !previousValue);
        dispatch(changeIssueStage({ issueId: issueId, newStage: newStatus }));
      }
    } catch (error) {
      // Handle errors
      console.error('Error updating issue status:', error);
    }
  }


  return (
    
    <div className="bg-[#171e28] overflow-x-scroll px-2 pt-2">
      {dataLoaded && (
        <div className="flex flex-row w-screen">
          <div className="w-[320px] mx-1">
            <IssuePanel
              stageName="Backlog"
              issues={backlogIssues}
              onMoveIssue={moveIssue}
              icon={<LuCircleDashed />}
              isWorkspace={true}
            />
          </div>
          <div className="w-[320px] mx-1">
            <IssuePanel
              stageName="To Do"
              issues={toDoIssues}
              onMoveIssue={moveIssue}
              icon={<FaRegCircle />}
              isWorkspace={true}
            />
          </div>
          <div className="w-[320px] mx-1">
            <IssuePanel
              stageName="In Progress"
              issues={inProgressIssues}
              onMoveIssue={moveIssue}
              icon={<FaCircleHalfStroke />}
              iconColor="text-yellow-400"
              isWorkspace={true}
            />
          </div>
          <div className="w-[320px] mx-1">
            <IssuePanel
              stageName="Done"
              issues={doneIssues}
              onMoveIssue={moveIssue}
              icon={<FaRegCheckCircle />}
              iconColor="text-green-400"
              isWorkspace={true}
            />
          </div>
          <div className="w-[320px] mx-1">
            <IssuePanel
              stageName="Cancelled"
              issues={cancelledIssues}
              onMoveIssue={moveIssue}
              icon={<FaRegTimesCircle />}
              iconColor="text-red-400"
              isWorkspace={true}
            />
          </div>
          {props.showFilterSidebar && (
            <div className="overflow-y-scroll">
              <div className="fixed right-0 h-full overflow-y-scroll">
                <FilterSidebar
                  handleFilterAssignee={handleFilterAssignee}
                  handleClear={handleClear}
                  handleFilterPriority={handleFilterPriority}
                  handleFilterProject={handleFilterProject}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceIssues;
