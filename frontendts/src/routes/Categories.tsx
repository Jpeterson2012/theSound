//session storage variable p_image created here for fetch purpose
//Session storage vars ref_id and ref_items created here
import './Categories.css'
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Spin } from "../components/Spin/Spin.tsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import { spotifyRequest } from '../utils.ts';

function randColor(){
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
}

export default function Categories() {
    const navigate = useNavigate()
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    const [clists, setClists] = useState<any>(null);
    const [loading, setLoading] = useState(false)    

    const {is_active, playerState} = useContext(UsePlayerContext);

    const [colors, setColors] = useState<any>([]);
    
    useEffect (() => {
        if (sessionStorage.getItem("ref_id") === lastSegment) {
            setClists(JSON.parse(sessionStorage.getItem("ref_items")!))
        }
        else{
            const fetchcPlaylists = async () => {
                setLoading(true)                
                const resp = await spotifyRequest(`/cplaylists/${lastSegment}`);
                const data = await resp.json()
                setLoading(false)
                setClists(data)                 
                
                for (let i = 0; i < data.length; i++) {
                    setColors((prev: any) => [...prev, randColor()])                    
                }                
            }
            fetchcPlaylists()
        }
    }, []);

    const listPlaylists = clists?.map((a: any,index: any) =>
        <a 
            key={index} 
            onClick={() => {            
                const parts = a.uri.split(':');
                const lastSegment = parts.pop() || parts.pop();            
                            
                sessionStorage.setItem("uplist", "false");         

                sessionStorage.setItem("p_image", a.images.map((s: any) => s.uri));
                sessionStorage.setItem("playlist_name", a.name);
                sessionStorage.setItem("cplaylist", JSON.stringify(a.tracks));
                navigate(`/app/playlist/${lastSegment}`);
            }}
        >
            <div className="catCard" style={{background: colors[index]}}>
                <img className="cCardImg" src={a.images.map((s: any) => s.uri)} alt="Avatar"/>

                <div className="container" style={{display: 'flex', justifyContent: 'center'}}>
                    <h4 style={{ background: '#7a19e9', color: 'rgb(90, 210, 216)',borderRadius: '3px' }} ><b>{a.name}</b></h4>                    
                </div>
            </div>
        </a>
    );
    
    return (
        <>
            {Spin(is_active,playerState.is_paused,sessionStorage.getItem("c_icon")!,null)}  

            <h2 className="catHeader" >{sessionStorage.getItem("c_name")}</h2>

            {loading ? <Loading2 yes={true} /> : (
                <>            
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        paddingTop: '15px',
                        paddingBottom: '175px'
                    }}>
                        {listPlaylists}
                    </div>
                </>
            )}
      </>
    );
};