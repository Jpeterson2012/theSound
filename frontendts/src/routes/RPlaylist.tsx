import './RPlaylist.css'
import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import { Spin, Spin3 } from '../components/Spin/Spin.tsx';

function regPlaylists(ptracks: any, last: any, liked_urls: any, paused: any){
  let key = 0
  return (
    ptracks?.map((t: any) => 

      <div style={{display: 'flex', alignItems: 'center'}} >
          <p hidden>{liked_urls.push(t.uri)}</p>  
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

export default function RPlaylist({lastSegment, active, paused}: any){
    const [ptracks, setpTracks] = useState<any>([]);
    const [total, setTotal] = useState(null)
    const [loading, setLoading] = useState(true)
    var liked_uris: any = []

    useEffect (() => {                
      // console.log(loading)
          
        if (sessionStorage.getItem("ref_id") === lastSegment) {
          setpTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
          setTotal(JSON.parse(sessionStorage.getItem("ref_items")!).length)
          setLoading(false)
        }
        else{
          const fetchpTracks = async () => {
              // setLoading(true)
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
                // console.log(chunk ? JSON.parse(chunk) : {})
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
        
      }, [sessionStorage.getItem("playlist_name")]);

    return(
            <>        
                {loading ? Spin3() : (
                    <>
                    <div>
                        
                        {/* Spin Component import now instead of prop */}
                        {Spin(active,paused,sessionStorage.getItem("p_image")!,null)} 
    
                        <div>
            
            
              
                            <div style={{marginBottom: '60px', marginTop: '40px'}}>
                
                                <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>
                                <div style={{display: 'flex', marginRight: '10px'}}>
                                    <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                                    <h5 style={{color: 'rgb(90, 210, 216)'}}>{ptracks?.length} Song(s)</h5>
    
                    
                                </div>
    
                                <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol">Title</span><span className="lolP">Duration</span></div>
                                {regPlaylists(ptracks, lastSegment, liked_uris, paused) }
                
                            </div>
                        </div>
    
                    </div>
                    </>
                )}
            </>
        )
}


