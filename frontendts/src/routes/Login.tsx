import './Login.css'
import {useEffect} from 'react';
import logo from '../images/logo.png'
import Loading2 from '../components/Loading2/Loading2.tsx'

export default function Login() {       
  useEffect(() => {
    setTimeout(() => {
      sessionStorage.clear();
    }, 500);
  }, []);

  const URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
      ? import.meta.env.VITE_URL 
      : import.meta.env.VITE_PROD_URL;
  
  return (
    <>
      <Loading2 />

      <div className='loginImage' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img className='introImg' src={logo} alt='Avatar'/>

        <h1 style={{fontSize: '3.2em', lineHeight: '1.1'}} className="intro">TheSound<sup>TM</sup></h1>
      </div>

      <button 
        style={{color: 'black', background: '#7a19e9', borderRadius: '10px', fontWeight: 'bolder'}} 
        className="home"
        onClick={(e) => {
          location.href = URL + '/login';
          console.log(e.currentTarget.disabled)
          e.currentTarget.disabled = true;
          console.log(e.currentTarget.disabled)

          //sessionStorage.setItem("token", "something")
        }}
      >
        Login
      </button>      
    </>
  );
};