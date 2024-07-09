

import React, { useEffect, useState } from 'react';
import Axios from 'axios';

import { useNavigate } from "react-router-dom";
import backgroundImage from './auth.jpg';
import { NavLink } from "react-router-dom";

const Registration = (props) => {

  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

   


  function handleSubmit(e) {
    e.preventDefault();
    const newUser = {
      email,
      name,
      password,
      confirmPassword,
    };
    Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/users`, newUser, {
      withCredentials: true,
    })
      .then((res) => {
        console.log("User created successfully: " + res.data.user_id);
        // sessionStorage.setItem("userID", res.data.user._id);
        // localStorage.setItem("userName", res.data.user.name);
        navigate("/create_workspace");
        // window.location.reload();
      })
      .catch((err) => {
        setErrors(err.response.data.errors);
      });
  }
  const bodyStyle = {
    margin: 0,
    height: "100vh",
    background: `url(${backgroundImage})`,
    color: "#333",
    backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow:"auto",
  };
  const formStyle = {
    backgroundColor: "rgba(17, 24, 39)", // Transparent white
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    border: "none", // Set border to none
 
  };
  const input = {
    // backgroundColor: "#191919",
    border: "none",

    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    animation: "animateInput 0.5s ease both",
  };

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
    if (isLoggedIn) {
      navigate("/workspace");
    }
  });

  return (
    <div style={bodyStyle}>
      <div className="container" >
        <div className="row" >
          <div className="col text-center mt-3" >
            <a>
              <h1 className="display-4" style={{ color: "#ffff" }}>
                TrackerX
              </h1>
            </a>
          </div>
        </div>
        <div className="row justify-content-center mt-5"  >
          <div className="col-md-4" >
            <div className="card p-5 shadow rounded border" style={formStyle}>
              <h2
                className="font-weight-bold text-center mb-5"
                style={{ color: "#ffff" }}
              >
                Sign up for your account
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {errors && (
                    <span className="text-danger">
                      {errors?.email?.properties?.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  {errors && (
                    <span className="text-danger">
                      {errors?.name?.properties?.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  {errors && (
                    <span className="text-danger">
                      {errors?.password?.properties?.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  {errors && (
                    <span className="text-danger">
                      {errors?.confirmPassword?.properties?.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div
                  className="form-group text-center"
                  style={{ paddingTop: "0.6rem" }}
                >
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    style={{ backgroundColor: "rgb(147, 51, 234)" }}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <div className="text-center" data-testid="testLogin">
                <span style={{ color: "#dcdcdc" }}>
                  Already have an account?&nbsp;
                  <NavLink
                    to="/"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "none",
                      color: "#dcdcdc",
                    }}
                  >
                    Login
                  </NavLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
