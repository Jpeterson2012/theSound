import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Album.css'
import Loading from "../components/Loading/Loading.jsx"
import Track from "../components/Track/Track.jsx";



export default function Album({SpinComponent, active, paused}) {
    const navigate = useNavigate()
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    var zip = JSON.parse(sessionStorage.getItem("artist")).map(function(e,i){
      return [e, JSON.parse(sessionStorage.getItem("artist_id"))[i]]
    })
    

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
      //This fixes render bug where fetch doesn't activate when clicking on currently playing album
    }, [sessionStorage.getItem("artist")]);
    
    const listItems = tracks.items?.map(t => 
      <Track 
        uri={"spotify:album:" + lastSegment}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={null}
      />
    )
    return (
      <>

        {isLoading ? <Loading /> : (
          <>
           
          <div style={{display: 'flex', flexDirection: 'column', marginTop: '80px',marginBottom: '20px'}}>
            <span style={{marginLeft: '28vw', marginTop: '30px'}}>
              <SpinComponent is_active={active} is_paused={paused}/>
              <img src={sessionStorage.getItem("image")} style={{height: '359px', position: 'relative', right: '495px', bottom: '17px', zIndex: '1'}} />
              {/* <Card 
              id={sessionStorage.getItem("id")}
              image={sessionStorage.getItem("image")}
              name={sessionStorage.getItem("albumname")}
              artist={sessionStorage.getItem("artist")}
              /> */}
              
            </span>
            <h2>{zip.map(s =>
            <>
              <a onClick={function handleClick() {
                navigate(`/app/artist/${s[1]}`)
              }} style={{fontWeight: 'bolder'}}>{s[0] + " "}</a> 
              </>
            )}</h2>

            <div style={{display: 'inline-flex'}}><span className="lol" style={{marginRight: '500px'}}>Title</span><span className="lol" style={{marginLeft: '500px'}}>Duration</span></div>
          </div>
          {listItems}
          <p style={{marginBottom: '50px'}}></p>
          </>
        )}

      </>
    )
}