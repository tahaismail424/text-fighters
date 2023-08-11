import React from 'react';
import { Link } from 'react-router-dom';
  
const Home = () => {
   

    return (
    <div>
        <h1 style={{
        fontFamily: 'videophreak',
        color: 'white',
        margin: 'auto',
        textAlign: 'center'
        }}>TextFighters </h1>
        <div style={{
            display: 'flex',
            margin: 'auto',
            justifyContent: 'center'
        }}>
            <button className="home-button"><Link to="sign-up">Sign Up</Link></button>
            <button className="home-button"><Link to="login">Login</Link></button>
        </div>
    </div>
    );
};
  
export default Home;