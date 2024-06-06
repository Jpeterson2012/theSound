import logo from '../../images/logo.png'
import './Logo.css'
import { useNavigate } from 'react-router-dom'

export default function Logo () {
    const navigate = useNavigate()
    return(
        <div style={{display: 'flex', position: 'relative', top: '5pt', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{marginRight: '50vw'}}>{sessionStorage.getItem("username")}</h2>

            <div class="wrap">
                <div class="search">
                    <input type="text" class="searchTerm" id='searchTerm'  placeholder="What are you looking for?" />
                    <button type="button" class="searchButton" onClick={function handleSubmit() {
                        console.log(document.getElementById("searchTerm").value);
                        const fetchSearch = async () => {
                            const resp = await fetch(`http://localhost:8888/auth/search/${document.getElementById("searchTerm").value}`)
                            const data = await resp.json()
                            console.log(data)
                        }
                        fetchSearch()
                         return false
                         }}>
                        <i class="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}}></i>
                    </button>
                </div>
            </div>
            <a onClick={function handleClick() {navigate('/app/discover')}}>
                <h2>Discover</h2>
            </a>
            <a onClick={function handleClick() {navigate('/app')}}>
                <img style={{width: '80px', height: '80px'}} src={logo} alt="Avatar"/>
            </a>
        </div>
        
    )
}
// location.href='http://localhost:5173/app/'