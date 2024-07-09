import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Dropdown from "../../../../Components/Layout/DropDown/dropdown";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../loading"

function formatDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

function RightBar() {
  const activeProjectMembers = useSelector(
    (state) => state.activeProjectAllMember.value
  );
  const sprintList = useSelector(
    (state) => state.activeProjectSprintList.value
  );
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [status, setStatus] = useState(null);
  const [state, setstatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [priority, setpriority] = useState(null);
  const [date, setdate] = useState(null);
  const [Assigne, setAssigne] = useState("");
  const [Label, setLabel] = useState("");
  const [title, setTitle] = useState("");
  const [projectname, setprojectname] = useState("");
  const activeIssue = useSelector((state) => state.activeIssue.value);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth <= 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const projectOptions = [
    "Project 1",
    "Project 2",
    "Project 3",
    "Project 4",
    "Project 5",
  ];
  const initialSelectedProjectOption = "Project 1";

  const statusOptions = ['Backlog','ToDo','InProgress','Done','Cancelled'];

  const PriorityOptions = ["No priority", "Urgent", "High", "Medium", "Low"]; // Your options array
  const initialSelectedPriorityOption = "No priority"; // Initial selected option

  const AssigneOptions = ["Het", "Kushagra", "Nikhil"]; // Your options array
  const initialSelectedAssigneOption = "Het"; // Initial selected option

  const LabelOptions = ["Improvement", "Feature", "Bug", "None"]; // Your options array
  const initialSelectedLabelOption = "None"; // Initial selected option

  const sprintOptions = [
    "sprint 1",
    "sprint 2",
    "sprint 3",
    "sprint 4",
    "sprint 5",
    "sprint 6",
    "sprint 7",
    "sprint 8",
  ]; // Your options array
  const initialSelectedCycleOption = "CHEtan";

  const [dueDate, setStartDate] = useState(formatDate("22/03/2024"));

  useEffect(() => {
    fetchStatus(); // Fetch status when component mounts
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/description`,
        {
          params: {
            activeIssueId: activeIssue._id,
          },
          withCredentials: true,
        }
      );

      const assigneeUsername = response.data;
      console.log("piysugh", assigneeUsername);
      console.log("assigner", assigneeUsername.issue.label);
      const fetchedStatus = assigneeUsername.issue.stage;
      console.log("fetchedsteatsus", fetchedStatus);
      const fetchedPriority = assigneeUsername.issue.priority;
      const dateinfo = assigneeUsername.issue.dueDate;
      const assigner = assigneeUsername.issue.assigneeUserID;
      const label = assigneeUsername.issue.label;
      console.log("label", label);
      const projid = assigneeUsername.issue.projectId;

      const response2 = await axios.get(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/details`,
        {
          params: {
            id: assigner,
            projectId: projid,
          },
          withCredentials: true,
        }
      );
      console.log("piyushddd", response2.data);
      setprojectname(response2.data.projectName);
      const assignename = response2.data.user.name;
      setAssigne(assignename);
      console.log("assigner", assigner);
      console.log("fetchedPrddddddiority", assigneeUsername);
      setStatus(fetchedStatus); // Set status
      setpriority(fetchedPriority); // Set status
      setdate(dateinfo); // Set status
      setLabel(label); // Set label
      const title = assigneeUsername.issue.title;
      console.log("label", label);
      setTitle(title);
      setIsLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      console.error("Failed to fetch issue:", error);
      setIsLoading(false); // Set loading state to false if there's an error
    }
  };

  // Function to update issue details
  const updateIssueDetails = async (update) => {
    try {
      // Make a PUT request to the update issue details API
      console.log("activnesss", activeIssue._id);
      const response = await axios.put(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/updateDescription`,
        {
          issueId: activeIssue._id, // replace with actual issue ID
          update,
        },
        {
          withCredentials: true,
        }
      );

      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update issue details:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await updateIssueDetails({ stage: newStatus });
  };

  const handlePriorityChange = async (newPriority) => {
    await updateIssueDetails({ priority: newPriority });
  };
  const handleLabelChange = async (newLabel) => {
    await updateIssueDetails({ label: newLabel });
  };
  const handleAssigneChange = async (newLabel) => {
    await updateIssueDetails({ label: newLabel });
  };
  const handleDateChange = async (newDate) => {
    setdate(newDate);

    const formattedDate = newDate.toISOString().split("T")[0];
    await updateIssueDetails({ dueDate: formattedDate });
  };

  if (isLoading) {
    return <Loader/>;
  }
  const delete2 = async () => {
    try {
      const confirmation = window.confirm(
        `Are you sure you want to delete ${title} issue?`
      );
      if (confirmation) {
        await axios.delete(
          `${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/details`,
          {
            params: {
              activeIssue: activeIssue,
            },
            withCredentials: true,
          }
        );
        toast.success(`${title} issue deleted successfully!`);
        setTimeout(function () {
          navigate("/workspace");
        }, 3000);
      }
    } catch (error) {
      toast.error(`Error deleting issue ${title}`);
      console.error("Error deleting issue:", error);
    }
  };
  const filteredTeamMembers = activeProjectMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {!isMediumScreen ? (
        <div
          className="bg-gray-900 w-[30vw] h-screen flex flex-col overflow-auto text-white p-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0) rgba(0,0,0,0)",
          }}
        >
          <div className="my-4 flex justify-start items-center">
            <div className="text-white w-[20%] mr-3">Status</div>
            <Dropdown
              options={statusOptions}
              initialSelectedOption={status || "Loading..."}
              setCurrentStatus={setStatus}
              onChange={handleStatusChange}
              width="40"
            />
          </div>

          <div className="mb-4 flex justify-start items-center">
            <div className="text-white w-[20%] mr-3 ">Priority</div>
            <Dropdown
              options={PriorityOptions}
              initialSelectedOption={priority}
              setCurrentStatus={setpriority}
              onChange={handlePriorityChange}
              width="40"
            />
          </div>

          <div className="mb-4 flex justify-start items-center">
            <div className="text-white w-[20%] mr-3">Assigne</div>
            <Dropdown
              options={filteredTeamMembers.map((member) => member.name)}
              initialSelectedOption={Assigne}
              setCurrentStatus={setAssigne}
              onChange={handleAssigneChange}
              width="40"
            />
          </div>

          <div className="mb-4 flex justify-start items-center">
            <div className="text-white w-[20%] mr-3">Sprint</div>
            <Dropdown
              options={sprintList
                .slice()
                .reverse()
                .map((sprint) => sprint.name)}
              initialSelectedOption={initialSelectedCycleOption}
              width="40"
            />
          </div>

          <div className="mb-4 flex justify-start items-center">
            <div className="text-white w-[20%] mr-3">Labels</div>
            <Dropdown
              options={LabelOptions}
              initialSelectedOption={Label}
              setCurrentStatus={setLabel}
              onChange={handleLabelChange}
              width="40"
            />
          </div>

          <hr class="w-[95%] h-1 mx-auto mb-5 mt-3 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-400"></hr>

          <div className="mb-4 flex justify-start items-center">
            <div className="text-white w-[20%] mr-3">Project</div>
            <div className="bg-gray-800 rounded text-white py-1 px-4 w-40">
              {projectname}
            </div>
          </div>

          <div className="mb-4 flex justify-start items-center">
            <div className="text-white w-[20%] mr-3">Due date</div>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="bg-gray-800 text-white py-1 px-4 rounded inline-flex items-center focus:outline-none w-40"
            />
          </div>
          <div className="mb-4 flex justify-start items-center mt-auto">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={delete2}
            >
              Delete Issue
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 w-full flex flex-wrap text-white p-3">
          <div className="ml-7 mb-2 flex justify-start items-center">
            <Dropdown
              options={statusOptions}
              initialSelectedOption={status || "Loading..."}
              setCurrentStatus={setStatus}
              width="40"
            />
          </div>

          <div className="ml-7 mb-2 flex justify-start items-center">
            <Dropdown
              options={PriorityOptions}
              initialSelectedOption={priority}
              setCurrentStatus={setpriority}
              width="40"
            />
          </div>

          <div className="ml-7 mb-2 flex justify-start items-center">
            <Dropdown
              options={AssigneOptions}
              initialSelectedOption={Assigne}
              setCurrentStatus={setAssigne}
              width="40"
            />
          </div>

          <div className="ml-7 mb-2 flex justify-start items-center">
            <Dropdown
              options={sprintList
                .slice()
                .reverse()
                .map((sprint) => sprint.name)}
              initialSelectedOption={initialSelectedCycleOption}
              width="40"
            />
          </div>

          <div className="ml-7 mb-2 flex justify-start items-center">
            <Dropdown
              options={LabelOptions}
              initialSelectedOption={Label}
              setCurrentStatus={setLabel}
              width="40"
            />
          </div>

          <div className="ml-7 mb-2 flex justify-start items-center">
            <div className="bg-gray-800 rounded text-white py-1 px-4 w-40">
              {projectname}
            </div>
          </div>

          <div className="ml-7 mb-2 flex justify-start items-center">
            <DatePicker
              selected={date}
              onChange={(date) => setdate(date)}
              dateFormat="dd/MM/yyyy"
              className="bg-gray-800 text-white py-1 px-4 rounded inline-flex items-center focus:outline-none w-40"
            />
          </div>
          <div className="ml-7  mb-2 flex justify-start items-center">
            <button
              className="bg-red-500 hover:bg-red-700 py-1 px-4  text-white font-bold rounded"
              onClick={delete2}
            >
              Delete Issue
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default RightBar;
