import React, { useState } from "react";
import { useEffect } from "react";
import SettingsSidebar from "../Component/SettingsSidebar";
import Navbar from "../../../Components/Layout/navbar/navbar";
import { ToastContainer, toast } from 'react-toastify';
import Axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { removeMemberFromWorkspace,addMemberToWorkspace } from "../../../redux/WorkspaceData/WorkspaceMemberListSlice";
import { useNavigate } from "react-router-dom";



function MemberList() {
  const workspaceName = useSelector((state) => state.workspaceNameId.value.name);
  const workspaceId = useSelector((state) => state.workspaceNameId.value.id);
  const workspaceUrl = useSelector((state) => state.workspaceNameId.value.url);
  const workspaceMemberList = useSelector((state) => state.WorkspaceMemberList.value);
  const dispatch = useDispatch()
  // Array of team members
  // const [teamMembers, setTeamMembers] = useState(
  //   workspaceMemberList
  // );


  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for showing remove confirmation popup
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // State for showing add member popup
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState(""); // State for the email input

  // State for invite link
  const [inviteLink, setInviteLink] = useState(workspaceUrl);
  const [showSidebar, setShowSidebar] = useState(false);
  // Function to get Gravatar image URL based on email

  // Function to handle adding a new member
  const handleAddMember = async() => {
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
    const data={
      workspaceId: workspaceId,
      email: newMemberEmail,

    }
    try {
      // Make a POST request to the backend API endpoint
      const response = await Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/addMemberByEmail`, data,{
        withCredentials: true,
      });
  
      // Check the response status
      if (response.status === 200) {
        console.log('Email invitation sent successfully');
        // Display a success toast notification
        console.log(response.data);
        dispatch(addMemberToWorkspace(response.data));
        toast.success('Email invitation sent successfully');
      } else {
        // Display an error toast notification
        console.error('Error sending email invitation');
        toast.error('Error sending email invitation');
      }
    } catch (error) {
      // Handle error
      console.error('Error adding member:', error);
  
      // Display an error toast notification based on the error type
      if (error.response && error.response.status === 404) {
        console.error(error.response.data.message);
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        console.error(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Unexpected error occurred:', error.message);
        toast.error('An unexpected error occurred');
      }
    }

  }

  // Function to remove a team member
  const handleRemoveMember = (memberId) => {
    setMemberToRemove(memberId);
    setShowRemoveConfirmation(true);
  };

  // Function to confirm removal of a team member
  const confirmRemoveMember = async() => {
    await removeMember(memberToRemove);
    setShowRemoveConfirmation(false);
  };
  const removeMember = async (memberId) => {
    const data = {
      workspaceId: workspaceId,
      memberId: memberId
    };
    try {
      const response = await Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/removeMemberFromWorkspace`, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('Member removed from workspace successfully');
        // Dispatch action to update Redux state and remove member from the project
        dispatch(removeMemberFromWorkspace({ id: memberId }));
        toast.success(response.data.message);
      } else {
        console.log('Error:', response.status);
        toast.error(response.data.message);
      }
    } catch (error) {

      if (error.response && error.response.status === 404) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
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

  // Function to generate a new invite link
  const generateInviteLink = () => {
    // Add logic to generate a new invite link (you can use a library like uuid for unique links)
    const newLink =
      "https://example.com/invite/" + Math.random().toString(36).substr(2, 9);
    setInviteLink(newLink);
  };
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  // Filter team members based on search query
  const filteredTeamMembers = workspaceMemberList.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSidebar = () => {
    setShowSidebar((prevstate) => !prevstate);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // console.log(workspaceMemberList);
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



  }, [workspaceName])




  return (
    <>
    <div>
      <Navbar showSideBarHandler={handleSidebar} />

      <div className="flex flex-row fixed bg-gray-800  h-screen w-screen">

        <SettingsSidebar showSideBar={showSidebar} />
        {/* <div className="bg-gray-800 h-screen flex flex-col px-8 py-8 w-full"> */}
        <div className=" w-full overflow-auto h-full text-white flex justify-center p-10">
          <div className=" h-[100%] flex flex-col mb-4 w-full lg:w-[60%] bg-gray-900 p-3 ">
            <h1 className=" flex flex-col text-3xl tracking-wide font-semibold mb-3 border-b border-gray-600 pb-3">
              Members
              <span className="text-gray-400 text-base font-normal">
                Manage who has access to this workspace
              </span>
            </h1>

            {/* New Invite Link Box */}
            <div className="text-white  mb-8">
              <div className="flex flex-col">
                <p className="mr-4">Invite Link:</p>
                <div className="flex flex-row justify-between">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="border rounded-sm border-gray-600 mt-2 text-white font-normal bg-[rgb(15,19,29)] text-base px-2 py-1 mr-4 w-[65%]"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="text-center md:px-4 py-1 bg-[#9333EA] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:bg-[#9233eac6] hover:ring hover:ring-indigo-300 disabled:opacity-25 transition  w-[20%] "
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            <div className="text-gray-400 text-base mb-2 mt-[10px]">
              {workspaceName}
            </div>
            <h1 className="text-3xl tracking-wide font-semibold mb-4 border-b border-gray-600 pb-3">
              Manage Members
            </h1>

            {/* Search Box */}
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-sm border-gray-600 text-white font-normal bg-[rgb(15,19,29)] text-base px-3 py-1 w-1/3"
              />
              <button
                onClick={() => setShowAddMemberPopup(true)}
                className=" text-center px-4 py-1 bg-[#9333EA] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:bg-[#9233eac6] hover:ring hover:ring-indigo-300 disabled:opacity-25 transition"
              >
                Add Member
              </button>
              {showAddMemberPopup && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-50">
                  <div className="bg-gray-900 text-center p-6 rounded-md shadow-md border-1 border-gray-700">
                    <h2 className="text-lg font-semibold mb-4">Add Member</h2>
                    {/* Email input field */}
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="border border-gray-600 rounded-sm text-white font-normal bg-[rgb(15,19,29)] text-base px-3 py-1 mb-2"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleAddMember}
                        className="text-center font-semibold px-4 py-1 bg-[#9333EA] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:bg-[#9233eac6] hover:ring hover:ring-indigo-300 disabled:opacity-25 transition mr-2 w-[7vw]"
                      >
                        Add Member
                      </button>
                      <button
                        onClick={() => setShowAddMemberPopup(false)}
                        className="text-center font-semibold text-xs uppercase tracking-widest hover:outline-none hover:ring hover:ring-indigo-300 disabled:opacity-25 transition bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 w-[7vw] "
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
              className="overflow-auto h-[100vh]"
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
                    <div className="flex justify-between w-[100%]">
                      {/* Profile Image */}

                      <div className="flex flex-col ">
                        <h2 className="text-lg font-normal  ">{member.name} </h2>
                        <p className="text-gray-500 w-[10vw]">{member.email}</p>
                      </div>

                      <p className="text-white text-sm mx-4 my-auto">
                        {member.role}
                      </p>

                      <div className="flex items-center">
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
                      </div>

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
      </div>
    </div>
    <ToastContainer />
    </>
  );
}

export default MemberList;
