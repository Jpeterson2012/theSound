//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import { useState, useEffect, useMemo } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import { useGetPlaylistsQuery, useGetLikedQuery, Playlists } from "../ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'
import './UPlaylist.css'

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
{/* Old method of playling playlist using playlist uri. doesnt work with sorting */}
{/* {last == 'likedsongs' ? liked_urls.push(t.uri) : liked_urls = null } */}
function userPlaylists(userLists: any, liked_urls: any, paused: any) {
  let key = 0
  return (
    userLists?.tracks?.map((t: any) =>

      <div style={{display: 'flex', alignItems: 'center'}}>

          <p hidden>{liked_urls.push(t.uri)}</p>
          <img src={t.images.filter((t: any)=>t.height == 64).map((s: any) => s.url)} style={{height: '64px', width: '64px'}}/>
          <PTrack 
          uri={userLists.uri}
          name={t.name}
          number={key}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}
          pause={paused}
          />
        <p hidden>{key++}</p>
        <h1 id="deleteSong" onClick={function handleClick(){
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

export default function UPlaylist({SpinComponent, lastSegment, active, paused}: any){
    const [loading, setLoading] = useState(true)
    var liked_uris: any = []

    const {data: liked = [], isSuccess: lsuccess} = useGetLikedQuery()
  
    type getPlaylistfromResultArg = TypedUseQueryStateResult<Playlists[],any,any>
    
    const selectOnePlaylist = createSelector(
        (res: getPlaylistfromResultArg) => res.data,
        (res: getPlaylistfromResultArg, userId: string) => userId,
        (data, userId) => data?.filter(plist => plist.playlist_id === userId)
    )

    const { singlePlist, isSuccess: psuccess } = useGetPlaylistsQuery(undefined, {
      selectFromResult: result => ({
        ...result,
        singlePlist: selectOnePlaylist(result, lastSegment!)
      })
    })

    let truth: boolean = lsuccess && psuccess

    useEffect(()=>{
        if(truth) setLoading(false)
    },[lsuccess])

    

    return(
        <>        
            {loading ? <Loading2 yes={true} /> : (
                <>
                <div style={{marginTop: '30px'}}>
                    <span className="fade-in-imageP">
                        <SpinComponent is_active={active} is_paused={paused}/>
                        {listImages(lastSegment, lastSegment == 'likedsongs' ? liked : singlePlist![0])}
                    </span>

                    <div>
        
        
          
                        <div style={{marginBottom: '60px', marginTop: '40px'}}>
            
                            <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>
                            <div style={{display: 'flex', marginRight: '10px'}}>
                                <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                                <h5 style={{color: 'rgb(90, 210, 216)'}}> Songs</h5>

                
                            </div>

                            <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol">Title</span><span className="lolP">Duration</span></div>
                            {userPlaylists(lastSegment == 'likedsongs' ? liked : singlePlist![0], liked_uris, paused) }
            
                        </div>
                    </div>

                </div>
                </>
            )}
        </>
    )
}