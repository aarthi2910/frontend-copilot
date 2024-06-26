import React from "react";
import './Signup.css';
import { FaLock, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Signup = () => {
    return (
        <div className="signup-wrapper">
            <form action="">
                <h1>Sign Up</h1>
                <div className="input-boxes">
                    <input type="text" placeholder="username" required />
                    <FaUser className="icon"/>
                </div>
                <div className="input-boxes">
                    <input type="text" placeholder="email" required />
                    <MdEmail className="icon"/>
                </div>
                <div className="input-boxes">
                    <input type="password" placeholder="password" required />
                    <FaLock className="icon"/>
                </div>
                <div className="input-boxes">
                    <input type="password" placeholder="confirm-password" required />
                    <FaLock className="icon"/>
                </div>
                <button type="submit">Signup</button>
                <div className="login-link">
                    <p>Already have an Account? <a href="/LoginForm"> Login</a></p>
                </div>
            </form>
        </div>
    );
}

export default Signup;