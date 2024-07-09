import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./../navbar.css";
const UserPopUp = () => {
  // Initials of the user's name
  const getInitials = (name) => {
    const splitName = name.toUpperCase().split(" ");
    if (splitName.length === 1) {
      return splitName[0] ? splitName[0].charAt(0) : "";
    } else {
      return splitName[0].charAt(0) + splitName[1].charAt(0);
    }
  };
  const [formData, setFormData] = useState({
    email: "", // Default email
    fullname: "", // Default full name
  });

  // State to track whether the dropdown is open
  const [userInfo, setUserInfo] = useState(false);

  // Reference to the dropdown element
  const dropdownRef = useRef(null);

  // Function to toggle the state of the dropdown
  const toggleUserInfoHandler = () => {
    // Toggle the `userInfo` state
    setUserInfo((prevState) => !prevState);
  };

  // Function to handle clicks outside the dropdown
  const handleOutsideClick = (event) => {
    // Check if the clicked target is outside the dropdown element
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close the dropdown
      setUserInfo(false);
    }
  };

  // Use effect to attach and remove the event listener for outside clicks
  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []); // Empty dependency array ensures this effect runs only on mount and unmount

  // User's name and email ID for displaying in the dropdown
  const userName = "Nikhil Garg";
  const userEmailId = "nikhilgarg@gmail.com";
  const logout = () => {
    console.log("ggg");
    window.open(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/users/logout`, "_self");
  };

  useEffect(() => {
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
          fullname: userData.name,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    profile();
  }, []);
  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      {/* Button to toggle the dropdown */}
      <button
        id="dropdownInformationButton"
        data-dropdown-toggle="dropdownInformation"
        className="text-white bg-blue-700 hover:bg-blue-800 hover:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center nav-link"
        type="button"
        onClick={toggleUserInfoHandler}
      >
        {getInitials(formData.fullname)}
      </button>

      {/* Dropdown content */}
      {userInfo && (
        <div className="z-10 bg-gray-900 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute top-10 right-0">
          {/* User information */}
          <div className="px-4 py-3 text-sm text-white dark:text-white">
            <div>{formData.fullname}</div>
            <div className="font-medium truncate">{formData.email}</div>
          </div>

          {/* Navigation links */}
          <ul className="text-sm text-gray-700 dark:text-gray-200 p-0 divide-y divide-gray-100">
            <li>
              <NavLink
                to="/workspace"
                className="flex text-white justify-center w-full py-2 text-decoration-none nav-link"
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/workspace/settings/profile"
                className="flex text-white justify-center w-full py-2 text-decoration-none nav-link"
              >
                Settings
              </NavLink>
            </li>
          </ul>

          {/* Sign out link */}
          <div>
            <NavLink
              className="flex text-white justify-center w-full py-2 text-sm text-decoration-none nav-link"
              onClick={logout}
            >
              Sign out
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPopUp;
