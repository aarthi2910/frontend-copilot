// import React, { useState } from "react";
import './LoginForm.css';
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { fetchToken, setToken } from "../utils/Auth";
import { useState } from "react";

export default function LoginForm(){
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const LoginForm = async (event) => {
        event.preventDefault();
        if(email == '' || password == ''){
            console.log("Email and Password cannot be empty");
            return;
        }
        try{
            const response = await fetch('http://localhost:8000/login',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({email,password}) 

            });
            if(!response){
                console.log('Network response not ok');
                return;
            }
            const data = await response.json();
            console.log(data);

            if(data['access_token']){
                setToken(data['access_token']);
                navigate('/Home');
            }else{
                console.log('Invalid Token');
            }

        } catch (error){
            console.log('Invalid Credetials')
        }
    }

    return (
        <div className="wrapper">
            <form className='login-form' onSubmit={LoginForm}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="email" placeholder="username" required 
                    onChange={(e) => setEmail(e.target.value)}/>
                    <FaUser className="icon"/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="password" required
                    onChange={(e) => setPassword(e.target.value)} />
                    <FaLock className="icon"/>
                </div>
                {/* <div className="remember-forgot">
                    <label><input type="checkbox"  onChange={(e) => setRememberme(e.target.checked)}/>Remember me </label>
                    <a href="#"> Forget Password?</a>
                </div> */}
                <button type="submit" >Login</button>
                <div className="register-link">
                    <p>Don't have an account? <a href="/Signup">Signup</a></p>
                </div>
            </form>
        </div>
    );
}
