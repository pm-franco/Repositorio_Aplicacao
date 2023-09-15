import React, {useCallback, useState} from 'react';
import './SignUp.css'
import {useNavigate} from 'react-router-dom';
import {insts} from "../Extra/Helper";

function SignUp() {

    const navigate = useNavigate();

    const [inst, setInst] = useState("FCT")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pw, setPw] = useState("")
    const [pwConf, setPwConf] = useState("")
    const [error, setError] = useState("")

    const CreateUser = useCallback( () => {
        fetch('http://localhost:8080/user/', {
            method: 'post',
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({  "email": email,
                "name": name,
                "password": pw,
                "university": inst,
                "role" : "student"
            })
        })
            .then(response =>
            {
                if(response.status === 201){
                    navigate("/login")
                }
                else{
                    return response.text()
                }
            }).then(r=> r && setError(r))
            .catch(r=> console.log(r))
    }, [inst, name, email, pw, navigate])

    function checkParameters(){
        if(name.length === 0 || email.length === 0 || !email.includes("@") || !email.includes(".")
            || pwConf.length === 0  || pw.length === 0 || pwConf !== pw)
            return true
        return false
    }

    const onInputChange = (e:any) => {
        const { value } = e.target;

        const re = /[a-z, ]/i;
        if (value === "" || re.test(value)) {
            setName(value);
        }
    }

    return(
        <div className="SignUp">
            <main>
                <section className="signup-section">
                    <>
                    <h1>Sign Up</h1>
                    <form className="inputs horizontal-form">
                        <div className="form-section">
                            <label className={"required"}> Name</label>
                            <input type={"text"} name="name"
                                   value={name}
                                   onChange={onInputChange} required={true}/>
                            <label className={"required"}> Email </label>
                            <input type="email" onChange={e=>setEmail(e.target.value)} required={true}/>

                            <label className={"required"}> Institution </label>
                            <select onChange={e=> setInst(e.target.value)}>{insts.length> 0? insts.map((s) => <option key={s}>{s}</option>) : <option key={0}>{"No Institutions Registed"}</option>}</select>
                        </div>
                        <div className="form-break"></div>
                        <div className="form-section">
                            <label className={"required"}> Password </label>
                            <input type="password" onChange={e=> setPw(e.target.value)}required={true}/>
                            <label className={"required"}> Password Confirmation </label>
                            <input type="password" onChange={e=> setPwConf(e.target.value)}required={true}/>
                        </div>
                    </form>
                </>
                    <button disabled={checkParameters()} onClick={() => {
                        CreateUser();
                    }}>Sign In</button>
                    <p className="error">
                        {error.length > 0 && setTimeout(
                            () => setError(""),
                            2000
                        ) && error}</p>
                </section>
            </main>
        </div>
    );
}

export default SignUp;
