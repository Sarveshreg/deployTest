
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/api/profile/123'); // Replace '123' with the actual user ID
        setProfileData(response.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch user profile');
      }
    };

    fetchProfileData();

    return () => {
      
    };
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {error && <div>Error: {error}</div>}
      {profileData && (
        <div>
          <p>Username: {profileData.username}</p>
          <p>Email: {profileData.email}</p>
          <p>Location: {profileData.location}</p>

          {/* Display events created */}
          <h3>Events Created</h3>
          <ul>
            {profileData.eventsCreated.map(event => (
              <li key={event.id}>{event.name}</li>
            ))}
          </ul>

          {/* Display events RSVP'd */}
          <h3>Events RSVP'd</h3>
          <ul>
            {profileData.eventsRSVPd.map(event => (
              <li key={event.id}>{event.name}</li>
            ))}
          </ul>

          {/* Display current connections */}
          <h3>Current Connections</h3>
          <ul>
            {profileData.connections.map(connection => (
              <li key={connection.id}>{connection.name}</li>
            ))}
          </ul>

          {/* Display connection requests */}
          <h3>Connection Requests</h3>
          <ul>
            {profileData.connectionRequests.map(request => (
              <li key={request.id}>{request.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Profile;
