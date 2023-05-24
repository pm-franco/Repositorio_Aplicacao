import React from 'react';
import {useNavigate} from 'react-router-dom';
import "./Home.css";
import {GREETING} from "../Extra/Helper";

function Home(){
    const navigate = useNavigate();

    return (
        <div className="Home">
            <main>
                <div>
                    <h1 className="greeting">{GREETING}</h1>
                    <h1 className="greetingRot">{GREETING}</h1>
                </div>
                <button onClick={() => {
                    navigate("/artworks")
                }}>Explore</button>

            </main>
        </div>
    );
}

export default Home;
