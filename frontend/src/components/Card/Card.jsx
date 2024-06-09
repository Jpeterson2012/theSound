//session storage variables id, uri, image, albumname, and artist are set here

import './Card.css'
import { useNavigate } from 'react-router-dom';

export default function Card( {id, uri, image, name, artist, a_id} ) {
    const navigate = useNavigate()
    var key = 0
    //This is for displaying multiple artists with their own spotify ids
    var zip = artist.map(function (e, i) {
        return [e, a_id[i]]
    })
    return (
        <div className="card">

            <a onClick={function handleClick() {
                sessionStorage.setItem("id", id)
                // sessionStorage.setItem("uri", uri)
                sessionStorage.setItem("image", image)
                sessionStorage.setItem("albumname", name)
                sessionStorage.setItem("artist", JSON.stringify(artist))
                sessionStorage.setItem("artist_id", JSON.stringify(a_id))
                
                navigate(`/app/album/${id}`)
            }}> <img src={image} alt="Avatar" style={{width:'80%',height:'190px'}}/>
            </a>
            <div className="container">
                 <h4><b>{name}</b></h4>

                <p><b>{zip.map(s =>
                    <>
                    <a onClick={function handleClick() {
                        navigate(`/app/artist/${s[1]}`)
                    }} style={{color: 'rgb(90, 210, 216)', fontWeight: 'bold'}}>{s[0] + " "}</a>
                    <span hidden>{key++}</span>
                    </>
                    )}</b></p>
                
                
            </div>
            
        </div>
    );
}