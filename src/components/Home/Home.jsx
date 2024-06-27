// import React from "react";

// const Home = () => {
//     return(
//         <div>This is the home page</div>
//     )
// }
// export default Home;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, EnvelopeSimple, Paperclip, User, SignOut } from 'phosphor-react';
import {fetchToken } from "../utils/Auth";
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
    const navigate = useNavigate();
    const token = fetchToken() ;
    const [inputText, setInputText] = useState("");
    const fileInputRef = useRef(null);


    const verifyToken = async () => {
        const token = localStorage.getItem('token');
        console.log(token);
        try {
            const response = await fetch(`http://localhost:8000/auth_test/${token}`);
            const data = await response.json();
            console.log(data);

            if (data) {
                return true;
            } else {
                console.log("Token verification failed");
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            localStorage.removeItem('token');
            navigate('/');
        } 
    };
    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <div className="profile-page">
            <div className="content-wrapper">
                <aside className='sidebar-styled'>
                    <div className='sidebar-top'>
                        <button className='sidebar-item'><Plus weight='bold' size={20} /> New chat</button>
                    </div>
                    <div className='sidebar-bottom'>
                        <div className='sidebar-item'>
                            <User weight='bold' size={20} /> 
                        </div>
                            <div className="popup-box">
                                <div className='sidebar-item disabled'>
                                    <EnvelopeSimple weight='bold' size={20} className="emailIcon" /> 
                                </div>
                                <div className='sidebar-item' >
                                    <SignOut weight='bold' size={20} className="signoutIcon" /> Sign out
                                </div>
                            </div>
                    </div>

                </aside>
                <div className="main-content">
                    <nav className="navbar-styled">
                        <p>Knowledge Base</p>
                    </nav>
                    <div className="main-content1">
                        <div className="response-container">
                        </div>
                        <div className="input-container">
                            <form className="input-form">
                                <input
                                    type="text"
                                    placeholder="Type your message here"
                                    value={inputText}
                                    className="input-field"
                                />
                                <button type="submit" className="send-button">Send</button>
                            </form>
                                <Paperclip
                                    weight="bold"
                                    size={25}
                                    className="paperclip-icon"
                                />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                 accept=".pdf,.xlsx,.txt,.pptx"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


