import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from "./UserComponent/Home"
import Login from './UserComponent/Login'
import Register from "./UserComponent/Register"
import Createevent from './UserComponent/Createevent'
import Profile from './UserComponent/Profile'

function Maincontent() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/createevent' element={<Createevent/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
        </Routes>
    </div>
  )
}

export default Maincontent