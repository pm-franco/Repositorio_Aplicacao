import React from 'react';
import {useNavigate} from 'react-router-dom';
import "./Home.css";
import {GREETING} from "../Extra/Helper";
import Buttons from "../Extra/Buttons";

function Home(){
    const navigate = useNavigate();

    return (
        <div className={"Home"}>
            <main>
                <section>
                    <div className={"image-background"}>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
