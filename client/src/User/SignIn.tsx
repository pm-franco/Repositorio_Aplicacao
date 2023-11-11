import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./SignIn.css";
import {API_BASE_URL} from "../Extra/Helper";

function SignIn({handleData}:any) {

    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [pw, setPw] = useState("")
    const [error, setError] = useState("")
    let emailStorage = localStorage.getItem("email")


    useEffect(() => {
        if(emailStorage !== null && emailStorage !== "" )
            navigate("/")
    },[emailStorage, navigate])

    const Login = useCallback( () => {
        fetch(API_BASE_URL+'user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  "email": email,
                "password": pw
            })
        })
            .then(response =>
            {
                if(response.status === 200){
                    response.json().then(r => {
                        handleData(r.role, email, r.name)
                    })
                    navigate("/")
                }
                else{
                    return response.text()
                }
            }).then(r=> r && setError(r))
            .catch(r=> console.log(r))
    }, [email, pw, navigate, handleData])

    return (
        <div className="Login">
            <main>
            <section>
                <h1>Sign In</h1>
            <form>
                <p>
                <label>Email </label>
                <input type="email" onChange={e=> setEmail(e.target.value)}/>
                </p>
                <p>
                <label>Password </label>
                <input type="password" onChange={e => setPw(e.target.value)}/>
                </p>
            </form>
                <button disabled={email.length === 0 || pw.length ===0 || !email.includes("@") || !email.includes(".")} onClick={() => {
                    Login()
                }
                }>Log in</button>
                <p className="error">
                    {error.length > 0 && setTimeout(() => setError(""),2000) && error}</p>
                </section>
            </main>
        </div>
    );
}

export default SignIn;
