import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Axios from "axios";
// const {Workspace} =require('../models/')

const WorkPage = () => {
  const navigate = useNavigate();
  const name1 = useRef();
  const [url, seturl] = useState("trackerX.app/");
  const [companySize, setCompanySize] = useState("How large is your Company");
  const [role, setRole] = useState("Select your role in company");
  const handleCompanySizeChange = (event) => {
    setCompanySize(event.target.value);
    // console.log(companySize);
    // console.log(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    // console.log(event.target.value);
  };
  function handleclick(e) {
    e.preventDefault();
    const name = name1.current.value;
    const newWorkspcae = {
      name,
      url,
    };

    Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/users/workspace`, newWorkspcae, {
      withCredentials: true,
    }).then((res) => {
      // console.log(res.data.workspace);
      console.log('workspace succesfully created');
      navigate("/workspace");
      // window.location.reload();
    });
  }

  // useEffect(()=>{
  //   console.log(name.current)
  // },[name])

  const handle = () => {
    // console.log(name.current.value);
    seturl("trackerX.app/" + name1.current.value);
  };

  return (
    <div className="bg-gray-800 w-full h-screen text-white">
      <div className="pt-[100px] pb-16 m-auto w-[40%]">
        <h1 className=" text-2xl mb-4 font-normal text-center">
          Create a new Workspace
        </h1>
        <h2 className="text-gray-500 text-[15px] text-center">
          Workspaces are shared environments where teams can work on projects
        </h2>
        <h3 className=" text-[15px] text-gray-500 text-center ">
          cycle and tasks
        </h3>

        <form
          onSubmit={handleclick}
          className="bg-gray-900 p-3 rounded-md mt-4"
        >
          <p className="my-2">Workspace name</p>
          <input
            data-testid="textbox1"
            name="myInput"
            placeholder=""
            type="text"
            ref={name1}
            className="bg-gray-900 border-[1px] p-2 hover:border-[3px] w-full rounded-md mt-[-3px]  h-8"
            autoFocus
            onChange={handle}
          ></input>

          <p className="mt-3 mb-2">Workspace url</p>
          <input
            data-testid="textbox2"
            placeholder=""
            value={url}
            className="bg-gray-900 mt-[-3px] border-[1px] p-2 hover:border-[3px] w-full rounded-md  h-8"
            onChange={""}
          ></input>

          <p className="mb-2 mt-3">How large is your Company</p>
          <select
            data-testid="combobox1"
            className="bg-gray-900 border-[1px] w-full rounded-md hover:border-[3px] mt-[-3px] h-8"
            value={companySize}
            onChange={handleCompanySizeChange}
          >
            <option value="Just me">Just me</option>
            <option value="1-100 members">1-100 members</option>
            <option value="100-1000 members">100-1000 members</option>
            <option value="1000 and more">1000 and more</option>
          </select>

          <p className="mt-3 mb-2">Select your role in company</p>
          <select
            data-testid="combobox2"
            className="bg-gray-900 border-[1px] hover:border-[3px] w-full rounded-md mt-[-3px] mb-10 h-8"
            value={role}
            onChange={handleRoleChange}
          >
            <option value="Founder or leadership team">
              Founder or leadership team
            </option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Designer">Designer</option>
          </select>

          <div className="mx-auto w-[40%]">
            <button className="px-8 py-[11px] mt-10  bg-purple-600 rounded-sm">
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkPage;