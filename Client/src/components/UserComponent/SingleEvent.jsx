import React from 'react';
import { useEffect,useState,useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from "react-redux"

import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import loadGoogleMapsAPI from './loadGoogleMapsAPI';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function SingleEvent() {
    let {id}=useParams();
    let userId=useSelector((state)=>state.auth.user.id);
    let User_fname=useSelector((state)=>state.auth.user.FirstName);
    let UserEmail=useSelector((state)=>state.auth.user.Email);
    let token=useSelector((state)=>state.auth.token);
    let[eventDetail,setEventDetail]=useState({});
    //let[userComment,setUserComment]=useState(null);
    let c=useRef();
    let [commentError,setCommentError]=useState(false);
    let [rsvpError,setRsvpError]=useState(false);
    let navigate = useNavigate();
    let[RsvpDisable,setRsvpDisable]=useState(false);
    let[cancelBtn,setCancelBtn]=useState(false);
    let [dateTime,setDateTime]=useState({});
    let API_Link=import.meta.env.VITE_API_LINK;


  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);

    useEffect(()=>{
      
      loadGoogleMapsAPI()
      .then(() => {
        setIsMapsApiLoaded(true); // Google Maps API is ready to use
      })
      .catch(error => {
        console.error("Failed to load Google Maps API", error);
      });

      let detail=async()=>{
        let response=await fetch(`${API_Link}events/${id}`,{
          method:"GET",
        });
        let data=await response.json();
        if(data){
          if(data.Date.length>10){
            let date=data.Date.split("T");
            let time=date[1].split(":00.");
            let Date=date[0];
            let Time=time[0].replace(":","");
            setDateTime({Date,Time});
            }
          setEventDetail(data);

          let c= data.RSVPUsers.filter((user)=>user.userID==userId);
          if(data.CreatorId==userId){
            setRsvpDisable(true);
          }
          else if(c.length==1){
            setRsvpDisable(true);
            setCancelBtn(true);
          }
          else if(data.RSVPUsers.length>=data.MaximumAttendies){
            setRsvpDisable(true);
          }
          else{
            setRsvpDisable(false)
          }
        }
      }; 
      detail();
      
    },[commentError,rsvpError,RsvpDisable,cancelBtn,id])

    let sendRsvp= async ()=>{
      setRsvpError(true);

      try {
        let response= await fetch(`${API_Link}rsvp/${id}`,{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`     //provide the token 
        },
        body:JSON.stringify({
          User_fname,
          UserEmail,
          EventTitle:eventDetail.EventTitle,

        })
        })
        let result=await response.json();
        if(result.eventID==id){
          setRsvpError(false);
        }
        else{
          //do nothing
        }
        
      } catch (error) {
          console.error(error);
      }
}
let cancelRsvp= async ()=>{
  setRsvpError(true);
  try {
    let response= await fetch(`${API_Link}rsvp/${id}`,{
    method:"DELETE",
    headers:{
      "Content-Type" : "application/json",
      "Authorization" : `Bearer ${token}`     //provide the token 
    },
    body:JSON.stringify({
      EventTitle:eventDetail.EventTitle,
    })
    })
    let result=await response.json();
    if(result.eventID==id){
      navigate(`/profile`,{replace:true});
    }
    else{
      //do nothing
    }
    
  } catch (error) {
      console.error(error);
  }
}

    let postComment=async()=>{
      setCommentError(true);
      try {
        let response= await fetch(`${API_Link}events/${id}/comment`,{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`     //provide the token 
        },
        body:JSON.stringify({
          Comment:c.current.value,
          User_fname,
        })
        })
        let result=await response.json();
        if(result.id){
          c.current.value="";
          setCommentError(false);
        }
        else{
          //do nothing
        }

      } catch (error) {
        console.error();(error);
      }
    }

    let deleteEvent=async()=>{
      try {
        let response= await fetch(`${API_Link}events/${id}`,{
          method:"DELETE",
          headers:{
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`     //provide the token 
          },
          })
          let result=await response.json();
          if(result.result){
            alert("Event deleted!");
            navigate(`/profile`,{replace:true});
          }

      } catch (error) {
        console.log(error)
      }
    }

    if (!eventDetail || !isMapsApiLoaded || !eventDetail.Latitude || !eventDetail.Longitude) {
      return <div>Loading...</div>; // Display a loading message or spinner
    }
    // if(!eventDetail.Date){
    //   return(
    //     <h3>Nothing to display here</h3>
    //   )
    // }



  return (
    <div>
        {eventDetail && 
        <span>
          <div><strong>{eventDetail.EventTitle}</strong>{(userId==eventDetail.CreatorId) &&<span><button onClick={(e)=>deleteEvent()}>Delete</button> <button onClick={(e)=>navigate("/event/update", {state:eventDetail})}>Update</button> </span>}</div>
          <img src="https://www.discoverhongkong.com/content/dam/dhk/intl/what-s-new/events/events-festivals-720x860.jpg" alt="picture of an event" width={400} height={400} />
          <p><strong>Detail:</strong> {eventDetail.Details}</p>
          <p><strong>Category:</strong> {eventDetail.category.Category}</p>
          <span><strong>Location: </strong>
              <div> {eventDetail.LocationDisplay}</div>
              
          </span>
          <p><strong>Date and Time:</strong> {dateTime.Date} @ {dateTime.Time} CST</p>
          <p><strong>Maximum Attendees:</strong> {eventDetail.MaximumAttendies}</p>
          <p><strong>RSVP:</strong> Required</p>
          {/* {token && 
          <span><button disabled={RsvpDisable} onClick={(e)=>{sendRsvp()}}>I would like to attend</button> {rsvpError && <span>Unable to RSVP!</span>}</span>
          } */}
          <>
          {/* Event details... */}
        </>
          {token && <span>
              {RsvpDisable && <button disabled={RsvpDisable}>RSVP</button>}
              {!RsvpDisable && <button onClick={(e)=>{sendRsvp()}}> RSVP</button>}
              {cancelBtn && <button onClick={(e)=>{cancelRsvp()}}> Cancel RSVP</button>}
            </span>}
          <p><strong>Created By: </strong>{eventDetail.CreatorName}</p>

          <div>
            <div><strong>People attending this event ({eventDetail.RSVPUsers && <span>{eventDetail.RSVPUsers.length}</span>}):</strong></div>
            <span>
                  {eventDetail.RSVPUsers && eventDetail.RSVPUsers.map(user=>
                    <i key={user.userID}>
                      <div>
                        <img src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" alt="profile pic" height={50} width={50} />
                      <div> {user.User_fname} </div> 
                      </div>              
                    </i>
                  )}
            </span>
          </div>

          <div>
            <h5>Comments:</h5>
              {token &&
                <span>
                <textarea rows={3} cols={30} ref={c} ></textarea>
                <button onClick={()=>postComment()}>Post</button>
                <span>{commentError && <p>Unable to post comment</p>}</span>
              </span>
              }
              {eventDetail.Comment && eventDetail.Comment.map(comment=>
                  <ol key={comment.id}>
                    <span>{comment.User_fname}: </span>
                    <span>{comment.Comment}</span>                
                    </ol>
                  )}
          </div>
          
           {eventDetail.Latitude && eventDetail.Longitude && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: eventDetail.Latitude, lng: eventDetail.Longitude }}
                zoom={15}
              >
                <Marker position={{ lat: parseFloat(eventDetail.Latitude), lng: parseFloat(eventDetail.Longitude) }} />
              </GoogleMap>
                    )}
                    <button ><a target='_blank' href={`https://www.google.com/maps/search/?api=1&query=${eventDetail.Latitude}%2c${eventDetail.Longitude}`} >Get Direction</a></button>
        
        </span>
        }


        {!eventDetail && <div>no event detail to show</div>}

    </div>
  )
}

export default SingleEvent