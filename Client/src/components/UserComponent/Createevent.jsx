import React, { useState } from 'react'
import {useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Createevent() {
  let token=useSelector((state)=>state.auth.token);
  let user=useSelector((state)=>state.auth.user);
  let navigate = useNavigate();
  let API_Link=import.meta.env.VITE_API_LINK;


  //get current date and use it to set the minimum date limit on the calender
  let today=new Date();
  let monthPlaceholder="";
  let dayPlaceholder="";
  if(today.getMonth()<10){monthPlaceholder="0"};
  if(today.getDay()<10){dayPlaceholder="0"};
  let startDate=today.getFullYear()+"-"+monthPlaceholder+(today.getMonth()+1)+"-"+dayPlaceholder+today.getDate();


  //declare all the state variable
  let[title,setTitle]=useState("");
  let[category,setCategory]=useState("Arts");
  let[eventDate,setEventDate]=useState(startDate);
  let[eventTime,setEventTime]=useState("12:00");
  let[street,setStreet]=useState("");
  let[city,setCity]=useState("");
  let[eventState,setEventState]=useState("");
  let[zipCode,setZipCode]=useState("");
  let[maxAttendees,setMaxAttendees]=useState(0);
  let[detail,setDetail]=useState("");
  let[picture,setPicture]=useState({});


  //define a function to call when the form is submitted
  async function EventSubmit(e){
    e.preventDefault();
    let formData=new FormData();
    formData.append("picture",picture);
    try {

      let response= await fetch(API_Link+"events",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`     //provide the token 
        },
        body: JSON.stringify({
          category: category,
          Date: eventDate,
          Street: street,
          City: city,
          State: eventState,
          ZipCode: zipCode,
          EventTitle: title,
          Details: detail,
          MaximumAttendies: maxAttendees,
          // Picture: picture,
          Time:eventTime,
          CreatorName:user.FirstName+" "+user.LastName,
          CreatorEmail:user.Email
        }),
        file:picture
      })
      let result= await response.json();
      if(result.id){
        formData.append("id",result.id);
        let response=await axios.post(
          `${API_Link}events/event-pic/${result.id}`,
          formData,
          {
            headers:{
              "Content-Type" : "multipart/form-data",
              "Authorization" : `Bearer ${token}`     //provide the token
            },
          }
        );
        // response.data.uploaded ? console.log("response",response): console.log("Picture not uploaded");
        navigate(`/event/${result.id}`,{replace:true})
      }
    } catch (error) {
      console.error(error);
    }
  }

  let onInputChange=(e)=>{
    setPicture(e.target.files[0]);
  }

  if(!token){
    return(
      <h2>Login or register to create event</h2>
    )
  }


  return (

    <div>
      <h3>Create an Event!</h3>
      <form onSubmit={EventSubmit}>
        <label>Title: <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} /></label><br />
        <label>Category: 
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="ARTS">Arts</option>
            <option value="SCIENCE">Science</option>
            <option value="SPORTS">Sports</option>
            <option value="TRAVEL">Travel</option>
            <option value="FOOD">Food</option>
            <option value="MUSICS">Musics</option>
            <option value="RELIGIOUS">Religious</option>
            <option value="POLITICAL">Political</option>
          </select>
        </label><br />
        <label>Date: <input type="date" min={startDate} max="2030-12-12" value={eventDate} onChange={(e)=>setEventDate(e.target.value)}/></label><br />
        <label>Time: <input type="time" value={eventTime} onChange={(e)=>setEventTime(e.target.value)} /></label><br />
        <label>Street Address: <input type="text" value={street} onChange={(e)=>setStreet(e.target.value)} /></label><br />
        <label>City: <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} /></label><br />
        <label>State: <input type="text" value={eventState} onChange={(e)=>setEventState(e.target.value)}/></label><br />
        <label>Zip Code: <input type="number" value={zipCode} onChange={(e)=>setZipCode(e.target.value)} /></label><br />
        <label>Maximum Attendees: <input type="number" value={maxAttendees} min={1} onChange={(e)=>setMaxAttendees(e.target.value)}/></label><br />
        <label>Detail: <textarea rows={4} cols={50} value={detail} onChange={(e)=>setDetail(e.target.value)} /></label><br />
        <label> Picture: <input name="foo" type="file"  accept='image/*' onChange={onInputChange}/></label><br />
        <button type='submit'>Submit</button>
        {/* <button onClick={(e)=>EventSubmit(e)}>Submit</button> */}
      </form>
    </div>

    
  )
}

export default Createevent