import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";

function EventUpdate() {
    let token=useSelector((state)=>state.auth.token);
    let navigate = useNavigate();
    let location=useLocation();
    if(location.state.category.Category){
    location.state.category=location.state.category.Category;
    }



    if(location.state.Date.length>10){
        let date=location.state.Date.split("T");
        console.log("date",date)
        let time=date[1].split(":00");
        console.log(time);
        location.state.Date=date[0];
        location.state.Time=time[0];
        }

    let[event,setEvent]=useState(location.state);
    let[addressError,setAddressError]=useState(false);

      //get current date and use it to set the minimum date limit on the calender
    let today=new Date();
    let monthPlaceholder="";
    let dayPlaceholder="";
    if(today.getMonth()<10){monthPlaceholder="0"}
    if(today.getDay()<10){dayPlaceholder="0"}
    let startDate=today.getFullYear()+"-"+monthPlaceholder+(today.getMonth()+1)+"-"+dayPlaceholder+today.getDate();

    async function EventUpdate(e){
        setAddressError(false);
        e.preventDefault();
        console.log("updated event",event);
        try {
            let response= await fetch(`http://localhost:3000/api/events/${event.id}`,{
                method: "PUT",
                headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`     //provide the token 
                },
                body: JSON.stringify({
                updates:event,
                })
            })
            let result= await response.json();
            console.log(result);
            if(result.id){
                console.log("redirecting")
                navigate(`/event/${result.id}`,{replace:true})
            }
            else if(result.message=="Address not found for geocoding."){
                setAddressError(true);
            }
            } catch (error) {
            console.error(error);
            }
        }

    if(!location.state.id){
        return(<h4>Nothing to display</h4>)
    }

  return (
    <div>
        {addressError && <p>Invalid Address</p>}
        <h3>Update your Event</h3>
        <form>
            <label>Title: <input type="text" value={event.EventTitle} onChange={(e)=>setEvent({...event,EventTitle:(e.target.value)})}/> </label><br />
                <label>Category: 
                    <select value={event.category.Category} onChange={(e)=>setEvent({...event,category:(e.target.value)})}>
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
            <label>Date: <input type="date" min={startDate} max="2030-12-12" value={event.Date} onChange={(e)=>setEvent({...event,Date:(e.target.value)})}/></label><br />
            <label>Time: <input type="time" value={event.Time} onChange={(e)=>setEvent({...event,Time:(e.target.value)})} /></label><br />
            <label>Street Address: <input type="text" value={event.Street} onChange={(e)=>setEvent({...event,Street:(e.target.value)})} /></label><br />
            <label>City: <input type="text" value={event.City} onChange={(e)=>setEvent({...event,City:(e.target.value)})} /></label><br />
            <label>State: <input type="text" value={event.State} onChange={(e)=>setEvent({...event,State:(e.target.value)})}/></label><br />
            <label>Zip Code: <input type="number" value={event.ZipCode} onChange={(e)=>setEvent({...event,ZipCode:(e.target.value)})}/></label><br /> 
            <label>Maximum Attendees: <input type="number" value={event.MaximumAttendies} min={1} onChange={(e)=>setEvent({...event,MaximumAttendies:(e.target.value)})}/></label><br />
            <label>Detail: <textarea rows={4} cols={50} value={event.Details} onChange={(e)=>setEvent({...event,Details:(e.target.value)})} /></label><br />
            <label> Picture: <input type="text" value={event.Picture} onChange={(e)=>setEvent({...event,Picture:(e.target.value)})}/></label><br />
            <button onClick={(e)=>EventUpdate(e)}>Update</button> 
        </form>
    </div>
    )
}

export default EventUpdate