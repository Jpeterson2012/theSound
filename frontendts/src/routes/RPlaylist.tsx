import './RPlaylist.css'
import { useEffect, useState } from 'react'
import PTrack from '../components/PTrack/PTrack';

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

export default function RPlaylist({lastSegment, paused}: any){
    const [ptracks, setpTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(null)
    var liked_uris: any = []

    useEffect (() => {                
          
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
        {regPlaylists(ptracks, lastSegment, liked_uris, paused)}
        </>    
    )


}