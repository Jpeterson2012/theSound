//Session storage vars ref_id and ref_items created here
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './UAlbum.css'
import Track from "../components/Track/Track.tsx";
import { useGetAlbumsQuery, useAddAlbumMutation,useDeleteAlbumMutation, Albums } from "../App/ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";

import { Spin } from "../components/Spin/Spin.tsx";
import musicBar from "../components/musicBar/musicBar.tsx";

import MySnackbar from "../components/MySnackBar.tsx";

import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import { filterTracks } from "../components/filterTracks.tsx";

export default function UAlbum({active, paused}: any) {
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
    const[snack, setSnack] = useState(false)
    const [modal, setModal] = useState(false)
    const[trackData, setTrackData] = useState<any>(null)
    const [filter_val, setFilter_val] = useState<string>('')

    

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
                var temp = await fetch(import.meta.env.VITE_URL + `/tracks/artists`,{
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
    
    
    const listItems2 = talbum[0]?.tracks?.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).map((t: any,i:any) =>     
      <div className="listContainer" key={i}>                

        <div className="removeContainer3" style={{display: 'flex', alignItems: 'center'}}>

          <button className="removeAlbum3" onClick={function handleClick(){     
              let temp = {images: talbum![0].images, uri: t.uri, name: t.name, track_number: 0, duration_ms: t.duration_ms, artists: t.artists}                            
              setTrackData(temp)
              setModal(true)               
            }}>Edit Playlists</button>
            <img src={dots} className="removeImg2" style={{paddingTop: '10px',height: '27px', width: '27px', cursor: 'pointer'}} />            

          </div>
      <Track 
        uri={`spotify:album:${talbum[0]?.album_id}`}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={null}
        artist={t.artists}
        t_uri={t.uri}        
        paused={paused}
      />
      </div>
    )
    
    return (
      <>

        {isLoading ? null : (
          <>
            
            <div className="topDiv">
            <h2 style={{fontSize: '30px'}} >{talbum[0]?.name}</h2>
              
              {/* Spin Component import now instead of prop */}
              {Spin(active,paused,sessionStorage.getItem("image")!,null)}
              

              
              <h2 className="artistName">{zip.map((s: any,i: number,row: any) =>
                <a key={i}  onClick={function handleClick() {
                  navigate(`/app/artist/${s[1]}`)
                }}>{row.length - 1 !== i ? s[0] + ", " : s[0]}</a>             
              )}</h2>

              <div className="albumDescription">
                <div className="innerDescription">
                  <h5 className="desc1">{talbum[0]?.album_type === 'single' && talbum[0]?.total_tracks > 1 ? 'EP' :talbum[0]?.album_type } &#8226;</h5>
                  <h5>{talbum[0]?.tracks.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).length + " Song(s)" }</h5>              
                </div>

                {/* <img src={tracks.images?.map(b => b.find(b => b.height > 100).url)} style={{borderRadius: '50%', height: '40px'}} /> */}

                {artists?.images?.map((a: any,i:any) => <img key={i} className="tinyArtist" src={a.find((b: any) => b.height > 160).url} />)}                
                <p id="addAlbum" style={{height: '35px', width: '35px',fontSize: '20px', marginLeft: '15px', cursor: 'pointer', border: '1px solid #7a19e9', color: 'rgb(90, 210, 216)'}} onClick={function handleClick(){
                  setSnack(true)
                  let temp2 = document.getElementById('addAlbum')!
                  temp2.style.transform = 'scale(1)'
                  temp2.style.animation = 'pulse3 linear 1s'
                  setTimeout(()=>{
                      temp2.style.removeProperty('animation')
                      temp2.style.removeProperty('transform')
                  }, 1000)                    

                  if (singleAlbum!.length === 0){                    
                      setTimeout (() => {addAlbum({album_type: talbum[0]?.album_type, total_tracks: talbum[0]?.total_tracks, album_id: lastSegment!, images: talbum[0]?.images, name: talbum[0]?.name, release_date: talbum[0]?.release_date, uri: talbum[0]?.uri, artists: talbum[0]?.artists, tracks: talbum[0]?.tracks, copyrights: talbum[0]?.copyrights, label_name: talbum[0]?.label_name}) },1100)                    
                  }
                  else{                                        
                      setTimeout(() => { deleteAlbum({aID: lastSegment!}) },1100)                                        
                  }                  

                }}>{singleAlbum!.length === 0 ? "+" : "✓"}</p>

                
              </div>
              {filterTracks(setFilter_val)}

                
              
            </div>
            
            <div className="tdContainer">
              <div style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                <span className="uTitle">Title</span>
                <span className="uTitle2">Duration</span>
              </div>
              {listItems2}
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '50px', marginBottom: '50px'}}>
              {artists?.images?.map((a: any, i:any) => <img key={i} src={a.find((b: any) => b.height > 160).url} style={{width: '90px', height: '90px', borderRadius: '10px'}} />)}
            </div>
            
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>Release Date: {talbum[0]?.release_date}</h5>
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>{ talbum[0]?.copyrights[0]?.text} </h5>
            <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>(R) {talbum[0]?.label_name}</h5>
            <p style={{marginBottom: '100px'}}></p>

          </>

        )}
        <ButtonScroll />
        {modal ? <EditPlaylist track={trackData} boolVal={modal} setbool={setModal} setsnack={setSnack} /> : null}
        {snack ? <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>  : null}
      </>
    )
}