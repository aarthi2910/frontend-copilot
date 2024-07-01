// import React, { useState } from "react";
import './LoginForm.css';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash ,FaUser} from "react-icons/fa";
import { setRole, setToken, setUsername, setUseremail, setStatus, fecthStatus} from "../utils/Auth";
import { useState } from "react";

// changes
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// changes

export default function LoginForm(){
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };
    
    const successNotify = (status) => {
        toast.success(status, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }
    setTimeout(() => {
    if (fecthStatus() === "signed_out"){
        console.log("signed out successfully")
        successNotify("Signed out successfully")
       
            localStorage.removeItem("status") 
        
        
    }else{
        console.log("doesnt exit")
    }
}, 2000);
    

    const LoginForm = async (event) => {
        event.preventDefault();
        if(email === '' || password === ''){
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
                setUsername(data['user_name']);
                setUseremail(data['user_email']);
                setRole(data['role']);
                setStatus(data['detail'])
                navigate('/Home');
            }else{
                errorNotify(data['detail'])
                console.log('Invalid Token');
            }

        } catch (error){
            console.log('Invalid Credetials')
        }
    }

    const errorNotify = (status) => {
        toast.error(status, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
    }

    return (
        <div>
            <div className="wrapper">
                <form className='login-form' onSubmit={LoginForm}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="email" placeholder="username" required 
                        onChange={(e) => setEmail(e.target.value)}/>
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type={showPassword ? "text" : "password"} placeholder="password" required
                        onChange={(e) => setPassword(e.target.value)} />
                        <span onClick={handleTogglePassword} className="toggle-password">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {/* <div className="remember-forgot">
                        <label><input type="checkbox"  onChange={(e) => setRememberme(e.target.checked)}/>Remember me </label>
                        <a href="#"> Forget Password?</a>
                    </div> */}
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/Signup" >Signup</a></p>
                    </div>
                </form>
            
            </div>
            <ToastContainer />
        </div>
    );
}
