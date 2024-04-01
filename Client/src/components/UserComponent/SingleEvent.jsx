import React from 'react'
import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux"

function SingleEvent() {
    let {id}=useParams();
    let userId=useSelector((state)=>state.auth.id);
    let User_fname=useSelector((state)=>state.auth.firstname);
    let token=useSelector((state)=>state.auth.token);
    let[eventDetail,setEventDetail]=useState({});
    let[userComment,setUserComment]=useState(null);
    let commentError=false;

    useEffect(()=>{
      let detail=async()=>{
        let response=await fetch(`http://localhost:3000/api/events/${id}`,{
          method:"GET",
        });
        let data=await response.json();
        if(data){
          setEventDetail(data);
          console.log(setEventDetail);
          console.log(data);
        }
      };
      detail()
    },[userComment])

    let sendRsvp= async ()=>{
      console.log("rsvp clicked by",userId);
}

    let postComment=async()=>{
      console.log("posting comment",userComment," by ",userId, " ",User_fname );
      try {
        let response= await fetch(`http://localhost:3000/api/events/${id}/comment`,{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`     //provide the token 
        },
        body:JSON.stringify({
          Comment:userComment,
          User_fname,
        })
        })
        let result=await response.json();
        if(result.id){
          setUserComment("")
        }
        else{
          commentError=true
        }

      } catch (error) {
        console.error();("unable to post comment",error);
      }
    }


  return (
    <div>
        {eventDetail && 
        <span>
          <h2>{eventDetail.EventTitle}</h2>
          <img src="https://www.discoverhongkong.com/content/dam/dhk/intl/what-s-new/events/events-festivals-720x860.jpg" alt="picture of an event" width={400} height={400} />
          <p><strong>Detail:</strong> {eventDetail.Details}</p>
          <span><strong>Location: </strong>
              <span> {eventDetail.Street}</span>
              <p><span>{eventDetail.State} {eventDetail.ZipCode}</span></p>
          </span>
          <p><strong>Date:</strong> {eventDetail.Details}</p>
          <p><strong>Time:</strong> {eventDetail.Details}</p>
          <p><strong>Maximum Attendees:</strong> {eventDetail.Details}</p>
          <p><strong>RSVP:</strong> Required</p>
          {token && <button onClick={(e)=>{sendRsvp()}}>I would like to attend</button>}

          <div>
            <div><strong>People attending this event:</strong></div>
            <span>
                  {eventDetail.RSVPUsers && eventDetail.RSVPUsers.map(user=>
                    <i key={User_fname}>
                      <span> {user.User_fname} </span>               
                    </i>
                  )}
            </span>
          </div>

          <div>
            <h5>Comments:</h5>
              {token &&
                <span>
                <textarea rows={3} cols={30} value={userComment} onChange={(e)=>setUserComment(e.target.value)}></textarea>
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