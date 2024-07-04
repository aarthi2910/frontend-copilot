import React, { useState } from "react";
import './Signup.css';
import {FaEye, FaEyeSlash,FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { setRole, setToken, setUsername, setUseremail} from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                // throw new Error('Signup failed');
                console.log('Signup failed');
            }

            const data = await response.json();
            console.log('Signup success:', data);
            console.log(data['status']);

            if (data['access_token']) {
                setToken(data['access_token']);
                setUsername(data['user_name']);
                setUseremail(data['user_email']);
                setRole(data['role']);
                navigate('/Home');
            } else {
                console.log('Invalid token received');
            }
        } catch (error) {
            console.error('Error:', error);
            
        }
    };
    return (
        <div className="signup-wrapper">
            <form  onSubmit={handleSubmit} className="signup-form">
                <h1>Sign Up</h1>
                <div className="input-boxes">
                    <input type="text" placeholder="username" 
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required />
                    <FaUser className="icon"/>
                </div>
                <div className="input-boxes">
                    <input type="text" placeholder="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required />
                    <MdEmail className="icon"/>
                </div>
                <div className="input-boxes">
                    <input type={showPassword ? "text" : "password"} placeholder="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required />
                    <span onClick={handleTogglePassword} className="toggle-password">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <div className="input-boxes">
                    <input type={showPassword ? "text" : "password"} placeholder="confirm-password" 
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     required />
                    <span onClick={handleTogglePassword} className="toggle-password">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button type="submit">Signup</button>
                <div className="login-link">
                    <p>Already have an Account? <a href="/"> Login</a></p>
                </div>
            </form>
        </div>
    );
}

export default Signup;