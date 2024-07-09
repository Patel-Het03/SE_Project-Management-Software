import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import Spinner from 'react-bootstrap/Spinner';
// import { navigate } from "@reach/router";
import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { userVerify } from "../services/Apis";
import 'react-toastify/dist/ReactToastify.css';
import { counter } from "@fortawesome/fontawesome-svg-core";




const Otp = () => {
    // const [spiner,setSpiner] = useState(false);
    const navigate = useNavigate();
    // const [spiner, setSpiner] = useState(false);
    const [otp, setOtp] = useState("");
    const location = useLocation();

    const [counter, setCounter] = useState(30);
    React.useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        if (counter === 0) {
            navigate('/email', { state: { chk: counter } });

        }
    }, [counter]);
    const verify = async (e) => {
        e.preventDefault();

        if (otp === "") {
            toast.error("Enter Your Otp")
        } else if (!/[^a-zA-Z]/.test(otp)) {
            toast.error("Enter Valid Otp")
        } else if (otp.length < 6) {
            toast.error("Otp Length minimum 6 digit")
        } else {
            const data = {
                otp, email: location.state
            }
            // setSpiner(true)
            console.log(data)
            const response = await userVerify(data);
            if (response.status === 200) {
                //   localStorage.setItem("usertoken", response.data.userToken);
                //   localStorage.setItem("name", response.data.myuser.fname);
                console.log(response.data.myuser.email);
                localStorage.setItem("email", response.data.myuser.email);
                //   localStorage.setItem("phone", response.data.myuser.phone);
                //   localStorage.setItem("address", response.data.myuser.address);
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/newpassword")
                }, 5000)
            } else {
                toast.error(response.response.data.error)
            }
        }
    }




    const [errors, setErrors] = useState([]);

    // function handleSubmit(e) {
    //     e.preventDefault();
    //     const newUser = {
    //         email

    //     }
    //     Axios.post(`${process.env. REACT_APP_BACKEND_BASE_URL}/api/users`, newUser, { withCredentials: true })
    //         .then(res => {
    //             console.log("User created successfully: " + res.data.user_id);
    //             localStorage.setItem('userID', res.data.user._id);
    //             localStorage.setItem('userName', res.data.user.name);
    //             navigate("/workspace");
    //         })
    //         .catch(err => {
    //             setErrors(err.response.data.errors);
    //         });
    // }
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
      },[]);
    return (
        <>
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
                                <h2 className="font-weight-bold text-center mb-4" style={{ color: "#ffff" }}>Otp Verification</h2>
                                {/* <form onSubmit={handleSubmit}> */}
                                <div className="form-group">
                                    {errors && (
                                        <span className="text-danger">
                                            {errors?.email?.properties?.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="otp" placeholder="Enter your otp" value={otp} onChange={e => setOtp(e.target.value)} />
                                    {/* console.log(otp) */}
                                </div>




                                {/* <div className="form-group">
                                        {errors && (
                                            <span className="text-danger">
                                                {errors?.confirmPassword?.properties?.message}
                                            </span>
                                        )}
                                    </div> */}
                                <div className="countdown-text">
                                    <p style={{ color: '#c0c0c0' }}>Time Remaining: {`${counter}s`}</p>
                                </div>
                                <div className="form-group text-center">
                                    <button className="btn btn-primary btn-lg btn-block" style={{ backgroundColor: 'rgb(147, 51, 234)' }} onClick={verify}>Verify

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
                <ToastContainer />
            </div>
        </>
    )
}

export default Otp