



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
      <h1>Events Near You!</h1>
      {/* Ensure events are passed down as props */}
      <EventMap events={events} />
    </div>
  );
}

export default Home;


