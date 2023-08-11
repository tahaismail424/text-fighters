import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../components/Logout';

const Dashboard = () => {

    const [ userInfo, setUserInfo ] = useState({});

    const [ error, setError ] = useState("");

    useEffect(() => {
        fetch("users/cur-user", { method: 'GET' })
            .then(res => {
                if (res.ok) return res.json()
            })
            .then(data => {
                return setUserInfo(data);
            })
            .catch(err => setError(err.message))
    }, []);
    
    return (
        <div>
            <Logout />
            <div>{JSON.stringify(userInfo)}{error}</div>
            <button><Link to="/add-friends">Add Friends!</Link></button>
        </div>
    )
}

export default Dashboard