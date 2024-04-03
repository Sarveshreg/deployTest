import React from 'react'
import { useEffect,useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom';

function SingleEvent() {
    let {id}=useParams();
    let userId=useSelector((state)=>state.auth.id);
    let User_fname=useSelector((state)=>state.auth.firstname);
    let token=useSelector((state)=>state.auth.token);
    let[eventDetail,setEventDetail]=useState({});
    //let[userComment,setUserComment]=useState(null);
    let c=useRef();
    let [commentError,setCommentError]=useState(false);
    let [rsvpError,setRsvpError]=useState(false);
    let navigate = useNavigate();
    let[RsvpDisable,setRsvpDisable]=useState(false)


    useEffect(()=>{
      RsvpDisable=false;
      let detail=async()=>{
        let response=await fetch(`http://localhost:3000/api/events/${id}`,{
          method:"GET",
        });
        let data=await response.json();
        if(data){
          setEventDetail(data);
          console.log(setEventDetail);
          console.log(data);
          if(data.CreatorId==userId){
            console.log("same creator")
            setRsvpDisable(false)
          }
          else if(data.RSVPUsers.length>=data.MaximumAttendies){
            setRsvpDisable(true)    //disable the RSVP button if enough users have RSVP'ed
          }
          let c= data.RSVPUsers.filter((user)=>user.id==userId)
          if(c){
            console.log("current user has already rsvp");
            setRsvpDisable(true);
          }
        }
      };
      detail();
      
    },[commentError,RsvpDisable])

    let sendRsvp= async ()=>{
      setRsvpError(true);
      console.log("rsvp clicked by",userId);
      try {
        let response= await fetch(`http://localhost:3000/api/rsvp/${id}`,{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`     //provide the token 
        },
        body:JSON.stringify({
          User_fname,
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
  console.log("rsvp cancelled by",userId);
  try {
    let response= await fetch(`http://localhost:3000/api/rsvp/${id}`,{
    method:"DELETE",
    headers:{
      "Content-Type" : "application/json",
      "Authorization" : `Bearer ${token}`     //provide the token 
    },
    })
    let result=await response.json();
    console.log("result of cancel",result)
    // if(result.eventID==id){
    //   setRsvpError(false);
    // }
    // else{
    //   //do nothing
    // }
    
  } catch (error) {
      console.error(error);
  }
}

    let postComment=async()=>{
      setCommentError(true);
      console.log("posting comment",c," by ",userId, " ",User_fname );
      try {
        let response= await fetch(`http://localhost:3000/api/events/${id}/comment`,{
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
        console.error();("unable to post comment",error);
      }
    }

    let deleteEvent=async()=>{
      console.log("event deleted",id)
      try {
        let response= await fetch(`http://localhost:3000/api/events/${id}`,{
          method:"DELETE",
          headers:{
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`     //provide the token 
          },
          })
          let result=await response.json();
          if(result.result){
            navigate(`/profile`,{replace:true});
          }

      } catch (error) {
        console.log(error)
      }
    }


  return (
    <div>
        {eventDetail && 
        <span>
          <div><strong>{eventDetail.EventTitle}</strong>{(userId==eventDetail.CreatorId) &&<button onClick={(e)=>deleteEvent()}>Delete</button>}</div>
          <img src="https://www.discoverhongkong.com/content/dam/dhk/intl/what-s-new/events/events-festivals-720x860.jpg" alt="picture of an event" width={400} height={400} />
          <p><strong>Detail:</strong> {eventDetail.Details}</p>
          <span><strong>Location: </strong>
              <span> {eventDetail.Street}</span>
              <p><span>{eventDetail.State} {eventDetail.ZipCode}</span></p>
          </span>
          <p><strong>Date and Time:</strong> {eventDetail.Date}</p>
          <p><strong>Maximum Attendees:</strong> {eventDetail.MaximumAttendies}</p>
          <p><strong>RSVP:</strong> Required</p>
          {/* {token && 
          <span><button disabled={RsvpDisable} onClick={(e)=>{sendRsvp()}}>I would like to attend</button> {rsvpError && <span>Unable to RSVP!</span>}</span>
          } */}
          {token && <span>
              {!RsvpDisable && <button onClick={(e)=>{cancelRsvp()}}>Cancel RSVP</button>}
              {RsvpDisable && <button onClick={(e)=>{sendRsvp()}}> RSVP</button>}
            </span>}

          <div>
            <div><strong>People attending this event ({eventDetail.RSVPUsers && <span>{eventDetail.RSVPUsers.length}</span>}):</strong></div>
            <span>
                  {eventDetail.RSVPUsers && eventDetail.RSVPUsers.map(user=>
                    <i key={User_fname}>
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
        
        </span>
        }


        {!eventDetail && <div>no event detail to show</div>}

    </div>
  )
}

export default SingleEvent