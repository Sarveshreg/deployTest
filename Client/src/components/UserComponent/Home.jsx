import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate();
  return (
    <>
    <div>Thiis the Home page</div>
    <button onClick={(e)=>navigate(`/event/937794fd-f796-43c1-a5bd-d8daed72b8a7`)}>test</button>
    </>
  )
}

export default Home