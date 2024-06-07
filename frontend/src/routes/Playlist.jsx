import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.jsx";
import Loading from "../components/Loading/Loading.jsx";



export default function Playlist({plists, SpinComponent, active, paused}) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  const [ptracks, setpTracks] = useState([]);
  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect (() => {
    const headers = {
      Authorization: 'Bearer ' + sessionStorage.getItem("token")
  }
      setpTracks(plists.find((e) => e.playlist_id === lastSegment))
      const getImage = async () => {
        setLoading(true)
        const resp = await fetch(`https://api.spotify.com/v1/playlists/${lastSegment}/images`, {headers})
        const data = await resp.json()
        setLoading(false)
        console.log(data)
        setImage(data)
      }
      getImage()
    // const fetchpTracks = async () => {
    //     try {
    //         var temp = await fetch(`http://localhost:8888/auth/ptracks/${lastSegment}`)
    //       .then((res) => {
    //         // console.log(res.json())
    //         return res.json();
    //       }).then((data) => {return data})
    //         return temp
    //       }
    //       catch (err) {}
    // }
    // const assignpTracks = async () => {
    //   setIsLoading(true)
    //   const tempTracks = await fetchpTracks()
    //   setIsLoading(false)
    //   setpTracks(tempTracks)
    //   console.log(tempTracks)
    // }
    // assignpTracks()
    
  }, []);
  
  const listImages =  image.length == 1 ? image.map(s => <img src={s.url} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>) :
   image.filter(t=>t.height == 640).map(s =>
    <img src={s.url} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>
  )
  var key = 0
  const listItems = ptracks.tracks?.map(t =>
    
      <div style={{display: 'flex', alignItems: 'center'}}> 
          <img src={t.images.filter(t=>t.height == 64).map(s => s.url)} />
          <PTrack 
          uri={ptracks.uri}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          />
        <p hidden>{key++}</p>
      </div>
    )
  return (
    <>
      {loading ? <Loading /> : (
        <div style={{marginTop: '50px'}}>
        <span style={{marginLeft: '24vw'}}>
          <SpinComponent is_active={active} is_paused={paused}/>
          {listImages}
        </span>
        
          
          <div style={{marginBottom: '60px'}}>
            
            <h2>{sessionStorage.getItem("playlist_name")}</h2>
            <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol" style={{marginRight: '500px'}}>Title</span><span className="lol" style={{marginLeft: '500px'}}>Duration</span></div>
            {listItems}
            
          </div>
        </div>
      )}
  
    </>
  )
}