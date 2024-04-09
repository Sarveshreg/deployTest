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
  const [userLocation, setUserLocation] = useState({lat:47.5951518, lng:-122.3316393});
  const navigate = useNavigate();

  const handleMarkerClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  useEffect(() => {
    const checkGoogleMapsApi = () => {
      if (window.google) {
        navigator.geolocation.getCurrentPosition(   //get the current position of the user to center the map
          (position) => {
            setUserLocation({lat:position.coords.latitude, lng:position.coords.longitude});

          },
          (error) => {
            console.log(error);
          }
        );
        setMapIsReady(true);
      } else {
        setTimeout(checkGoogleMapsApi, 1000);
      }
    };

    checkGoogleMapsApi();
  }, [mapIsReady]);

  if (!mapIsReady) {
    return <div>Loading Maps...</div>;
  }

  return (
  <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: userLocation.lat, lng: userLocation.lng }}
      zoom={10}
    >
      {events.map(event => (
        <Marker
          key={event.id}
          position={{ lat: event.Latitude, lng: event.Longitude }}
          onClick={() => setSelectedEvent(event)}
        />
      ))}
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
