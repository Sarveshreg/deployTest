import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate();
  return (
    <>
    <div>Thiis the Home page</div>
    <button onClick={(e)=>navigate(`/event/affd58bb-1b56-4b04-968f-2440caea8dd2`)}>test</button>
    </>
  )
}

export default Home