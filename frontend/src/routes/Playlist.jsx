import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.jsx";
import Loading from "../components/Loading/Loading.jsx";
import './Playlist.css'

function mainImage(url) {
  return (<img src={url} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>)
}

function listImages(last, ptracks) {
  if (last == 'likedsongs'){
    return (<img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>)
  }
  else{
    return (
      ptracks.images?.length == 1 ? ptracks.images?.map(s => mainImage(s.url)) :
      ptracks.images?.filter(t=>t.height == 640).map(s => mainImage(s.url))
    )
  }
}
function userPlaylists(ptracks, last, liked, paused) {
  var key = 0
  return (
    ptracks?.tracks?.map(t =>

      <div style={{display: 'flex', alignItems: 'center'}}>
          {last == 'likedsongs' ? liked.push(t.uri) : liked = null }
          <img src={t.images.filter(t=>t.height == 64).map(s => s.url)} style={{height: '64px', width: '64px'}}/>
          <PTrack 
          uri={ptracks.uri}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked}
          artist={t.artists}
          t_uri={t.uri}
          pause={paused}
          />
        <p hidden>{key++}</p>
      </div>
    )
  )
}

function regPlaylists(ptracks, last, paused){
  var key = 0
  return (
    ptracks?.map(t => 
      <div style={{display: 'flex', alignItems: 'center'}} >
          
          <img src={t.album?.filter(t=>t.height == 64).map(s => s.url)} />
          <PTrack 
          uri={"spotify:playlist:" + last}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={null}
          artist={t.artists}
          t_uri={t.uri}
          pause={paused}
          />
        <p hidden>{key++}</p>
      </div>
    )
  )
}


export default function Playlist({plists, liked, set_liked, SpinComponent, active, paused}) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  var liked_uris = []
  const [ptracks, setpTracks] = useState([]);
  const [loading, setLoading] = useState(false)
  const [sorted, setSorted] = useState(false)
  const [u_plist, setU_plist] = useState(true)
  const[total, setTotal] = useState(null)
  useEffect (() => {
    
    setSorted(false)
    setLoading(true)
    
    lastSegment == 'likedsongs' ? setpTracks(liked) : setpTracks(plists?.find((e) => e.playlist_id === lastSegment))
    setLoading(false)
    
    if ((plists?.find((e) => e.playlist_id === lastSegment)) === undefined && lastSegment !== 'likedsongs') {
      setU_plist(false)
      
     const fetchpTracks = async () => {
      setLoading(true)
      const resp = await fetch(`http://localhost:8888/auth/ptracks/${lastSegment}`)
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
          total ? null : setTotal(JSON.parse(chunk).total),
          temp = JSON.parse(chunk).items,
          a.push(...temp),  
          setpTracks([...a]) )
          : {}
          
      }
    }
    fetchpTracks()
  }
    
  }, [sessionStorage.getItem("playlist_name")]);

  return (
    <div style={{marginTop: '120px'}}>
    <span className="fade-in-image" style={{marginLeft: '24vw'}}>
          <SpinComponent is_active={active} is_paused={paused}/>
          {u_plist ? listImages(lastSegment, ptracks) : <img src={sessionStorage.getItem("p_image")} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>}
        </span>
      {loading ? <Loading yes={true} /> : (
        
        <div>
        
        
          
          <div style={{marginBottom: '60px'}}>
            
            <h2>{sessionStorage.getItem("playlist_name")}</h2>
            <div className="dropdown" id="dropdown" style={{right: '-300px'}}>
                  <button className="dropbtn">Sort</button>
                  <div className="dropdown-content">
                    {/* {u_plist ? null : (
                  <button className="theme" onClick={function handleClick(){

                    let temp = [...ptracks]
                    
                    
                    temp.sort((a,b) => a.name.localeCompare(b.name))
                    
                    setpTracks(temp)
                    setSorted(true)
                    // set_liked(temp2)
                  }}>A-Z</button>
                )} */}
                  </div>
                </div>
            
              <div style={{display: 'flex', marginRight: '10px'}}>
                <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                <h5 style={{color: 'rgb(90, 210, 216)'}}>{total ? total : ptracks?.tracks?.length} Songs</h5>

                
              </div>
              
            


            <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol">Title</span><span className="lol" style={{marginLeft: '65vw'}}>Duration</span></div>
            {u_plist ? userPlaylists(ptracks, lastSegment, liked_uris, paused) : regPlaylists(ptracks, lastSegment, paused)}
            
          </div>
        </div>
      )}
    </div>
  )
}