//Session storage vars ref_id and ref_items created here
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './UAlbum.css'
import Loading2 from "../components/Loading2/Loading2.tsx"
import Track from "../components/Track/Track.tsx";
import { useGetAlbumsQuery, useAddAlbumMutation,useDeleteAlbumMutation, Albums } from "../App/ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'



export default function UAlbum({SpinComponent, active, paused}: any) {
    const navigate = useNavigate()
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash    
    const [isLoading, setIsLoading] = useState(true)
    var zip = JSON.parse(sessionStorage.getItem("artist")!).map(function(e: any,i: number){
      return [e, JSON.parse(sessionStorage.getItem("artist_id")!)[i]]
    })

    const [addAlbum] = useAddAlbumMutation()
    const [deleteAlbum] = useDeleteAlbumMutation()
    const [artists, setArtists] = useState<any>([])
    const [talbum, setTAlbum] = useState<any>([])

    

    type getAlbumfromResultArg = TypedUseQueryStateResult<Albums[],any,any>
    
    const selectOneAlbum = createSelector(
        (res: getAlbumfromResultArg) => res.data,
        (res: getAlbumfromResultArg, userId: string) => userId,
        (data, userId) => data?.filter(alist => alist.album_id === userId)
    )

    const { singleAlbum, isSuccess: asuccess } = useGetAlbumsQuery(undefined, {
      selectFromResult: result => ({
        ...result,
        singleAlbum: selectOneAlbum(result, lastSegment!)
      })
    })
    
    let artistss: any = []
    
    
    

    useEffect (() => { 
         
       sessionStorage.setItem("albumStatus", "user")
      if(asuccess) {
        setIsLoading(false)
        //Assigns user album to session storage to prevent error if removed from library
        singleAlbum!.length > 0 ? (sessionStorage.setItem("ualbum",JSON.stringify(singleAlbum)), setTAlbum(singleAlbum!)) : (setTAlbum(JSON.parse(sessionStorage.getItem("ualbum")!)), setArtists(JSON.parse(sessionStorage.getItem("uartist")!))  )
        
        
      }

        
        singleAlbum![0].artists?.map((a:any) => artistss.push(a.id))
        
        
        const fetchArtists = async () => {
            try {
                var temp = await fetch(`http://localhost:8888/auth/tracks/artists`,{
                    method: 'POST',
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify(artistss)
                })
              .then((res) => {                
                return res.json();
              }).then((data) => {return data})
                return temp
              }
              catch (err) {console.log(err)}
        }
        const assignArtists = async () => {            
            const tempArtists = await fetchArtists()
            sessionStorage.setItem("uartist",JSON.stringify(tempArtists))
                                                
            setArtists(tempArtists)                            
          }
          assignArtists()
        
        
      //This fixes render bug where fetch doesn't activate when clicking on currently playing album
    }, [sessionStorage.getItem("image"),asuccess]);
    
    
    const listItems2 = talbum[0]?.tracks?.items.map((t: any) => 
      <Track 
        uri={`spotify:album:${talbum[0]?.album_id}`}
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

        {isLoading ? <Loading2 yes={true} /> : (
          <>
            
            <div className="topDiv">
            <h2>{talbum[0]?.name}</h2>
              <span className="fade-in-image2">
                <SpinComponent is_active={active} is_paused={paused}/>
                <img className="albumImage" src={sessionStorage.getItem("image")!}/>

              </span>

              
              <h2 className="artistName">{zip.map((s: any,i: number,row: any) =>
                <a  onClick={function handleClick() {
                  navigate(`/app/artist/${s[1]}`)
                }}>{row.length - 1 !== i ? s[0] + ", " : s[0]}</a>             
              )}</h2>

              <div className="albumDescription">
                <div className="innerDescription">
                  <h5 className="desc1">{talbum[0]?.album_type === 'single' && talbum[0]?.total_tracks > 1 ? 'EP' :talbum[0]?.album_type } &#8226;</h5>
                  <h5>{talbum[0]?.total_tracks === 1 ? talbum[0]?.total_tracks + " Song" : talbum[0]?.total_tracks + " Songs" }</h5>              
                </div>

                {/* <img src={tracks.images?.map(b => b.find(b => b.height > 100).url)} style={{borderRadius: '50%', height: '40px'}} /> */}

                {artists?.images?.map((a: any) => <img className="tinyArtist" src={a.find((b: any) => b.height > 160).url} />)}
                <div id="snackbar2">{singleAlbum!.length !== 0 ? "Added to Library!" : "Removed From Library"}</div>
                <p id="addAlbum" style={{height: '35px', width: '35px',fontSize: '20px', marginLeft: '15px', cursor: 'pointer', border: '1px solid #7a19e9', color: 'rgb(90, 210, 216)'}} onClick={function handleClick(){

                  let temp2 = document.getElementById('addAlbum')!
                  temp2.style.animation = 'hithere 1s ease'
                  setTimeout(()=>{
                      temp2.style.removeProperty('animation')
                  }, 750)
                  var x = document.getElementById("snackbar2");
                  x!.className = "show";
                  setTimeout(function(){ x!.className = x!.className.replace("show", ""); }, 4000);  

                  if (singleAlbum!.length === 0){                    
                      addAlbum({album_type: talbum[0]?.album_type, total_tracks: talbum[0]?.total_tracks, album_id: lastSegment!, images: talbum[0]?.images, name: talbum[0]?.name, release_date: talbum[0]?.release_date, uri: talbum[0]?.uri, artists: talbum[0]?.artists, tracks: talbum[0]?.tracks, copyrights: talbum[0]?.copyrights, label_name: talbum[0]?.label_name})                    
                  }
                  else{                                        
                      deleteAlbum({aID: lastSegment!})                                        
                  }                  

                }}>{singleAlbum!.length === 0 ? "+" : "✓"}</p>
              </div>

            




              <div style={{display: 'inline-flex'}}><span className="lol">Title</span><span className="lol2">Duration</span></div>
            </div>
            

            {listItems2}
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '50px', marginBottom: '50px'}}>
              {artists?.images?.map((a: any) => <img src={a.find((b: any) => b.height > 160).url} style={{width: '90px', height: '90px'}} />)}
            </div>
            
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>Release Date: {talbum[0]?.release_date}</h5>
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>{ talbum[0]?.copyrights[0]?.text} </h5>
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>(R) {talbum[0]?.label_name}</h5>
            <p style={{marginBottom: '50px'}}></p>

          </>

        )}

      </>
    )
}