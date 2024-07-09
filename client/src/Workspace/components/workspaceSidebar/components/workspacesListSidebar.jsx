import { useState } from "react";
import { useEffect } from "react";
import { PiMonitorFill } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import Axios from "axios"; //comment for testing

import { useSelector, useDispatch } from "react-redux";
import { changeWorkspaceNameId } from "../../../../redux/WorkspaceData/WorkspaceNameIdSlice";
import { changeworkspaceMemberList } from "../../../../redux/WorkspaceData/WorkspaceMemberListSlice";

const WorkspaceListSidebar = (props) => {
  const dispatch = useDispatch(); //comment for testing
  const workspaceId = useSelector((state) => state.workspaceNameId?.value.id);

  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const showWorkspaceHandler = () => {
    setShowWorkspaces((prevState) => !prevState);
  };
  const [workspaceData, setWorkspaceData] = useState();
  const [userWorkspaces, setUserWorkspace] = useState([
    {name:"Workspace 1",id:"", url:"",},
    {name:"Workspace 2",id:"", url:"",},
    {name:"Workspace 3",id:"", url:"",},
  ]);
  const [currentWorkspace, setCurrentWorkspace] = useState(userWorkspaces[0].name);
  useEffect(() => {
    if (typeof props.headerInfo === "function") {
      props.headerInfo({
        headerIcon: <PiMonitorFill />,
        headerTitle: currentWorkspace,
      });
    } else {
      console.log("headerInfo is not a function");
    }
    fetchWorkspaceData();
  }, []);

  const fetchWorkspaceData = async () => {
    // comment for testing
    try {
      const response = await Axios.get(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/getAllWorkspaceOfUser`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const data = await response.data;
        console.log(data.workspaces);

        setWorkspaceData(() => {
          const workspaceNames = data.workspaces.map(
            (workspace) => workspace.name
          );
          setUserWorkspace(workspaceNames);
          setCurrentWorkspace(workspaceNames[0]);
          props.headerInfo({
            headerIcon: <PiMonitorFill />,
            headerTitle: workspaceNames[0]
          });
          dispatch(changeWorkspaceNameId({name:data.workspaces[0].name,id:data.workspaces[0].id,url:data.workspaces[0].url}));
          fetchallmembersOfWorkspace(data.workspaces[0].id);
          return data.workspaces;
          
        });
        // console.log(workspaceData);
      } else {
        throw new Error("Internal server error");
      }
    } catch (error) {
      setWorkspaceData(userWorkspaces);
      console.error("Error fetching data:", error.message);
      // Handle error here
    }
  };

  const chooseWorkspaceHandler = (item, index) => {
    dispatch(
      changeWorkspaceNameId({ name: item.name, id: item.id, url: item.url })
    ); // comment for testing

    const data = {
      headerIcon: <PiMonitorFill />,
      headerTitle: userWorkspaces[index],
    };
    props.headerInfo(data); //comment for testing
    setCurrentWorkspace(userWorkspaces[index]);
    setShowWorkspaces(!showWorkspaces);
    fetchallmembersOfWorkspace(item.id);

  }
  const fetchallmembersOfWorkspace = async (Id) => {
    
    try {
      // Replace 'your_workspace_id' with the actual workspace ID
      console.log("workspaceId"+workspaceId);
      const data = {
        workspaceId: Id
      }
      
      const response = await Axios.post(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/workspace/members`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const Memberdata = await response.data.members;
        // setMembers(data.members);
        console.log("qejkdggwsc"+Memberdata);
        dispatch(changeworkspaceMemberList(Memberdata));
      } else {
        throw new Error("Failed to fetch members of the workspace");
      }
    } catch (error) {
      console.log("Error fetching members:", error);
    }
  };

  return (
    <>
      <div
        className="flex items-center p-2 text-white text-decoration-none  rounded-lg hover:bg-gray-900 group justify-between cursor-pointer"
        onClick={showWorkspaceHandler}
      >
        <div className="flex" onClick={props.openWorkspace}>
          <PiMonitorFill />
          <span className="text-sm ms-3">{currentWorkspace}</span>
        </div>
        {showWorkspaces ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {showWorkspaces && (
        <ul className={"flex row ml-8"}>
          {workspaceData?.map((item, index) => (
            <li key={index}>
              <div
                className="p-2 text-sm font-semibold text-white text-decoration-none  rounded-lg hover:bg-gray-900 group "
                onClick={() => chooseWorkspaceHandler(item, index)}
              >
                {item.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
export default WorkspaceListSidebar;
