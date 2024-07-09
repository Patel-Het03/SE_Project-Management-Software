import React from "react";
import { useState, useEffect } from "react";
import IssuePanel from "../../../Workspace/workspaceIssues/components/issuePanel";
import IssuesList from "../../../Workspace/workspaceIssues/components/issuesList";
import { LuCircleDashed } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa6";
import { FaCircleHalfStroke } from "react-icons/fa6";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { changeActiveProjectIssue } from "../../../redux/ProjectData/activeProjectIssuesSlice";
import FilterSidebar from "../Component/FilterSidebar";
import Loader from '../../../loading';
import { changeIssueStage } from "../../../redux/ProjectData/activeProjectIssuesSlice";


export default function ProjectIssues(props) {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.activeProject.value._id);
  // console.log(projectId);
  const activeProjectAllIssues = useSelector((state) => state.activeProjectIssues.value);
  const projectname = useSelector((state) => state.activeProject.value.name);
  // console.log("asuidgfuigasdf"+activeProjectAllIssues);
  // console.log(projectId)
  // console.log(projectname);
  const [ changeStatusVar, setChangeStatusVar ] = useState(false);

  
  const [ issues, setIssues ] = useState([
    { id: 1, title: 'Issue 1', description: 'Description 1', assignee: 'Ayush Sahu', stage: 'Backlog',priority:"Urgent", projectname:projectname },
    { id: 1, title: 'Issue 1', description: 'Description 1', assignee: 'Ayush Sahu', stage: 'Backlog',priority:"Urgent", projectname:projectname },
    { id: 1, title: 'Issue 1', description: 'Description 1', assignee: 'Ayush Sahu', stage: 'Backlog',priority:"Urgent", projectname:projectname },
    { id: 1, title: 'Issue 1', description: 'Description 1', assignee: 'Ayush Sahu', stage: 'Backlog',priority:"Urgent", projectname:projectname },
    { id: 1, title: 'Issue 1', description: 'Description 1', assignee: 'Ayush Sahu', stage: 'Backlog',priority:"Urgent", projectname:projectname },

    // { id: 1, title: 'Issue 1', description: 'Description 1', assignee: 'Ayush Sahu', stage: 'Backlog',priority:"urgent" },
    { id: 2, title: 'Issue 1', description: 'Description 1', assignee: 'Chetan Kamble', stage: 'Backlog',priority:"Medium", projectname:projectname },
    { id: 3, title: 'Issue 3', description: 'Description 1', assignee: 'Het Patel', stage: 'ToDo',priority:"Low", projectname:projectname },
    { id: 12, title: 'Issue 12', description: 'Description 1', assignee: 'John Doe', stage: 'InProgress' ,priority:"High", projectname:projectname},
    { id: 15, title: 'Issue 51', description: 'Description 1', assignee: 'John Doe', stage: 'Done',priority:"Low", projectname:projectname },
    { id: 17, title: 'Issue 17', description: 'Description 1', assignee: 'John Doe', stage: 'Cancelled',priority:"Urgent", projectname:projectname },

  ]);

  const [filteredList,setFilteredList]=useState(issues);

  const [backlogIssues, setBacklogIssues] = useState([]);
  const [toDoIssues, setToDoIssues] = useState([]);
  const [inProgressIssues, setInProgressIssues] = useState([]);
  const [doneIssues, setDoneIssues] = useState([]);
  const [cancelledIssues, setCancelledIssues] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  useEffect(()=>{

    if (issues.length > 0) {
      const todoDummy = [];
      const inProgressDummy = [];
      const backlogDummy = [];
      const doneDummy = [];
      const cancelledDummy = [];

      let filteredList = issues;
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
      // setDataLoaded(true);
    }
  }, [issues, selectedAssignee, selectedPriority]);


 
  const handleFilterAssignee = (name) => {
    setSelectedAssignee(name);
  };

  const handleFilterPriority = (priority) => {
    setSelectedPriority(priority);
  };

  const handleClear = () => {
    setSelectedAssignee(null);
    setSelectedPriority(null);
  };
  

  const moveIssue = (issueId, currentStatus, newStatus) => {
    console.log("Function moveIssue Called with status", { newStatus });
    console.log(issueId);
    updateIssueStatus(issueId, newStatus);
  };


  useEffect(() => {
    // console.log("hello"+projectId);
    if (projectId) {
      const modifiedIssues = activeProjectAllIssues.map(issue => {
        // Extract the last four characters from the ID string
        const lastFourDigits = issue._id.slice(-4);

        // Return the issue object with the modified ID
        return { ...issue, id: lastFourDigits ,projectname:projectname};
      });
      const backlogIssues = [];
      const toDoIssues = [];
      const inProgressIssues = [];
      const doneIssues = [];
      const cancelledIssues = [];
      setIssues(modifiedIssues);
      setFilteredList(modifiedIssues);

      modifiedIssues.forEach(issue => {
        switch (issue.stage) {
          case 'Backlog':
            backlogIssues.push(issue);
            break;
          case 'ToDo':
            toDoIssues.push(issue);
            break;
          case 'InProgress':
            inProgressIssues.push(issue);
            break;
          case 'Done':
            doneIssues.push(issue);
            break;
          case 'Cancelled':
            cancelledIssues.push(issue);
            break;
          default:
            break;
        }
      });

      setBacklogIssues(backlogIssues);
      setToDoIssues(toDoIssues);
      setInProgressIssues(inProgressIssues);
      setDoneIssues(doneIssues);
      setCancelledIssues(cancelledIssues);
    }
  }, [projectId, changeStatusVar,activeProjectAllIssues]);
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      // Send a PATCH request to update the issue status
      const response = await Axios.patch(`${process.env. REACT_APP_BACKEND_BASE_URL}/issues/${issueId}/changeStatus`, { newStatus });
      // Handle the response
      if (response.status === 200) {
        // console.log(response.data);
        dispatch(changeIssueStage({ issueId: issueId, newStage: newStatus }));
        setChangeStatusVar(previousValue => !previousValue);
        // console.log("hellokwdjgc");
      }
    } catch (error) {
      // Handle errors
      console.error('Error updating issue status:', error);
    }
  }

  return (
    // issues={backlogIssues} onMoveIssue={moveIssue}
    <>
      {{ projectId } ?
        <div className="bg-[#171e28] overflow-x-scroll pt-2 px-2 h-full ">
          <div className="flex flex-row w-screen">
            <div className="w-[320px] mx-1">
              <IssuePanel
                stageName="Backlog"
                issues={backlogIssues}
                onMoveIssue={moveIssue}
                icon={<LuCircleDashed />}
                isWorkspace={false}
              />
            </div>
            <div className="w-[320px] mx-1">
              <IssuePanel
                stageName="To Do"
                issues={toDoIssues}
                onMoveIssue={moveIssue}
                icon={<FaRegCircle />}
                isWorkspace={false}
              />
            </div>
            <div className="w-[320px] mx-1">
              <IssuePanel
                stageName="In Progress"
                issues={inProgressIssues}
                onMoveIssue={moveIssue}
                icon={<FaCircleHalfStroke />}
                iconColor="text-yellow-400"
                isWorkspace={false}
              />
            </div>
            <div className="w-[320px] mx-1">
              <IssuePanel
                stageName="Done"
                issues={doneIssues}
                onMoveIssue={moveIssue}
                icon={<FaRegCheckCircle />}
                iconColor='text-green-400'
                isWorkspace={false}
              />
            </div>
            <div className="w-[320px] mx-1">
              <IssuePanel
                stageName="Cancelled"
                issues={cancelledIssues}
                onMoveIssue={moveIssue}
                icon={<FaRegTimesCircle />}
                iconColor='text-red-400'
                isWorkspace={false}
              />
            </div>
     
          {props.showFilterSidebar && <div className="overflow-y-scroll" >
              <div className=" fixed right-0 h-full overflow-y-scroll z-10">
        
             <FilterSidebar 
             handleFilterAssignee={handleFilterAssignee} handleClear={handleClear} handleFilterPriority={handleFilterPriority} 
             />
             {/* <FilterSidebar /> */}
         
         </div>
        
       </div>}
           
       
        </div>
  
        </div> : <Loader />
      }
    </>
  );

}