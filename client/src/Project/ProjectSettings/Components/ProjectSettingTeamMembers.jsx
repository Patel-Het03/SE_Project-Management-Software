import React, { useState, useEffect } from "react";
import Axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { addMemberToProject, removeMemberFromProject } from "../../../redux/ProjectData/activeProjectAllMemberSlice";
import Dropdown from "../../../Components/Layout/DropDown/dropdown";

function ProjectSettingTeamMembers() {

  const dispatch = useDispatch()
  const activeWorkspaceMembers = useSelector((state) => state.WorkspaceMemberList.value);
  const [addMemberEmails, setAddMemeberEmails]= useState();
  const activeProjectMembers = useSelector((state) => state.activeProjectAllMember.value);
  const projectId = useSelector((state) => state.activeProject.value._id);
  const [addMemberList, setAddMemeberList] = useState([]);
  const [memberToAdd, setMemberToAdd] = useState(null);
  // State for project

  const workspaceName = useSelector((state) => state.workspaceNameId.value.name);
  const projectName = useSelector((state) => state.activeProject.value.name);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for showing remove confirmation popup
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // State for showing add member popup
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState(""); // State for the email input

  // Function to handle adding a new member
  const handleAddMember = async () => {
    // If newMemberEmail is not empty, proceed to add member
    if (newMemberEmail.trim() !== "") {
      // Add logic to add new member to the team
      console.log("Adding new member with email:", newMemberEmail);
      // Clear the email input and close the popup
      await addMember();
      setNewMemberEmail("");
      setShowAddMemberPopup(false);
    }
  };

  const addMember = async () => {
    const data = {
      projectId: projectId,
      email: newMemberEmail
    };

    try {
      const response = await Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/addMemberToProject`, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('Member added successfully');
        const { member } = response.data;
        dispatch(addMemberToProject(member));
        toast.success(response.data.message);


      } else {
        console.log('Error:', response.status);
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('User not found');
        toast.error('User not found');
      }
      else if (error.response && error.response.status === 400) {
        console.log('User is already a member of the project');
        toast.error('User is already a member of the project');
      }
      else if (error.response && error.response.status === 403) {
        console.log('Only the project lead can add members');
        toast.error('Only the project lead can add members');
      }
      else {
        console.error('Error while adding member:', error.message);
        toast.error('Error while adding member:', error.message);
      }
    }
  }

  // Function to remove a team member
  const handleRemoveMember = (memberId) => {
    console.log(memberId);
    setMemberToRemove(memberId);
    setShowRemoveConfirmation(true);
    console.log(showRemoveConfirmation);

  };



  // Function to confirm removal of a team member
  const confirmRemoveMember = async () => {
    // setTeamMembers((prevMembers) =>
    //   prevMembers.filter((member) => member.id !== memberToRemove)
    // );
    // console.log(memberId);

    await removeMember(memberToRemove);
    setShowRemoveConfirmation(false);
  };

  const removeMember = async (memberId) => {
    const data = {
      projectId: projectId,
      memberId: memberId
    };
    try {
      const response = await Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/removeMemberFromProject`, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('Member removed from project successfully');
        // Dispatch action to update Redux state and remove member from the project
        dispatch(removeMemberFromProject({ id: memberId }));
        toast.success(response.data.message);
      } else {
        console.log('Error:', response.status);
        toast.error(response.data.message);
      }
    } catch (error) {

      if (error.response && error.response.status === 404) {
        console.log('Project not found');
        toast.error('Project not found');
      }
      else if (error.response && error.response.status === 403) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      }
      else {
        console.error('Error removing member from project:', error.message);
        toast.error('Error removing member from project', error.message);
      }
    }
  };

  // Filter team members based on search query
  const filteredTeamMembers = activeProjectMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    const filteredArray = activeWorkspaceMembers.filter(item1 => !activeProjectMembers.some(item2 => item2.id === item1.id));
    setAddMemeberList(filteredArray);
    
    console.log(filteredArray);


  }, [filteredTeamMembers]);
  useEffect(() => {
    
    setAddMemeberEmails(addMemberList.map(member => member.email));


  }, [addMemberList]);

  return (
    <>
      <div className="bg-gray-800 w-full h-screen text-white justify-center p-10">
        <div className="flex flex-col rounded mx-auto h-[100%] mb-4 w-full lg:w-[60%] bg-gray-900 p-3 ">
          <div className="text-gray-400 text-base mb-2">
            {workspaceName}
            <span className="mx-2"> / </span> {projectName}
          </div>
          <h1 className="text-3xl tracking-wide font-semibold mb-4 border-b border-gray-600 pb-3">
            Team Members
          </h1>

          {/* Search Box */}
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-sm border-gray-600 text-white font-normal bg-[rgb(15,19,29)] text-base px-3 py-1 w-48 mr-2"
            />
            <button
              onClick={() => setShowAddMemberPopup(true)}
              className="inline-flex items-center px-4 py-2 bg-[#9333EA] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:bg-[#9233eac6] hover:ring hover:ring-indigo-300 disabled:opacity-25 transition "
            >
              Add Member
            </button>
            {showAddMemberPopup && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-50">
                <div className="bg-gray-900 text-center p-6 rounded-md shadow-md border-1 border-gray-700">
                  <h2 className="text-lg font-semibold mb-4">Add Member</h2>
                  {/* Email input field */}
                  {/* <input
                    type="email"
                    placeholder="Enter email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="border border-gray-600 rounded-sm text-white font-normal bg-[rgb(15,19,29)] text-base px-3 py-1 mb-2"
                  /> */}
                  {console.log(addMemberEmails)}
                  <Dropdown
                  options={addMemberEmails}
                  initialSelectedOption={'Select Member To Add'}
                  setCurrentStatus={setNewMemberEmail}

                  // options, initialSelectedOption,currentStatus,setCurrentStatus,onChange, width

                  width="64"
                />
                
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddMember}
                      className="text-center px-4 py-2 bg-[#9333EA] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:bg-[#9233eac6] hover:ring hover:ring-indigo-300 disabled:opacity-25 transition mr-2  w-[7vw]"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => setShowAddMemberPopup(false)}
                      className="text-center font-semibold text-xs  uppercase tracking-widest hover:outline-none hover:ring hover:ring-indigo-300 disabled:opacity-25 transition bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400  w-[7vw] "
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* List of Team Members */}
          <div
            class="overflow-auto h-[100vh] "
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0,0,0,0) rgba(0,0,0,0)",
            }}
          >
            <div className="grid gap-2">
              {filteredTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-900 mx-4 border-b border-gray-600 pb-[-10px] flex justify-between items-center"
                >
                  <div className="flex flex-col ">
                    <h2 className="text-lg ">{member.name} </h2>
                    <p className="text-gray-600 w-[10vw]">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-white text-sm mx-4 my-auto">
                      {member.role}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {/* <p className="text-gray-600 mx-4">{member.role}</p> */}
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-white hover:text-red-500 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M10.001 7.8a2.2 2.2 0 1 0 0 4.402A2.2 2.2 0 0 0 10 7.8zm0-2.6A2.2 2.2 0 1 0 9.999.8a2.2 2.2 0 0 0 .002 4.4m0 9.6a2.2 2.2 0 1 0 0 4.402a2.2 2.2 0 0 0 0-4.402"
                        />
                      </svg>
                    </button>
                    {showRemoveConfirmation && member.id === memberToRemove && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-50">
                        <div className="bg-gray-900 rounded-md border-1 border-gray-700 text-center p-6 shadow-md">
                          <h2 className="text-lg font-semibold mb-4">
                            Remove Member?
                          </h2>
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={confirmRemoveMember}
                              className="bg-red-500 w-[6vw] text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 mr-2"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setShowRemoveConfirmation(false)}
                              className="bg-gray-300 w-[6vw] text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ProjectSettingTeamMembers;
