import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const EventMap = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapIsReady, setMapIsReady] = useState(false);
  const navigate = useNavigate();

  const handleMarkerClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  useEffect(() => {
    const checkGoogleMapsApi = () => {
      if (window.google) {
        console.log('Google Maps API is loaded and ready to use.');
        setMapIsReady(true);
      } else {
        console.log('Google Maps API is not loaded yet.');
        setTimeout(checkGoogleMapsApi, 1000);
      }
    };

    checkGoogleMapsApi();
  }, []);

  if (!mapIsReady) {
    return <div>Loading Maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: 33.4735, lng: -82.0105 }}
      zoom={10}
    >
      {events.map(event => (
        <Marker
          key={event.id}
          position={{ lat: event.Latitude, lng: event.Longitude }}
          onClick={() => setSelectedEvent(event)}
        />
      ))}

// Map Marker 

      {selectedEvent && (
        <InfoWindow
          position={{ lat: selectedEvent.Latitude, lng: selectedEvent.Longitude }}
          onCloseClick={() => setSelectedEvent(null)}
        >
          <div className="info-window-content">
            <h2 className="info-window-title" style={{ cursor: "pointer" }} onClick={() => handleMarkerClick(selectedEvent.id)}>{selectedEvent.EventTitle}</h2>
            {selectedEvent.Picture && (
              <img
                src={selectedEvent.Picture}
                alt="Event"
                className="info-window-img"
              />
            )}
            <p>{selectedEvent.Details}</p>
            <p>Date and Time: {new Date(selectedEvent.Date).toLocaleString()}</p>
          </div>
        </InfoWindow>
      )}
      
    </GoogleMap>
  );
};

export default EventMap;
