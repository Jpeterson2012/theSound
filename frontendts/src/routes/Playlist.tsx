//Session storage vars ref_id and ref_items created here
import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import './Playlist.css'
import { useGetPlaylistsQuery, useGetLikedQuery } from "../ApiSlice.ts";

function mainImage(url: string) {
  return (<img src={url} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '110px', top: '10px'}}/>)
}

function listImages(last: any, ptracks: any) {
  if (last == 'likedsongs'){
    return (<img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '110px', top: '10px'}}/>)
  }
  else{
    return (
      ptracks.images?.length == 1 ? ptracks.images?.map((s: any) => mainImage(s.url)) :
      ptracks.images?.filter((t: any) => t.height == 640).map((s: any) => mainImage(s.url))
    )
  }
}
function userPlaylists(ptracks: any, last: any, liked: any, liked_urls: any, paused: any, setpTracks: any) {
  let key = 0
  return (
    ptracks?.tracks?.map((t: any) =>

      <div style={{display: 'flex', alignItems: 'center'}}>
          {/* Old method of playling playlist using playlist uri. doesnt work with sorting */}
          {/* {last == 'likedsongs' ? liked_urls.push(t.uri) : liked_urls = null } */}
          {liked_urls.push(t.uri)}
          <img src={t.images.filter((t: any)=>t.height == 64).map((s: any) => s.url)} style={{height: '64px', width: '64px'}}/>
          <PTrack 
          uri={ptracks.uri}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}
          pause={paused}
          />
        <p hidden>{key++}</p>
        <h1 id="deleteSong" style={{position: 'absolute', left: '180px', cursor: 'pointer'}} onClick={function handleClick(){
          let temp = document.getElementById('deleteSong')!
          temp.style.animation = 'hithere 1s ease'
          setTimeout(()=>{
              temp.style.removeProperty('animation')
          }, 750)

          var parts = t.uri.split(':');
          var lastSegment = parts.pop() || parts.pop();

          // set_liked({tracks: liked.tracks?.filter((a: any) => a.uri !== t.uri)})
          // setpTracks({tracks: ptracks?.tracks?.filter(a => a.uri !== t.uri)})
          

          fetch(`http://localhost:8888/auth/update`, {
            method: 'DELETE',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({track_id: lastSegment})
        })
        }}>-</h1>
      </div>
    )
  )
}

function regPlaylists(ptracks: any, last: any, liked_urls: any, paused: any){
  let key = 0
  return (
    ptracks?.map((t: any) => 

      <div style={{display: 'flex', alignItems: 'center'}} >
          {liked_urls.push(t.uri)}
          <img src={t.album?.filter((t: any)=>t.height == 64).map((s: any) => s.url)} />
          <PTrack 
          uri={"spotify:playlist:" + last}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}
          pause={paused}
          />
        <p hidden>{key++}</p>
      </div>
    )
  )
}


