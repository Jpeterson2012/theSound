import './App.css'
import Login from '../routes/Login.jsx'
import { useEffect } from 'react'

//Newchapter125!

export default function App() {    
    useEffect(() => {
        sessionStorage.setItem("playing", false)
    }, []);

    return ( <Login />)    
}


