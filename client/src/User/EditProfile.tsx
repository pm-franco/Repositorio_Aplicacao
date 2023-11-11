import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import "./SignUp.css";
import {ADMIN, API_BASE_URL, re, RESEARCHER, UNIVERSITIES} from "../Extra/Helper";

function EditProfile(){

    const navigate = useNavigate();
    const [person, setPerson] = useState()
    const location = useLocation();

    const [emailLogged, setEmailLogged] = useState(localStorage.getItem("email"))
    const [roleLogged, setRoleLogged] = useState(localStorage.getItem("role"))

    useEffect(() => {
        setEmailLogged(localStorage.getItem("email"))
        setRoleLogged(localStorage.getItem("role"))
    },[emailLogged, roleLogged])

    useEffect(() => {
        if(emailLogged === null || emailLogged === "" )
            navigate("/")
        fetch(API_BASE_URL+'user/email/'+emailLogged, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data =>  setPerson(data))
            .catch(r => console.log(r))
    }, [person,emailLogged, navigate])


    const [inst, setInst] = useState(location.state.university)
    const [name, setName] = useState(location.state.name)
    const [error, setError] = useState("")
    const [errorPw, setErrorPw] = useState("")
    const [pwL, setPwL] = useState("")
    const [pwR, setPwR] = useState("")
    const [newPw, setNewPw] = useState("")
    const [newPwConf, setNewPwConf] = useState("")
    const [role, setRole] = useState(location.state.role)

    const onInputChange = (e:any) => {
        const { value } = e.target;

        if (value === "" || re.test(value)) {
            setName(value);
        }
    }

    const EditUser = useCallback( () => {
        fetch(API_BASE_URL+'user/', {
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({  "email": emailLogged,
                "name": name,
                "password": pwL,
                "university": inst,
                "role" : role
            })
        })
            .then(response =>
            {
                if(response.status === 200){
                    navigate("/person/" + emailLogged)
                }
                else{
                    console.log(response)
                    return response.text()
                }
            }).then(r=> r && setError(r))
            .catch(r=> console.log(r))
    }, [inst, name, emailLogged, role, navigate, pwL])

    const ChangePassword = useCallback( () => {
        fetch(API_BASE_URL+'user/password', {
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ "email": emailLogged,
                "password": pwR,
                "newPw": newPw
            })
        })
            .then(response =>
            {
                if(response.status === 200){
                    navigate("/person/" + emailLogged)
                }
                else{
                    console.log(response)
                    return response.text()
                }
            }).then(r=> r && setErrorPw(r))
            .catch(r=> console.log(r))
    }, [emailLogged, navigate, pwR, newPw])

    function checkParameters(){
        return name.length === 0 || pwL.length === 0;

    }

    function checkPwParameters(){
        return pwR.length === 0 || newPw.length === 0 || newPwConf.length === 0 || newPw !== newPwConf;
    }

    return(
        <div className="SignUp">
            <main>
                <section className="signup-section">
                        <h1>Edit Profile Data</h1>
                        <form className="inputs horizontal-form">
                            <div className="form-section">
                                <label> Name</label>
                                <input type={"text"} name="name"
                                       defaultValue={name}
                                       onChange={onInputChange}/>
                                <label> Institution</label>
                                <select defaultValue={inst} onChange={e=> setInst(e.target.value)}>{UNIVERSITIES.map((s) => <option key={s}>{s}</option>)}</select>
                                <label>User type </label>
                                <select defaultValue={role} onChange={e=> setRole(e.target.value)}>
                                    <option value="student"> Student</option>
                                    {(roleLogged === RESEARCHER || roleLogged === ADMIN)?<option value="researcher"> Researcher</option>:null}
                                    {roleLogged === ADMIN?<option value="admin"> Admin</option>:null}
                                </select>
                            </div>
                            <div className="form-break"></div>
                            <div className="form-section">
                                <label> Password</label>
                                <input type={"password"} name="password"
                                       onChange={e=> setPwL(e.target.value)} required={true}/>
                            </div>
                        </form>
                    <button disabled={checkParameters()} onClick={() => {
                        EditUser();
                    }}>Edit Data</button>
                    <p className="error">
                        {error.length > 0 && setTimeout(
                            () => setError(""),
                            2000
                        ) && error}</p>
                </section>
                <div className="space-between"></div>
                <section className="signup-section">
                        <h1>Change password</h1>
                        <form className="inputs horizontal-form">
                            <div className="form-section">
                                <label> Password </label>
                                <input type={"password"} name="password"
                                       onChange={e=> setPwR(e.target.value)}/>
                                <label>New Password</label>
                                <input type={"password"} name="password"
                                       defaultValue={newPw}
                                       onChange={e=> setNewPw(e.target.value)}/>
                                <label>Confirm New Password</label>
                                <input type={"password"} name="password"
                                       defaultValue={newPwConf}
                                       onChange={e=> setNewPwConf(e.target.value)}/>
                            </div>
                        </form>
                    <button disabled={checkPwParameters()} onClick={() => {
                        ChangePassword();
                    }}>Change Password</button>
                    <p className="error">
                        {errorPw.length > 0 && setTimeout(
                            () => setErrorPw(""),
                            2000
                        ) && errorPw}</p>
                </section>
            </main>
        </div>
    );
}

export default EditProfile;