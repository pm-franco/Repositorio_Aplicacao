import React, {useCallback, useEffect, useState} from 'react';
import "./LayerNamePage.css";
import {useNavigate} from "react-router-dom";
import {ADMIN, API_BASE_URL} from "./Helper";

function SecretsPage() {

    const [type, setType] = useState("")
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    
    const [error, setError] = useState("")
    const [secrets, setSecrets] = useState([])
    const navigate = useNavigate();

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    },[emailLogged, roleLogged])

    useEffect(() => {
        if (roleLogged !== ADMIN)
            navigate("/")
    }, [navigate, roleLogged])

    useEffect(() => {
        fetch(API_BASE_URL+'secrets/all/', {
            method: 'GET'
        })
            .then(response => {
                return response.json()
            })
            .then(data => {setSecrets(data);
                if (type === "")
                    setType(data[0]["type"])})
            .catch(r => console.log(r))
    }, [secrets, type])

    const updateSecret = useCallback(() => {
        fetch(API_BASE_URL+'secrets/', {
            method: "put",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "type": type,
                "value": password,
                "newValue": newPassword,
                "user": emailLogged
            })
        })
            .then(response => {
                if (response.status === 200) {
                    refreshPage()
                } else {
                    return response.text()
                }
            }).then(r => r && setError(r))
            .catch(r => console.log(r))
    }, [password, emailLogged, newPassword, type])

    function refreshPage() {
        window.location.reload();
    }

    function checkParameters(){
        if(type === "" || password === "" || newPassword === "")
            return true
        return false
    }

    return (
        <div className="LayerName">
            <main>
                <section>
                    <div className={"horizontal-form"}>
                        <div className={"form-section"}>
                            <h3 className={"titles"}>Secrets</h3>
                            <p>
                                <label className={"required"}>Secret to Update</label>
                            </p>
                            <p>
                            <select onChange={e =>setType(e.target.value)}>
                                {secrets && secrets.map((k) =>
                                    <option key={k["type"]} value={k["type"]}>{k["type"]}</option>)}
                            </select>
                            </p>
                            <p>
                                <label className={"required"}>Current Password</label>
                            </p>
                            <p><input type={"password"} placeholder={"write original password"} value={password}
                                      onChange={e => setPassword(e.target.value)}/></p>
                            <p>
                                <label className={"required"}>New Password</label>
                            </p>
                           <p><input type={"password"} placeholder={"write new password"} value={newPassword}
                                   onChange={e => setNewPassword(e.target.value)}/></p>
                            <button className={"btn"} disabled={checkParameters()} onClick={() => updateSecret()}>Update Secret</button>
                        </div>
                    </div>
                    <p className="error">
                        {error.length > 0 && setTimeout(() => setError(""), 2000) && error}</p>
                </section>
            </main>
        </div>
    );
}

export default SecretsPage;
