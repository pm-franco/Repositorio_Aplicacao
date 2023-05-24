import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import "./AuthorPage.css";


function AuthorPage(){

const navigate = useNavigate();
const [email, setEmail] = useState("")
const [pw, setPw] = useState("")
const [error, setError] = useState("")
let tk = localStorage.getItem("tk")

if(tk !== null && tk !== "" )
    navigate("/")

const FetchRequest = useCallback( () => {
    fetch('/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email , password: pw})
    })
        .then(response =>
        {
            let a = response.headers.get("Authorization")
            if(a === null || a === "")
                throw ("Wrong data!")
            else{
                localStorage.setItem("tk", a)
                //changeStore()
            }
            //aux(a)
        })
        .catch(r=> setError(r))
}, [email, pw, tk])

const FetchDataS = useCallback(() => {
    fetch('student/email/'+email, {
        method: 'get',
        headers: {'Accept' : 'application/json'}
    }).then(response => {
        if (response.status === 200)
            return  response.json()
        else
            throw ("aa")
    }).then(r => {
        localStorage.setItem("type", "student")
        localStorage.setItem("email", email)
        localStorage.setItem("it", r.institution)
        localStorage.setItem("name", r.name)
    }).catch(error=> error)
}, [email])

const FetchDataR = useCallback( () => {
    fetch('reviewer/email/'+email, {
        method: 'get',
        headers: {'Accept' : 'application/json'}
    }).then(response => {
        if (response.status === 200)
            return  response.json()
        else
            throw ("aa")
    }).then(r => {
        localStorage.setItem("type", "reviewer")
        localStorage.setItem("email", email)
        localStorage.setItem("it", r.institution)
        localStorage.setItem("name", r.name)
    }).catch(error=> error)
}, [email])




    return(
        <div className={"ArtkworkPage"}>
            <main>
                <section>
                    <header>

                    </header>
                </section>
            </main>
        </div>
    );
}

export default AuthorPage;