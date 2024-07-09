import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { sentOtpFunction } from "../services/Apis";
// import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';



const Email = () => {
    // const [spiner, setSpiner] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const location = useLocation();

    const chk = location.state ? location.state.chk : null;

    const sendOtp = async (e) => {
        e.preventDefault();

        if (email === "") {
            toast.error("Enter Your Email !")
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email !")
        } else {
            // setSpiner(true)
            const data = {
                email: email
            }

            const response = await sentOtpFunction(data);

            if (response.status === 200) {
                // setSpiner(false)
                navigate("/otp", { state: email })
            } else {
                // setSpiner(false)
                toast.error(response.response.data.error);
            }
        }
    }

    // sendotp
    // function handleSubmit(e) {
    //     e.preventDefault();
    //     const user = {
    //       email
    //     }

    //     // if (email === "") {
    //     //     toast.error("Enter Your Email !")
    //     // } else if (!email.includes("@")) {
    //     //     toast.error("Enter Valid Email !")
    //     // } else {
    //     //     setSpiner(true)

    //     Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/users/email`, user, {
    //   withCredentials: true,
    // })
    // .then((res) => {
    //     // localStorage.setItem("userID", res.data.user._id);
    //     // localStorage.setItem("userName", res.data.user.name);
    //     // console.log(`login succesful`);
    //     navigate("/otp");
    //     window.location.reload();
    //   })
    //   .catch((err) => {
    //     setErrors(err.response.data.message);
    //   });

    // }

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




    const [errors, setErrors] = useState([]);

    const bodyStyle = {
        margin: 0,
        height: "100vh", // Set body height to full viewport height
        background: "rgb(31,41,55)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
        color: "#333",
    };
    const formStyle = {
        backgroundColor: "rgba(255, 255, 255, 0)", // Transparent white
        padding: "20px",
        borderRadius: "10px",
        border: "none",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        animation: "slideFromRight 1s linear both",
        transition: "all 0.5s ease",
    };
    const input = {
        // backgroundColor: "#191919",
        border: "none",

        borderBottom: "1px solid #ccc",
        marginBottom: "15px",
        animation: "animateInput 0.5s ease both",
    };
    return (
        <>
            <section>
                <div style={bodyStyle}>

                    <div className="container">
                        <div className="row">
                            <div className="col text-center mt-3">
                                <h1 className="display-4" style={{ color: "#ffff" }}>TrackerX</h1>
                            </div>
                        </div>
                        <div className="row justify-content-center mt-5">
                            <div className="col-md-4">
                                <div className="card p-5 shadow rounded border" style={formStyle}>
                                    <h2 className="font-weight-bold text-center mb-4" style={{ color: "#ffff" }}>OTP Authentication</h2>
                                    {/* <form style={input} onSubmit={handleSubmit}> */}

                                    <div className="form-group">
                                        {errors && (
                                            <span className="text-danger">
                                                {errors?.email?.properties?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control" type="email" placeholder="Enter email address" value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>




                                    <div className="form-group">
                                        {errors && (
                                            <span className="text-danger">
                                                {errors?.confirmPassword?.properties?.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group text-center">
                                        <button className="btn btn-primary btn-lg btn-block" style={{ backgroundColor: 'rgb(147, 51, 234)' }} onClick={sendOtp}>{chk===0?"Resend OTP" :   "Send OTP"}
                                            {/* {
                                                spiner ? <span><Spinner animation="border" /></span> : ""
                                            } */}
                                        </button>

                                    </div>
                                    {/* </form> */}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <ToastContainer />
            </section>

        </>
    )
}

export default Email