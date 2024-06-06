import { useState } from "react";
import { useEffect } from "react";
import './Album.css'
import Card from '../components/Card/Card.jsx'
import Logo from "../components/Logo/Logo.jsx"
import Loading from "../components/Loading/Loading.jsx"
import Track from "../components/Track/Track.jsx";



export default function Album({SpinComponent, active, paused}) {
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect (() => {
      
      const fetchTracks = async () => {
          try {
              var temp = await fetch(`http://localhost:8888/auth/tracks/${lastSegment}`)
            .then((res) => {
              // console.log(res.json())
              return res.json();
            }).then((data) => {return data})
              return temp
            }
            catch (err) {}
      }
      const assignTracks = async () => {
        setIsLoading(true)
        const tempTracks = await fetchTracks()
        setIsLoading(false)
        setTracks(tempTracks)

      }
      assignTracks()
      
    }, []);
    
    const listItems = tracks.items?.map(t => 
      <Track 
        uri={t.uri}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
      />
    )
    return (
      <>

        {isLoading ? <Loading /> : (
          <>
           
          <div style={{display: 'flex', flexDirection: 'column', marginBottom: '80px'}}>
            <span style={{marginLeft: '28vw', marginTop: '20px'}}>
              <SpinComponent is_active={active} is_paused={paused}/>
              <img src={sessionStorage.getItem("image")} style={{height: '359px', position: 'relative', right: '17vw', bottom: '14px', zIndex: '1'}} />
              {/* <Card 
              id={sessionStorage.getItem("id")}
              image={sessionStorage.getItem("image")}
              name={sessionStorage.getItem("albumname")}
              artist={sessionStorage.getItem("artist")}
              /> */}
              
            </span>
            <h2>{sessionStorage.getItem("artist")}</h2>

            <div style={{display: 'inline-flex'}}><span className="lol" style={{marginRight: '500px'}}>Title</span><span className="lol" style={{marginLeft: '500px'}}>Duration</span></div>
            {listItems}
            
          </div>
          </>
        )}

      </>
    )
}