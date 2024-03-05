import React from 'react'
import { useParams } from 'react-router-dom'

function SingleEvent() {
    let {id}=useParams();
    console.log("id",id);
  return (
    <div>SingleEvent</div>
  )
}

export default SingleEvent