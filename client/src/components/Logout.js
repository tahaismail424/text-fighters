import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const navigate = useNavigate();

    const linkFunction = (e) => {
        e.preventDefault();
        return fetch('auth/logout', {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (res.ok) navigate("/")
        })
        .catch(err => alert("error! please try logging out again"))
    }

    return (
        <button onClick={linkFunction}>Logout</button>
    )
}

export default Logout;