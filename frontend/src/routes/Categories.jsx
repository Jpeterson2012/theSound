//session storage variable p_image created here for fetch purpose

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading/Loading.jsx"
import './Categories.css'



export default function Categories() {
    const navigate = useNavigate()
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    const [clists, setClists] = useState(null);
    const [loading, setLoading] = useState(false)
    

    useEffect (() => {
        const fetchcPlaylists = async () => {
            setLoading(true)
            const resp = await fetch(`http://localhost:8888/auth/cplaylists/${lastSegment}`)
            // const data = await resp.json()
            setLoading(false)
            let reader = resp.body.getReader()
            let result
            let temp
            let a = []
            let decoder = new TextDecoder('utf8')
            while(!result?.done){
                result = await reader.read()
                let chunk = decoder.decode(result.value)
                console.log(chunk ? JSON.parse(chunk) : {})
                chunk ? (
                temp = JSON.parse(chunk).playlists,
                a.push(...temp),  
                setClists([...a]) )
                : {}
                
            }
            // setClists(data)
            
        }
        fetchcPlaylists()
    }, []);

    const listPlaylists = clists?.map(a =>
        <a onClick={function handleClick() {
            var parts = a.uri.split(':');
            var lastSegment = parts.pop() || parts.pop();
            sessionStorage.setItem("p_image", a.images.map(s => s.url))
            sessionStorage.setItem("playlist_name", a.name)
            navigate(`/app/playlist/${lastSegment}`)
        }}>
            <div className="card" style={{width: '200px',height: '305px', marginBottom: '50px', background: a.primary_color}}>

            <img src={a.images.map(s => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
            <div className="container">
                <h4><b>{a.name}</b></h4>
                <p><b>{a.description}</b></p>
            </div>

            </div>
        </a>
    )
    
    return (
      <>
      <img className="fade-in-image" src={sessionStorage.getItem("c_icon")} style={{marginTop: '170px', height: '300px'}}/>
      <h2>{sessionStorage.getItem("c_name")}</h2>
      {loading ? <Loading yes={true} /> : (
        <>
        
        <div style={{
            display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingTop: '15px',
        }}>
            {listPlaylists}
        </div>
        </>
        )}
      </>
    )
}