import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../../features/auth/authSlice';

function Login() {

  let[email,setEmail]=useState("");
  let[password,setPassword]=useState("");
  let[credentialError, setCredentialError]=useState(false);
  let[serverError, setServerError]=useState(false);
  let dispatch = useDispatch();


  async function handleSubmit(e){

    e.preventDefault();
    setCredentialError(false);setServerError(false);
    console.log("button clicked!");

    //check to see if email and password meets all the parameters
    let emailPattern=/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if((!emailPattern.test(email)) || (password.length<4)){
      console.log("invalid email or password");
      setPassword("");
      setCredentialError(true);
      return null;
    }

    //make a call to the backend to login the user and get a token. Set the token in redux state
    try {
      let response= await fetch ("http://localhost:3000/api/users/login",{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email:email,
          Password: password
        }),
      });
      let result= await response.json();

      if(response.ok) {
        console.log("Login Successful:", result);
        dispatch(setToken(result.token));
      } else {
        console.error("Login Failed:", result.message);
        setServerError(true);
      }

    } catch (error) {
      console.error("error:",error);
      setServerError(true);setPassword("");   //reset the password field
    }

    setPassword("");
  }


  return (

    <div>
      <form>
        <label >Email: <input type="text" onChange={(e)=>setEmail(e.target.value)} placeholder='email' value={email} /></label>
        <label > Password: <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} /></label>
        <button onClick={(e)=>handleSubmit(e)}>Submit</button>
        {credentialError && <p>Invalid email or password entered!</p>}
        {serverError && <p>Unable to connect to the server!</p>}
      </form>
    </div>

  )
}

export default Login