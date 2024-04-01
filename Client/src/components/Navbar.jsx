import React from 'react'
import { NavLink } from 'react-router-dom'
import {useSelector,useDispatch} from "react-redux"
import { clearToken } from '../features/auth/authSlice';


function Navbar() {
  let token=useSelector((state)=>state.auth.token);
  let dispatch = useDispatch()
  console.log(token);
  return (
    <span>
      <NavLink to="/"> Home</NavLink>
      {token && <span>
      <NavLink to="/profile"> Profile</NavLink>
      <NavLink to="/createevent"> Create-Event</NavLink>
      <button onClick={(e)=>dispatch(clearToken())}>Logout</button>
      </span>
      }
      {!token && <span>
      <NavLink to="/login"> Login</NavLink>
      <NavLink to="/register"> Register</NavLink>
      </span>
      }
    </span>
  )
}

export default Navbar