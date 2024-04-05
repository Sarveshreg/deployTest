
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './index.css';

function Home() {
  let navigate = useNavigate();
  return (
    <div className="home">
      <header className="header">
        <nav>
          <ul>
            <li><button className="btn-nav">Home</button></li>
            <li><button className="btn-nav">Events</button></li>
            <li><button className="btn-nav">Groups</button></li>
            <li><button className="btn-profile">Profile</button></li>
            <li><button className="btn-register">Register</button></li>
            <button onClick={(e)=>navigate(`/event/6e533a3c-f367-4a5e-bd93-70de2d48847a`)}>test</button>
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>Discover Local Events and Meet People</h1>
          <p>Find your next experience and meet people who share your interests.</p>
          <button className="btn">Join Now</button>
        </section>
        <section className="featured-events">
          <h2>Featured Events</h2>
        </section>
        <section className="upcoming-events">
          <h2>Upcoming Events</h2>
        </section>
      </main>
      <footer className="footer">
  
      </footer>
    </div>
  );
}

export default Home;



