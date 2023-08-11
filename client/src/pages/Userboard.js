import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Userboard = () => {

  const { username } = useParams();

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState("")

  useEffect(() => {

    // check if user is the current authenticated user and load user dashboard if so
                                
    fetch('users/cur-user', { method: 'GET'})
      .then(res => {
        if (res.ok) return res.json();
        return getUserData()
      })
      .then(data => {
        if (data.username === username) return navigate('/dashboard');
        return getUserData()
      })

    // otherwise load user data into board
    const getUserData = () => fetch(`users/${username}`, { method: 'GET' })
                                .then(res => {
                                  if (res.ok) return res.json()
                                  throw new Error("404 user not found");
                                })
                                .then(data => setUserInfo(data))
                                .catch(err => setError(err.message))
  }, [navigate, username])


  return (
    <div>{userInfo}{error}</div>
  )
}

export default Userboard