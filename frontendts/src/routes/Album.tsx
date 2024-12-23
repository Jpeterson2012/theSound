//Session storage vars ref_id and ref_items created here
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Album.css'
import Loading2 from "../components/Loading2/Loading2.tsx"
import Track from "../components/Track/Track.tsx";



export default function Album({SpinComponent, active, paused}: any) {
    const navigate = useNavigate()
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    const [tracks, setTracks] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false)
    var zip = JSON.parse(sessionStorage.getItem("artist")!).map(function(e: any,i: number){
      return [e, JSON.parse(sessionStorage.getItem("artist_id")!)[i]]
    })
    

    useEffect (() => {
      if (sessionStorage.getItem("ref_id") === lastSegment) {
        setTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
      }
      else{
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
        // console.log(tempTracks)
        setTracks(tempTracks)
        sessionStorage.setItem("ref_id", lastSegment!)
        sessionStorage.setItem("ref_items", JSON.stringify(tempTracks))

      }
      assignTracks()
    }
      //This fixes render bug where fetch doesn't activate when clicking on currently playing album
    }, [sessionStorage.getItem("image")]);
    
    const listItems = tracks.albums?.tracks?.items.map((t: any) => 
      <Track 
        uri={tracks.albums.uri}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={null}
        artist={t.artists}
        t_uri={t.uri}
        pause={paused}
      />
    )
    return (
      <>
        <div style={{display: 'flex', flexDirection: 'column', marginTop: '80px',marginBottom: '20px'}}>
            <span className="fade-in-image" style={{marginLeft: '28vw', marginTop: '30px', marginBottom: '450px', position: 'relative'}}>
              <SpinComponent is_active={active} is_paused={paused}/>
              <img src={sessionStorage.getItem("image")!} style={{height: '359px', position: 'absolute', right: '440px', zIndex: '1'}} />
              {/* <Card 
              id={sessionStorage.getItem("id")}
              image={sessionStorage.getItem("image")}
              name={sessionStorage.getItem("albumname")}
              artist={sessionStorage.getItem("artist")}
              /> */}
              
            </span>
            {isLoading ? <Loading2 yes={true} /> : (
              <>
            <h2>{zip.map((s: any,i: number,row: any) =>
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
              
              {/* <img src={tracks.images?.map(b => b.find(b => b.height > 100).url)} style={{borderRadius: '50%', height: '40px'}} /> */}
              {tracks.images?.map((a: any) => <img src={a.find((b: any) => b.height > 160).url} style={{borderRadius: '50%', height: '40px', width: '40px'}} />)}
            </div>
            </>
            )} 
            
            

            <div style={{display: 'inline-flex'}}><span className="lol">Title</span><span className="lol" style={{marginLeft: '65vw'}}>Duration</span></div>
          </div>
        {isLoading ? <Loading2 yes={true} /> : (
          <>
           
          
          {listItems}
          <div style={{display: 'flex', flexDirection: 'column', marginTop: '50px', marginBottom: '50px'}}>
          {tracks.images?.map((a: any) => <img src={a.find((b: any) => b.height > 160).url} style={{width: '90px', height: '90px'}} />)}
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