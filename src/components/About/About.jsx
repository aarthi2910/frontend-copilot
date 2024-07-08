import React from "react";
import './About.css';
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();

    return(
        <div className="about">
            <div className="about-page">
                <h1>About Us</h1>
                <h3>Knowledge Base</h3>
                <p>VARPHI KBI ALPHA</p>
            </div>
            <button onClick={() => navigate('/Home')} className="about-back-button">Back</button>
        </div>
    )
}

export default About;
