import React, { useEffect } from 'react';
import {useNavigate} from "react-router-dom"

function PageNotFound() {
    let navigate=useNavigate();
    useEffect(()=>{
        setTimeout(()=>{
            navigate("/", {state:"hi"});
        },3000)
    },[])

    return (
        <>
            <h4>PageNotFound</h4>
            <p>You will be redirected to the Home Page shortly! </p>
        </>
    )
}

export default PageNotFound