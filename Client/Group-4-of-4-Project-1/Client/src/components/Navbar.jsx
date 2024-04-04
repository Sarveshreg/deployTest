import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <span>
      <NavLink to="/"> Home</NavLink>
      <NavLink to="/login"> Login</NavLink>
      <NavLink to="/register"> Register</NavLink>
      <NavLink to="/profile"> Profile</NavLink>
      <NavLink to="/createevent"> Create-Event</NavLink>
    </span>
  )
}

export default Navbar