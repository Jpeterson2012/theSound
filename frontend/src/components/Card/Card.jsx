//session storage variables id, uri, image, albumname, and artist are set here

import './Card.css'
import { useNavigate } from 'react-router-dom';

export default function Card( {id, uri, image, name, artist, a_id} ) {
    const navigate = useNavigate()
    return (
        <div className="card">

            <a onClick={function handleClick() {
                sessionStorage.setItem("id", id)
                sessionStorage.setItem("uri", uri)
                sessionStorage.setItem("image", image)
                sessionStorage.setItem("albumname", name)
                sessionStorage.setItem("artist", artist)
                
                navigate(`/app/album/${id}`)
            }}> <img src={image} alt="Avatar" style={{width:'80%',height:'190px'}}/>
            </a>
            <div className="container">
                 <h4><b>{name}</b></h4>

                <a onClick={function handleClick() {
                    navigate(`/app/artist/${a_id}`)
                }}> <p><b>{artist}</b></p>
                </a>
                
            </div>
            
        </div>
    );
}