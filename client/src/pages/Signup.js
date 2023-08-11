import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';

const SignUp = () => {

    const navigate = useNavigate();

    const [errors, setErrors] = useState([])

    const handleSubmit = (e, formData) => {

        e.preventDefault();

        const userData = {
            email: formData["email"], 
            username: formData["username"],
            password: formData["password"],
            confirm: formData["confirm"]
        }

        return fetch("auth/create", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.statusCode !== 200) throw new Error(data.messages.toString("|"));
            return navigate('/dashboard');
        })
        .catch((err) => setErrors(err.message.split("|")));
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <Form formType="signup" handleSubmit={handleSubmit}/>
            {errors ? errors.map((error, index) => <p key={index}>{error}</p>) : <></>}
        </div>
    )
}

export default SignUp;