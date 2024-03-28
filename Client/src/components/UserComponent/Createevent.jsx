import React, { useState } from 'react'

function Createevent() {

  //get current date and use it to set the minimum date limit on the calender
  let today=new Date();
  let monthPlaceholder="";
  if(today.getMonth()<10){monthPlaceholder="0"}
  let startDate=today.getFullYear()+"-"+monthPlaceholder+(today.getMonth()+1)+"-"+today.getDate();

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
  let[picture,setPicture]=useState("");

  let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI3MTc5ZDhmLWE3MzctNDE0Yy1iOGRlLTY1NzI0YmRjN2JhNCIsImlhdCI6MTcxMTY2OTU1MiwiZXhwIjoxNzExNzU1OTUyfQ.yfsmbnV9AHoatX5FviBpiF2MWgQwjCdsrXzpeN0ppQQ"; //remove this TEST!

  //define a function to call when the form is submitted
  async function EventSubmit(e){
    e.preventDefault();
    console.log(title, category, eventDate, eventTime, street, city, eventState, zipCode, maxAttendees,detail,picture)
    try {
      let response= await fetch("http://localhost:3000/api/events",{
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
          Picture: picture,
          Time:eventTime
        })
      })
      let result= await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }


  return (

    <div>
      <h3>Create an Event!</h3>
      <form>
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
        <label>Zip Code: <input type="text" value={zipCode} onChange={(e)=>setZipCode(e.target.value)} /></label><br />
        <label>Maximum Attendees: <input type="number" value={maxAttendees} min={1} onChange={(e)=>setMaxAttendees(e.target.value)}/></label><br />
        <label>Detail: <textarea rows={4} cols={50} value={detail} onChange={(e)=>setDetail(e.target.value)} /></label><br />
        <label> Picture: <input type="text" value={picture} onChange={(e)=>setPicture(e.target.value)}/></label><br />
        <button onClick={(e)=>EventSubmit(e)}>Submit</button>
        
      </form>
    </div>
    
  )
}

export default Createevent