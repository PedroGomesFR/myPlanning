import React from "react";
import '../../components/css/LoginPage.css';
import Input from "../common/Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

function LoginPage({ setUser }) {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
          email: '',
          password: ''
      });
  
      const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData({
              ...formData,
              [name]: value
          });
        const errorMessage = validate(name, value);
        setErrorMessages((prev) => ({ ...prev, [name]: errorMessage }));
      };
  
  const [errorMessages, setErrorMessages] = useState({
         email: '',
         password: ''
     });

  const validate = (name, value) => { 
    switch (name) {

      case 'email':
        if (!value) {
          setErrorMessages((prev) => ({ ...prev, email: "Email est obligatoire." }));
        } else {
          setErrorMessages((prev) => ({ ...prev, email: "" }));
        }
        return "";

      case 'password':
        if (!value) {
          setErrorMessages((prev) => ({ ...prev, password: "Password is required." }));
        } else {
          setErrorMessages((prev) => ({ ...prev, password: "" }));
        }
        return "";
    
      default:
        return ""; 
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/records/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = { message: `Error ${response.status}: ${response.statusText}` };
        }
        console.log("Login failed:", data);
        alert("Login failed: " + data.message);
      } else {
        const successData = await response.json();
        console.log("Login successful:", successData);
        localStorage.setItem("user", JSON.stringify(successData.user));
        localStorage.setItem("token", successData.token);
        setUser(successData.user);
        navigate('/profile');
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div className="login-container-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <Input label="Email" type="email" name="email" required={true} onChange={handleChange} errorMessage={errorMessages.email} value={formData.email} />
          <Input label="Mot de passe" type="password" name="password" required={true} onChange={handleChange} errorMessage={errorMessages.password} value={formData.password} />
          <button type="submit">Login</button>
        </form>
        <div>
          <p> Pas encore de compte? <Link to="/register">S'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;