export default function Playlist({SpinComponent, active, paused}: any) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  var liked_uris: any = []
  const [ptracks, setpTracks] = useState<any>([]);
  const [loading, setLoading] = useState(false)
  const [u_plist, setU_plist] = useState(true)
  const [total, setTotal] = useState(null)

  const {
        data: plists = [],
        isSuccess
    } = useGetPlaylistsQuery()
    const {
        data: liked = [],
    } = useGetLikedQuery()
  
  useEffect (() => {
    
    setLoading(true)
    
    lastSegment == 'likedsongs' ? setpTracks(liked) : setpTracks(plists?.find((e: any) => e.playlist_id === lastSegment))
    setLoading(false)
    
    if ((plists?.find((e: any) => e.playlist_id === lastSegment)) === undefined && lastSegment !== 'likedsongs') {
      setU_plist(false)
      
      if (sessionStorage.getItem("ref_id") === lastSegment) {
        setpTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
        setTotal(JSON.parse(sessionStorage.getItem("ref_items")!).length)
      }
      else{
     const fetchpTracks = async () => {
      setLoading(true)
      const resp = await fetch(`http://localhost:8888/auth/ptracks/${lastSegment}`)
      setLoading(false)
      let reader = resp.body!.getReader()
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
          : (sessionStorage.setItem("ref_id", lastSegment!),  sessionStorage.setItem("ref_items", JSON.stringify(a)))
          
      }
      
    }
    fetchpTracks()
  }
  }
    
  }, [sessionStorage.getItem("playlist_name"),isSuccess]);

  return (
    <div style={{marginTop: '30px'}}>
    <span className="fade-in-image" style={{marginLeft: '1vw', position: 'relative'}}>
          <SpinComponent is_active={active} is_paused={paused}/>
          {u_plist ? listImages(lastSegment, ptracks) : <img src={sessionStorage.getItem("p_image")!} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '490px', bottom: '14px'}}/>}
        </span>
      {loading ? <Loading2 yes={true} /> : (
        
        <div>
        
        
          
          <div style={{marginBottom: '60px'}}>
            
            <h2>{sessionStorage.getItem("playlist_name")}</h2>
            <div className="dropdown" id="dropdown" style={{right: '-300px'}}>
                  <button className="dropbtn">Sort</button>
                  <div className="dropdown-content">
                    
                  <button className="theme" onClick={function handleClick(){
                    let temp
                    u_plist ? (
                      temp = [...ptracks.tracks],
                      temp.sort((a,b) => a.name.localeCompare(b.name)),
                      setpTracks({...ptracks, tracks: temp})
                     ) : (
                      temp = [...ptracks],
                      temp.sort((a,b) => a.name.localeCompare(b.name)),
                      setpTracks(temp)
                     )                                  
                    
                    
                  }}>A-Z</button>

                  <button className="theme" onClick={function handleClick(){
                    let temp
                    u_plist ? (
                      temp = [...ptracks.tracks],
                      temp.sort((a,b) => b.name.localeCompare(a.name)),
                      setpTracks({...ptracks, tracks: temp})
                     ) : (
                      temp = [...ptracks],
                      temp.sort((a,b) => b.name.localeCompare(a.name)),
                      setpTracks(temp)
                     )                                  
                    
                    
                  }}>Z-A</button>

                  <button className="theme" onClick={function handleClick(){
                    let temp
                    u_plist ? (
                      temp = [...ptracks.tracks],
                      temp.sort((a,b) => a.artists[0]?.name.localeCompare(b.artists[0]?.name)),
                      setpTracks({...ptracks, tracks: temp})
                     ) : (
                      temp = [...ptracks],
                      temp.sort((a,b) => a.artists[0]?.name.localeCompare(b.artists[0]?.name)),
                      setpTracks(temp)
                     )                                  
                    
                    
                  }}>Artist A-Z</button>

                  <button className="theme" onClick={function handleClick(){
                    let temp
                    u_plist ? (
                      temp = [...ptracks.tracks],
                      temp.sort((a,b) => b.artists[0]?.name.localeCompare(a.artists[0]?.name)),
                      setpTracks({...ptracks, tracks: temp})
                     ) : (
                      temp = [...ptracks],
                      temp.sort((a,b) => b.artists[0]?.name.localeCompare(a.artists[0]?.name)),
                      setpTracks(temp)
                     )                                  
                    
                    
                  }}>Artist Z-A</button>
                
                  </div>
                </div>
            
              <div style={{display: 'flex', marginRight: '10px'}}>
                <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                <h5 style={{color: 'rgb(90, 210, 216)'}}>{total ? total : ptracks?.tracks?.length} Songs</h5>

                
              </div>
              
            


            <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol">Title</span><span className="lol" style={{marginLeft: '65vw'}}>Duration</span></div>
            {u_plist ? userPlaylists(ptracks, lastSegment, liked, liked_uris, paused, setpTracks) : regPlaylists(ptracks, lastSegment, liked_uris, paused)}
            
          </div>
        </div>
      )}
    </div>
  )
}