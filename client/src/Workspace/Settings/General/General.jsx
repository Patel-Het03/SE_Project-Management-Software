import React, { useEffect, useState } from "react";
import SettingsSidebar from "../Component/SettingsSidebar";
import Navbar from "../../../Components/Layout/navbar/navbar";
import axios from "axios"; //comment for testing
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useSelector,useDispatch } from "react-redux";
import {changeWorkspaceName} from "../../../redux/WorkspaceData/WorkspaceNameIdSlice"

const General = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [upload, setUpload] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const workspaceReduxName=useSelector((state)=>state.workspaceNameId.value.name);
  const workspaceId=useSelector((state)=>state.workspaceNameId.value.id);


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
    fetchWorkspace(); // Fetch workspace data on component mount
  }, []);
  

  const fetchWorkspace = async () => {
    try {
      const response = await axios.get(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/getActiveWorkspaceOfUser`,
        {
          params: {
            activeWorkspaceId: workspaceId,
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data.name);
      setWorkspaceName(data.name);
      setWorkspaceUrl(data.url);
      // Assuming you also need to set the imageSrc here, update accordingly
    } catch (error) {
      console.error("Error fetching workspace:", error);
      // Handle errors as needed
    }
  };

  const handleInput = (e, n) => {
    if (n === 1) setWorkspaceName(e.target.value);
    else if (n === 2) setWorkspaceUrl(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Make a PUT request to update the workspace settings
      await axios.put(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/getActiveWorkspaceOfUser`,
        {
          activeWorkspaceId: workspaceId,
          newName: workspaceName,
          newUrl: workspaceUrl,
        },
        {
          withCredentials: true,
        }
      );
        dispatch(changeWorkspaceName(workspaceName));
      // Handle success
      
      toast.success("Workspace  updated successfully!");
      console.log("Workspace  updated successfully");
     
      setTimeout(function () { navigate("/workspace")},  3000);
     
      
    } catch (error) {
      toast.error("Error updating workspace !");
      console.error("Error updating workspace :", error);
      // Handle errors as needed
    }
  };
  const handleDelete = async () => {
    try {
      // Make DELETE request to delete the active workspace
      const confirmation = window.confirm(
        "Are you sure you want to delete this workspace?"
      );
      if (confirmation) {
        await axios.delete(
          `${process.env. REACT_APP_BACKEND_BASE_URL}/api/getActiveWorkspaceOfUser`,
          {
            params: {
              activeWorkspaceId: workspaceId,
            },
            withCredentials: true,
          }
        );

        // Handle success
        console.log("Workspace deleted successfully");
        toast.success("Workspace deleted successfully!");
        setTimeout(function () { navigate("/workspace")},  3000);


        // Reload the page after 2-3 seconds
        
      }
    } catch (error) {
      toast.error("Error deleting workspace!");
      console.error("Error deleting workspace:", error);
      // Handle errors as needed
    }
  };

  const handleSidebar = () => {
    setShowSidebar((prevstate) => !prevstate);
  };

  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImageSrc(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    setUpload(!upload);
  };

  return (
    <div>
      <Navbar showSideBarHandler={handleSidebar} />

      <div className="bg-gray-800  w-screen h-screen flex flex-row ">
        {<SettingsSidebar showSideBar={showSidebar} />}

        <div className="flex justify-center w-full overflow-yy-auto my-8">
          <div className="w-[80vw] sm:w-[70vw] md:w-[43vw]   bg-gray-900 text-white p-4 overflow-y-scroll">
            <p className="text-3xl tracking-wide font-normal my-2">Workspace</p>
            <p className="text-[rgb(107,114,128)] text-[15px] border-b-[1px] border-gray-500 pb-4 ">
              Manage your workspace settings
            </p>

            <h3 className="text-[20px] tracking-wide font-normal my-2">Logo</h3>

            <div className="relative inline-flex rounded-lg w-auto auto mt-3 mb-2">
              <label htmlFor="fileInput" className="cursor-pointer ">
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleUploadChange}
                />

                <div className="relative ">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt=""
                      className={`w-[69px] h-[65px] object-cover border   rounded-lg border-dashed border-gray-400  ${
                        upload ? "brightness-50" : ""
                      }`}
                      onMouseOver={handleUpload}
                      onMouseOut={handleUpload}
                    />
                  ) : (
                    <img
                      src={
                        "https://static.toiimg.com/thumb/msid-96054814,width-400,resizemode-4/96054814.jpg"
                      }
                      alt=""
                      className={`w-[69px] h-[65px] object-cover border z-0  rounded-lg border-dashed border-gray-400 ${
                        upload ? "brightness-50" : ""
                      }`}
                      onMouseOver={handleUpload}
                      onMouseOut={handleUpload}
                    />
                  )}
                  {upload && (
                    <button className="hover:cursor-pointer text-[10px] tracking-wide z-10  text-white">
                      Click to upload
                    </button>
                  )}
                </div>
              </label>
            </div>

            <p className="text-[rgb(107,114,128)] text-[15px] border-b-[1px] border-gray-500 pb-4">
              Pick a logo for your workspace
            </p>

            <div className="border-gray-500 border-b-[1px]">
              <p className="text-[20px] font-normal tracking-wide my-2">
                General
              </p>
              <label className="text-gray-300 text-[15px] font-normal tracking-wide my-2 mr-3" for="workspaceName">
                Workspace name
              </label>
              <input
                id={"workspaceName"}
                value={workspaceName}
                className="bg-[rgb(15,19,29)] w-[35vw] md:w-[19vw] border-[1px] px-2 py-[2px]  border-gray-600 rounded-sm"
                onChange={(e) => handleInput(e, 1)}
              ></input>
              {workspaceName === "" ? (
                <p className="text-[12px] text-[rgb(220,38,38)] my-1 font-bold ">
                  Workspace name cannot be empty
                </p>
              ) : (
                ""
              )}
              <br></br>
              <label className="text-gray-300 tracking-wide text-[15px] mt-4 font-normal my-2 mr-3" for='workspaceURL'>
                Workspace URL
              </label>
              <input
                id='workspaceURL'
                value={workspaceUrl}
                className="bg-[rgb(15,19,29)] w-[35vw] md:w-[19vw]  border-[1px] px-2 py-[2px]  border-gray-600 rounded-sm"
                onChange={(e) => handleInput(e, 2)}
              ></input>
              {workspaceUrl === "" ? (
                <p className="text-[12px] text-[rgb(220,38,38)] my-1 font-bold">
                  Workspace url cannot be empty
                </p>
              ) : (
                ""
              )}
              <br></br>
              <button
                className="bg-purple-600 py-1 px-3 my-2 rounded-md"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>

            <div className="mt-4">
            
              <p className="text-[rgb(107,114,128)] text-[15px] ">
                If you want to permanently delete this workspace and all of its
                data, including but not limited to users, issues, and comments,
                you can do so below
              </p>
              <button
                className="bg-red-500 py-1 px-3 mt-4 rounded-md"
                onClick={handleDelete}
              >
                Delete this workspace
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default General;
