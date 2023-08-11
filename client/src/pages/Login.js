import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';

const Login = () => {
    
    const navigate = useNavigate();

    const [error, setError] = useState("");


    const handleSubmit = (e, formData) => {

        e.preventDefault();

        const userData = {
            username: formData["username"],
            password: formData["password"]
        }

        return fetch("auth/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(res => {
            if (res.ok) navigate('/dashboard');
            throw new Error('Username or password is invalid');
        })
        .catch(err => setError(err.message));
        
    }
    return (<div>
            <h1>Login</h1>
            <Form formType="login" handleSubmit={handleSubmit}/>
            {error ? <p>{error}</p> : <></>}

    </div>)
}

export default Login