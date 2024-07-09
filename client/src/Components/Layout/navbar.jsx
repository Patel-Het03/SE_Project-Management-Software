import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import './../navbar.css';
import { NavLink } from "react-router-dom";
import axios from "axios";
const Navbar = (props) => {
  const nameInitials = "NG";

  const [userInfo, setUserInfo] = useState(false);
  const openUserInfoHandler = () => {
    setUserInfo((prevState) => !prevState);
  };
  const [formData, setFormData] = useState({
    email: "", // Default email
    fullname: "", // Default full name
  });

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
    <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between h-16 px-3">
        <div className="flex items-center justify-start rtl:justify-end">
          <button
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={props.showSideBarHandler}
          >
            <span className="sr-only">Open sidebar</span>
            <GiHamburgerMenu />
          </button>

          <a href="/" className="flex ms-2 md:me-24 text-decoration-none ">
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white dark:text-white">
              TrackerX
            </span>
          </a>
        </div>

        <div className="flex flex-col relative">
          <button
            id="dropdownInformationButton"
            data-dropdown-toggle="dropdownInformation"
            className="text-white bg-blue-700 hover:bg-blue-800 hover:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center "
            type="button"
            onClick={openUserInfoHandler}
          >
            {nameInitials}
          </button>

          <div
            className={`z-10 ${
              userInfo ? "" : "hidden"
            } bg-gray-900 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute top-10 right-0`}
          >
            <div className="px-4 py-3 text-sm text-white dark:text-white">
              <div>{formData.fullname}</div>
              <div className="font-medium truncate">{formData.email}</div>
            </div>

            <ul className="text-sm text-gray-700 dark:text-gray-200 p-0">
             
              <li>
                <a
                  href="#"
                  className="flex text-white justify-center w-full py-2 text-decoration-none"
                >
                  Settings
                </a>
              </li>
            </ul>
            <div className="">
              <a
                className="flex text-white justify-center w-full py-2 text-sm text-decoration-none"
                onClick={logout}
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
