import React, { useState } from "react";
import Dropdown from "../../../Components/Layout/DropDown/dropdown";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { changeActiveProject } from "../../../redux/ProjectData/activeProjectSlice";
import { changeActiveProjectField } from "../../../redux/ProjectData/activeProjectSlice";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function ProjectSettingGeneral() {
  const project = useSelector((state) => state.activeProject.value);
  console.log(project);
  const [workspaceName, setWorkspaceName] = useState(useSelector((state) => state.workspaceNameId.value.name));
  const [projectName, setProjectName] = useState(project.name);
  const dispatch = useDispatch();
  const projectStatusOptions = [
    'Backlog','ToDo','InProgress','Done','Cancelled'
  ];
  const initialSelectedStatus = project.status;
  const [currentStatus, setCurrentStatus] = useState(project.status);
  const [aboutProject, setAboutProject] = useState(project.description);
  const [inputValue, setInputValue] = useState(projectName);

  const handleInputChangeProjectName = (event) => {
    const changedValue = event.target.value;
    setProjectName(changedValue);
    setInputValue(event.target.value);
  };
  const handleAboutProjectChange = (event) => {
    setAboutProject(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/projectUpdateInfo`,
        {
          projectID: project._id,
          name: projectName,
          description: aboutProject,
          status: currentStatus,
        },
        {
          withCredentials: true,
        }
      );
      // Handle success, maybe show a success message or redirect to another page
      if (response.status === 200) {
        dispatch(
          changeActiveProjectField({
            fieldName: "name",
            fieldValue: projectName,
          })
        );
        dispatch(
          changeActiveProjectField({
            fieldName: "status",
            fieldValue: currentStatus,
          })
        );
        dispatch(
          changeActiveProjectField({
            fieldName: "description",
            fieldValue: aboutProject,
          })
        );
        console.log(
          "Project updated successfully" 
        );
        toast.success("Project updated successfully");
      } 
      else if(response.status === 201){
        toast.error("Only lead can change the project info");
      }
      else {
        console.log("Internal server error");
        toast.error("Internal server error");
      }
    } catch (error) {
      // Handle error, maybe show an error message to the user
      console.error("Error updating project:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-800 w-full h-screen text-white flex justify-center p-10">
        <form
          action="#"
          className="mb-4 rounded w-full lg:w-[60%] h-[100%] bg-gray-900 p-3 overflow-auto "
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0) rgba(0,0,0,0)",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="text-gray-400 text-base mb-2">
            {workspaceName}
            <span className="mx-2"> / </span> {projectName}
          </div>
          <h1 className="text-3xl tracking-wide font-semibold mb-4 border-b border-gray-600 pb-3">
            Project Details
          </h1>

          <div className="mb-4 ">
            <label htmlFor="form-field-17" className="block text-lg text-white  mt-10">
              Project Name
            </label>
            <input
              data-testid= 'ProjectNameInput'
              name="name"
              value={projectName}
              onChange={handleInputChangeProjectName}
              className="h-10 w-[60%] lg:w-[17vw] px-2 rounded-sm border-[1px] border-gray-600 text-white font-normal bg-[rgb(15,19,29)] text-base"
            />
            {inputValue?.trim() === "" && (
              <p className="text-red-500 text-xs italic mt-1">
                Project name must not be empty.
              </p>
            )}
          </div>

          <div className="mb-4 ">
            <label htmlFor="form-field-17" className="block text-lg text-white  mt-10">
              Status
            </label>
            <Dropdown
              options={projectStatusOptions}
              initialSelectedOption={initialSelectedStatus}
              setCurrentStatus={setCurrentStatus}
              width="64"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="form-field-19" className="block text-lg text-white mt-10">
              Project Description
            </label>
            <textarea
              name="desciption"
              data-testid= 'ProjectDescriptionInput'
              value={aboutProject}
              onChange={handleAboutProjectChange}
              className="h-40 w-full px-2 rounded-sm border-[1px] border-gray-600 text-white font-normal bg-[rgb(15,19,29)] text-base resize-none"
            />
          </div>

          <div className="flex justify-between">
            <button
              className="inline-flex items-center px-4 py-2 bg-[#9333EA] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:bg-[#9233eac6] hover:ring hover:ring-indigo-300 disabled:opacity-25 transition"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
            <button
              type="delete"
              className="inline-flex items-center px-4 py-2 bg-red-800 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:border-indigo-800 hover:ring hover:ring-indigo-300 disabled:opacity-25 transition"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
export default ProjectSettingGeneral;
