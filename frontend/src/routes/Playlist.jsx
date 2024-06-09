import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.jsx";
import Loading from "../components/Loading/Loading.jsx";

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
function userPlaylists(ptracks, last, liked) {
  var key = 0
  return (
    ptracks?.tracks?.map(t =>

      <div style={{display: 'flex', alignItems: 'center'}}>
          {last == 'likedsongs' ? liked.push(t.uri) : liked = null }
          <img src={t.images.filter(t=>t.height == 64).map(s => s.url)} />
          <PTrack 
          uri={ptracks.uri}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked}
          />
        <p hidden>{key++}</p>
      </div>
    )
  )
}

function regPlaylists(ptracks, last){
  var key = 0
  return (
    ptracks?.items?.map(t => 
      <div style={{display: 'flex', alignItems: 'center'}}>
          
          <img src={t.track?.album.images.filter(t=>t.height == 64).map(s => s.url)} />
          <PTrack 
          uri={"spotify:playlist:" + last}
          name={t.track?.name}
          number={key}
          duration={t.track?.duration_ms}
          liked={null}
          />
        <p hidden>{key++}</p>
      </div>
    )
  )
}


export default function Playlist({plists, liked, SpinComponent, active, paused}) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  var liked_uris = []
  const [ptracks, setpTracks] = useState([]);
  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(false)
  const [u_plist, setU_plist] = useState(true)
  useEffect (() => {

    setLoading(true)
    
    lastSegment == 'likedsongs' ? setpTracks(liked) : setpTracks(plists.find((e) => e.playlist_id === lastSegment))
    setLoading(false)
    
    if ((plists.find((e) => e.playlist_id === lastSegment)) === undefined && lastSegment !== 'likedsongs') {
      setU_plist(false)
      // const getImage = async () => {
      //   setLoading(true)
      //   const resp = await fetch(`https://api.spotify.com/v1/playlists/${lastSegment}/images`, {headers})
      //   const data = await resp.json()
      //   setLoading(false)
      //   // console.log(ptracks)
      //   setImage(data)
      // }
      // getImage()
    const fetchpTracks = async () => {
        try {
            var temp = await fetch(`http://localhost:8888/auth/ptracks/${lastSegment}`)
          .then((res) => {
            // console.log(res.json())
            return res.json();
          }).then((data) => {return data})
            return temp
          }
          catch (err) {}
    }
    const assignpTracks = async () => {
      setLoading(true)
      const tempTracks = await fetchpTracks()
      setLoading(false)
      console.log(tempTracks)
      setpTracks(tempTracks)
      console.log(tempTracks)
    }
    assignpTracks()
  }
    
  }, []);
  
  // const listImages =  ptracks.images?.length == 1 ? ptracks.images?.map(s => <img src={s.url} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>) :
  //  ptracks.images?.filter(t=>t.height == 640).map(s =>
  //   <img src={s.url} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>
  // )
  

  // const listItems = ptracks?.tracks?.map(t =>

  //     <div style={{display: 'flex', alignItems: 'center'}}>
  //         {lastSegment == 'likedsongs' ? liked_uris.push(t.uri) : liked_uris = null }
  //         <img src={t.images.filter(t=>t.height == 64).map(s => s.url)} />
  //         <PTrack 
  //         uri={ptracks.uri}
  //         name={t.name}
  //         number={key}
  //         duration={t.duration_ms}
  //         liked={liked_uris}
  //         />
  //       <p hidden>{key++}</p>
  //     </div>
  //   )

  return (
    <>
      {loading ? <Loading yes={true} /> : (
        
        <div style={{marginTop: '120px'}}>
        <span style={{marginLeft: '24vw'}}>
          <SpinComponent is_active={active} is_paused={paused}/>
          {u_plist ? listImages(lastSegment, ptracks) : <img src={sessionStorage.getItem("p_image")} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>}
        </span>
        
          
          <div style={{marginBottom: '60px'}}>
            
            <h2>{sessionStorage.getItem("playlist_name")}</h2>
            <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol" style={{marginRight: '500px'}}>Title</span><span className="lol" style={{marginLeft: '500px'}}>Duration</span></div>
            {u_plist ? userPlaylists(ptracks, lastSegment, liked_uris) : regPlaylists(ptracks, lastSegment)}
            
          </div>
        </div>
      )}
    </>
  )
}