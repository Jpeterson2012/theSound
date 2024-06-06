import './Login.css'
import logo from '../images/logo.png'
import Loading from '../components/Loading/Loading.jsx'


export default function Login() {
  
    // if (sessionStorage.getItem("token")) {location.href='http://localhost:5173/home'}
    
  return (
    <>
      <Loading />
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src={logo} alt='Avatar' />
        <h1>Welcome to TheSound<sup>TM</sup></h1>
      </div>
      <button className="home"onClick={() => {
        location.href = 'http://localhost:8888/auth/login'
      }}>Login
        </button>
        {/* <p>Coming soon...</p> */}
    </>
  )
}


