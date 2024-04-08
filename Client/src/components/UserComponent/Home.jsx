
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// // import './index.css';

// function Home() {
//   let navigate = useNavigate();
//   return (
//     <div className="home">
//       <header className="header">
//         <nav>
//           <ul>
//             <li><button className="btn-nav">Home</button></li>
//             <li><button className="btn-nav">Events</button></li>
//             <li><button className="btn-nav">Groups</button></li>
//             <li><button className="btn-profile">Profile</button></li>
//             <li><button className="btn-register">Register</button></li>
//             <button onClick={(e)=>navigate(`/event/6c1d7f83-d8c5-4958-9aaa-ed8276809624`)}>test</button>
//           </ul>
//         </nav>
//       </header>
//       <main>
//         <section className="hero">
//           <h1>Discover Local Events and Meet People</h1>
//           <p>Find your next experience and meet people who share your interests.</p>
//           <button className="btn">Join Now</button>
//         </section>
//         <section className="featured-events">
//           <h2>Featured Events</h2>
//         </section>
//         <section className="upcoming-events">
//           <h2>Upcoming Events</h2>
//         </section>
//       </main>
//       <footer className="footer">
  
//       </footer>
//     </div>
//   );
// }

// export default Home;


import React, { useEffect, useState } from 'react';
import EventMap from './EventMap'; 
import axios from 'axios';

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/events');
        setEvents(response.data); // Adjust based on your actual API response structure
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Events Near You</h1>
      {/* Ensure events are passed down as props */}
      <EventMap events={events} />
    </div>
  );
}

export default Home;


