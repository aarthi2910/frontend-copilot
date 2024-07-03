import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Plus, EnvelopeSimple, Paperclip, User, SignOut, UserCircle, Robot } from 'phosphor-react';
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { fecthUsername, fecthUseremail, fecthRole,fetchToken, logout, fecthStatus, setStatus } from "../utils/Auth";
import {  FaUser } from "react-icons/fa";
import { RiRobotFill } from "react-icons/ri";


// changes
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// changes


export default function Home() {
    const navigate = useNavigate();
    const token = fetchToken() ;
    const username = fecthUsername();
    const userRole = fecthRole();
    const useremail = fecthUseremail();
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const [messages, setMessages] = useState([]); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const fileInputRef = useRef(null);
    const [tooltipMessage, setTooltipMessage] = useState(null);
    const [isVerified, setIsVerified] = useState(false);


    const verifyToken = async () => {
        // const token = localStorage.getItem('token');
        console.log(token);
        console.log(userRole)
        try {
            // const response = await fetch(`http://localhost:8000/auth_test/${token}`);
            const response = await fetch('http://localhost:8000/authtest',{
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({token}) 

            });

            const data = await response.json();
            console.log(data);

            if (data.detail === "true") {
                setIsVerified(true);
            } else {
                console.log("Token verification failed");
                logout(localStorage);
                navigate('/LoginForm');
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            logout(localStorage);
            navigate('/LoginForm');
        } 
    };
    useEffect(() => {
        // verifyToken();
    }, []);

    if (!isVerified) {
        // return null;
        setIsVerified(true);
    }

    const successNotify = (status) => toast.success(status, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });

    const errorNotify = (status) => toast.error(status, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        
    // const status = fecthStatus()
    const loginStatus = fecthStatus()
    if( loginStatus !== "false"){
        console.log(loginStatus)
        successNotify(loginStatus)
        setStatus("false")
    }

    const signOut = () => {
        logout();
        setStatus("signed_out")
        navigate("/LoginForm");
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
    
        const validExtensions = ['.pdf', '.xlsx', '.txt', '.pptx', '.docx'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
        if (!validExtensions.includes(fileExtension)) {
            setTooltipMessage('Invalid file type. please upload .pdf,.xlsx,.txt,.pptx file.');
            setTimeout(() => {
                setTooltipMessage(null); 
            }, 2000);
            return;
        }
    
        console.log("Selected file:", file);
    
        const formData = new FormData();
        formData.append("file", file);
        localStorage.removeItem("status")
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/upload_file', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('File upload failed');
            }
    
            const data = await response.json();
            console.log('File upload success:', data.detail);
            // setTooltipMessage(data.detail);
            successNotify("uploaded successfully!!") 
        } catch (error) {
            console.error('Error:', error);
            // setTooltipMessage('File upload failed'); 
            errorNotify("upload failed!!")
        } finally {
            setIsLoading(false);
            // setTimeout(() => {
            //     setTooltipMessage(null); 
            // }, 2000);
        }
    };
    
    const onSend = async (event) => {
        event.preventDefault();
        console.log("Text:", inputText);

        // Add the user prompt to the messages list
        setMessages(prevMessages => [...prevMessages, { user: 'user', text: inputText }]);
        setInputText(""); // Clear the input field

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/user/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "query": inputText }),
            });

            if (!response.ok) {
                throw new Error('Text submission failed');
            }

            const data = await response.json();
            console.log('Text submission success:', data.detail);
            setMessages(prevMessages => [...prevMessages, { user: 'bot', text: data.detail }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [...prevMessages, { user: 'bot', text: 'Text submission failed' }]);
        } finally {
            setIsLoading(false); 
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleUserManagement = () => {
        navigate('/UserManagement');
    };

    return (
        <div className="profile-page">
            <div className="content-wrapper">
                {isLoading && (
                    <div className="spinner-overlay">
                        <i className="fas fa-spinner fa-spin fa-3x"></i>
                    </div>
                )}
                <aside className='sidebar-styled'>
                
                     <div className='sidebar-top'>
                        <button className='sidebar-item' onClick={handleUserManagement}>User Management</button>
                        {/* <button className='sidebar-item'><Plus weight='bold' size={20} /> New chat</button> */}
                    </div>
                    <div className='sidebar-bottom'>
                        <div className='sidebar-item' onClick={toggleSidebar}>
                            <User weight='bold' size={20} /> {username}
                        </div>
                        {isSidebarOpen && (
                            <div className="popup-box">
                                <div className='sidebar-item disabled'>
                                    <EnvelopeSimple weight='bold' size={20} className="emailIcon" /> {useremail}
                                </div>
                                <div className='sidebar-item' onClick={signOut}>
                                    <SignOut weight='bold' size={20} className="signoutIcon" /> Sign out
                                </div>
                            </div>
                        )}
                    </div>

                </aside>
                <div className="main-content">
                    <nav className="navbar-styled">
                        <p>Knowledge Base</p>
                    </nav>
                    <div className="main-content1">
                        <div className="response-container">
                            {messages.map((message, index) => (
                                <div key={index} className={`response-value ${message.user}`}>
                                    {message.user === 'user' ? (
                                        <UserCircle size={20} className="message-icon user"/>
                                    ) : (
                                        <Robot size={20} className="message-icon bot"/>
                                    )}
                                    <span>{message.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="input-container">
                            <form onSubmit={onSend} className="input-form">
                                <textarea
                                    type="text"
                                    placeholder="Type your message here"
                                    value={inputText}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    rows={1}
                                />
                                <button type="submit" className="send-button">Send</button>
                            </form>
                            {userRole === 'admin' && (
                                <Paperclip
                                    weight="bold"
                                    size={25}
                                    onClick={handleFileClick}
                                    className="paperclip-icon"
                                />
                            )} 
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept=".pdf,.xlsx,.txt,.pptx"
                            />
                        </div>
                    </div>
                    {tooltipMessage && (
                        <div className="tooltip">
                            {tooltipMessage}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}


