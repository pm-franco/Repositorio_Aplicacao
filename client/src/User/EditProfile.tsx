import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import "./SignUp.css";
import {ADMIN, RESEARCHER} from "../Extra/Helper";

function EditProfile(){

    const navigate = useNavigate();
    const insts = ["FCT", "Teste", "ABC"]
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
        fetch('http://localhost:8080/user/email/'+emailLogged, {
            method: 'get',
            mode: "cors"
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

        const re = /^[A-Za-z]+$/;
        if (value === "" || re.test(value)) {
            setName(value);
        }
    }

    const EditUser = useCallback( () => {
        fetch('http://localhost:8080/user/', {
            method: 'put',
            mode: "cors",
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
                    alert("User Data Changed")
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
        fetch('http://localhost:8080/user/password', {
            method: 'put',
            mode: "cors",
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
                    alert("Password Changed")
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
        if(name.length === 0 || pwL.length === 0)
            return true
        return false
    }

    function checkPwParameters(){
        if(pwR.length === 0 || newPw.length === 0 || newPwConf.length === 0 || newPw !== newPwConf)
            return true
        return false
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
                                <select defaultValue={inst} onChange={e=> setInst(e.target.value)}>{insts.map((s) => <option key={s}>{s}</option>)}</select>
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