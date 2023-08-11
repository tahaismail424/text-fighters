import React, { useState } from 'react';

const Form = ({ formType, handleSubmit }) => {

    const [formData, setFormData] = useState({
        "email": "",
        "username": "",
        "password": "",
        "confirm": ""
    });

    const updateFormData = (e, typ) => {
        let newData = JSON.parse(JSON.stringify(formData));
        newData[typ] = e.target.value;
        setFormData(newData);
    }

    return (
        <form onSubmit={ (e) => handleSubmit(e, formData) }>
            { formType === "signup" ? <>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" value={formData["email"]} onChange={(e) => updateFormData(e, "email")}/>
                </> : <></>
            }

            <label htmlFor="username">Username:</label>
            <input type="text" name="username" value={formData["username"]} onChange={(e) => updateFormData(e, "username")}/>

            <label htmlFor="password">Password:</label>
            <input type="password" name="password" value={formData["password"]} onChange={(e) => updateFormData(e, "password")}/>

            { formType === "signup" ? <>
                <label htmlFor="confirm-password">Confirm password:</label>
                <input type="password" name="confirm-password" value={formData["confirm"]} onChange={(e) => updateFormData(e, "confirm")}/>
                </> : <></>
            }
            <button type="submit">{ formType === "signup" ? "Sign Up" : "Login" }</button>
        </form>
    )
}

export default Form