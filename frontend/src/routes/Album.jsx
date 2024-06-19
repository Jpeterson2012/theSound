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
        console.log(tempTracks)
        setTracks(tempTracks)

      }
      assignTracks()
      //This fixes render bug where fetch doesn't activate when clicking on currently playing album
    }, [sessionStorage.getItem("artist")]);
    
    const listItems = tracks.albums?.tracks?.items.map(t => 
      <Track 
        uri={tracks.albums.uri}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={null}
        artist={t.artists}
      />
    )
    return (
      <>
        <div style={{display: 'flex', flexDirection: 'column', marginTop: '80px',marginBottom: '20px'}}>
            <span className="fade-in-image" style={{marginLeft: '28vw', marginTop: '30px'}}>
              <SpinComponent is_active={active} is_paused={paused}/>
              <img src={sessionStorage.getItem("image")} style={{height: '359px', position: 'relative', right: '495px', bottom: '17px', zIndex: '1'}} />
              {/* <Card 
              id={sessionStorage.getItem("id")}
              image={sessionStorage.getItem("image")}
              name={sessionStorage.getItem("albumname")}
              artist={sessionStorage.getItem("artist")}
              /> */}
              
            </span>
            {isLoading ? <Loading yes={true} /> : (
              <>
            <h2>{zip.map((s,i,row) =>
            <>
              <a onClick={function handleClick() {
                navigate(`/app/artist/${s[1]}`)
              }} style={{fontWeight: 'bolder'}}>{row.length - 1 !== i ? s[0] + ", " : s[0]}</a> 
              </>
            )}</h2>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
              <div style={{display: 'flex', marginRight: '10px'}}>
                <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>{tracks.albums?.album_type === 'single' && tracks.albums?.total_tracks > 1 ? 'EP' : tracks.albums?.album_type } &#8226;</h5>
                <h5 style={{color: 'rgb(90, 210, 216)'}}>{tracks.albums?.total_tracks === 1 ? tracks.albums?.total_tracks + " Song" : tracks.albums?.total_tracks + " Songs" }</h5>
              </div>
              {tracks.images?.map(a => a.filter(b => b.height === 160).map(c => <img src={c.url} style={{borderRadius: '50%', height: '40px'}} />))}
            </div>
            </>
            )}
            
            

            <div style={{display: 'inline-flex'}}><span className="lol">Title</span><span className="lol" style={{marginLeft: '65vw'}}>Duration</span></div>
          </div>
        {isLoading ? <Loading yes={true} /> : (
          <>
           
          
          {listItems}
          <div style={{display: 'flex', flexDirection: 'column', marginTop: '50px', marginBottom: '50px'}}>
          {tracks.images?.map(a => a.filter(b => b.height === 320).map(c => <img src={c.url} style={{ height: '90px', width: '90px'}} />))}
          </div>
          
          <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>Release Date: {tracks.albums?.release_date}</h5>
          <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>{ tracks.albums?.copyrights[0]?.text} </h5>
          <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>(R) {tracks.albums?.label}</h5>
          <p style={{marginBottom: '50px'}}></p>
          </>
        )}

      </>
    )
}