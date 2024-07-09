import React, { useEffect, useState } from "react";
import axios from "axios";
import SettingsSidebar from "../Component/SettingsSidebar";
import Navbar from "../../../Components/Layout/navbar/navbar";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState({
    email: "", // Default email
    fullname: "", // Default full name
    username: "", // Default username
  });
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();
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
    else{
      profile(); // Fetch user profile on component mount
    }
  },[]);

  // Fetch user profile data from the backend
  const profile = async () => {
    try {
      const response = await axios.get(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/users/profile`,
        {
          withCredentials: true,
        }
      );
      const userData = response.data;
      // Set form data with user profile information
      setFormData({
        email: userData.email,
        fullname: userData.name, // Assuming name is provided by the backend
        username: userData.username,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error fetching profile!"); // Notify user about the error
    }
  };

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Handle submission of updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/users/profile`,
        {
          fullname: formData.fullname,
          username: formData.username,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Profile updated successfully!"); // Notify user about successful update
      console.log("Profile updated successfully:", response.data);
      setTimeout(() => {
        
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile!"); // Notify user about the error
    }
  };

  // Toggle sidebar visibility
  const handleSidebar = () => {
    setShowSidebar((prevstate) => !prevstate);
  };

  return (
    <div>
      <Navbar showSideBarHandler={handleSidebar} />

      <div className=" bg-[#1f2937] fixed flex flex-row w-screen h-screen ">
        <SettingsSidebar showSideBar={showSidebar} />

        <div className="flex justify-center h-[90%] w-full overflow-auto  ">
          <div className="w-[80vw] sm:w-[70vw] md:w-[50vw] bg-[#111827] overflow-y-scroll py-5 px-16">
            <div className=" rounded-lg shadow-md  text-white">
              <h1 className="text-3xl text-center font-normal tracking-wide mb-2 ">
                Profile
              </h1>
              <p className="text-gray-500 text-center mb-6 ">
                Manage your TrackerX profile
              </p>

              <hr className="my-6" />

              {/* Profile Picture section */}

              {/* Email input */}
              <div className=" ">
                <h2 className="text-[16px] font-normal mb-2">Profile Picture</h2>
                <div className="mb-6 flex items-center justify-center">
                  <img
                    src="https://t3.ftcdn.net/jpg/05/79/55/26/360_F_579552668_sZD51Sjmi89GhGqyF27pZcrqyi7cEYBH.jpg"
                    alt=""
                    className="w-[100px] h-[100px] rounded-full  bg-pink-500 border-4 border-[#000000]"
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="mb-4 md:text-[16px] text-sm  flex items-center justify-center md:justify-between border-b border-gray-700 pb-3 pt-3 ">
                <label
                  htmlFor="email"
                  className="block text-white w-[50%]  tracking-wide font-normal mb-2"
                >
                  Email :
                </label>
                <input
                  type="text"
                  id="email"
                  readOnly // Make email input read-only
                  className=" border-[1px] w-[41vw]  md:w-[17vw] px-2 py-2 border-gray-600 rounded-md bg-gray-800 "
                  value={formData.email}
                />
              </div>

              {/* Fullname input */}
              <div className="mb-4 md:text-[16px] text-sm flex items-center justify-center md:justify-between border-b border-gray-700 pb-3">
                <label
                  htmlFor="fullname"
                  className="block text-white w-[50%] tracking-wide font-normal mb-2"
                >
                  Name :
                </label>
                <input
                  type="text"
                  id="fullname"
                  className=" border-[1px] w-[41vw] md:w-[17vw] px-2 py-2 outline-1 border-gray-600 rounded-md bg-[rgb(15,19,29)]"
                  placeholder="Enter Name"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>

              {/* Username input */}
              <div className="mb-4  md:text-[16px] text-sm flex items-center justify-center md:justify-between border-b border-gray-700 pb-3">
                <label
                  htmlFor="username"
                  className="block text-white w-[50%] tracking-wide  font-normal mb-2"
                >
                  Username :
                </label>
                <input
                  type="text"
                  id="username"
                  className="border-[1px] w-[39vw] md:w-[17vw] px-2 py-2 border-gray-600 rounded-md bg-[rgb(15,19,29)]"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Update button */}
              <button
                className="bg-[#9333EA] mt-[10px] text-white font-semibold  tracking-wide py-[6px] px-4 rounded focus:outline-none focus:shadow-outline "
                type="button"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Profile;
