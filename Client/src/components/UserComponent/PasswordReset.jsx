import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function PasswordReset() {
    let [token,setToken]=useState("");
    let[Email,setEmail]=useState("");
    let[OTP,setOTP]=useState("");
    let[password,setPassword]=useState("");
    let[emailPhase,setEmailPhase]=useState(true);
    let[otpPhase,setOtpPhase]=useState(false);
    let[passwordPhase,setPasswordPhase]=useState(false);
    let[tooShort,setTooShort]=useState(false);
    let navigate=useNavigate();

    let sendEmail=async()=>{
        try {
            let response= await fetch ("http://localhost:3000/api/users/otpgen",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Email,
                }),
            });
            let result= await response.json();
            console.log("result",result);
            if(result.message){
                setOtpPhase(true);
                setEmailPhase(false);
            }
        } catch (error) {
            console.error(error)
        }
    }

    let sendOTP=async()=>{
        try {
            let response= await fetch ("http://localhost:3000/api/users/otpverify",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    OTP,
                    Email
                }),
            });
            let result= await response.json();
            console.log("result",result);
            if(result.token){
                setToken(result.token);
                setOtpPhase(false);
                setEmailPhase(false);
                setPasswordPhase(true);
            }
        } catch (error) {
            console.error(error)
        }
    }

    let sendPassword=async()=>{
        if(password.length<4){
            setTooShort(true);
            return(null);
        }
        console.log("token",token);
        try {
            let response= await fetch ("http://localhost:3000/api/users/reset/password",{
                method: "put",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`     //provide the token 
                },
                body: JSON.stringify({
                    password
                }),
            });
            let result= await response.json();
            console.log("result",result);
            if(result.Email==Email){
                alert("Password reset complete. You will now be redirected to the login page.")
                navigate("/login",{replace:true});
            }
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <>
        <h4>Reset Password</h4>
        {emailPhase && 
        <div>
            <div>Enter the email associated with your account</div>
            <label>Email: <input value={Email} onChange={(e)=>setEmail(e.target.value)} type="email" /></label>
            <button onClick={()=>sendEmail()}>Submit</button>
        </div>}
        {otpPhase && 
        <div>
            <div>Enter OTP that was sent to your email({Email})</div>
            <label>OTP: <input value={OTP} onChange={(e)=>setOTP(e.target.value)} type="string" /></label>
            <button onClick={()=>sendOTP()}>Submit</button>
        </div>}
        {passwordPhase && 
        <div>
            <div>Enter new password({Email})</div>
            <label>Password: <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" /></label>
            <button onClick={()=>sendPassword()}>Submit</button>
            {tooShort && <p>Password too short!</p>}
        </div>}
        
    </>
  )
}

export default PasswordReset