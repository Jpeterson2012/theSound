//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import { useGetPlaylistsQuery, useGetLikedQuery, Playlists, useDeleteNewLikedMutation, useDeletePTrackMutation } from "../ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'
import './UPlaylist.css'

function mainImage(url: string) {
  return (<img className="mainImage" src={url}/>)
}

function listImages(last: any, ptracks: any) {
  if (last == 'likedsongs'){
    return (<img className="mainImage" src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"/>)
  }
  else{
    return (
      ptracks.images?.length === 0 ? mainImage("https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg") : ptracks.images?.length == 1 ? ptracks.images?.map((s: any) => mainImage(s.url)) :
      ptracks.images?.filter((t: any) => t.height == 640).map((s: any) => mainImage(s.url))
    )
  }
}
{/* Old method of playling playlist using playlist uri. doesnt work with sorting */}
{/* {last == 'likedsongs' ? liked_urls.push(t.uri) : liked_urls = null } */}
function userPlaylists(userLists: any, liked_urls: any, paused: any,removeSong: any, removePTrack: any, lastSegment: any) {
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
                
          lastSegment === 'likedsongs' ? setTimeout(() => { removeSong({name: t.name}) },500) : setTimeout(() => { removePTrack({pID: userLists.playlist_id, name: t.name}) },500)

        
        }}>-</h1>
      </div>
    )
  )
}

export default function UPlaylist({SpinComponent, lastSegment, active, paused}: any){
    const [loading, setLoading] = useState(true)
    var liked_uris: any = []

    const {data: liked, isSuccess: lsuccess} = useGetLikedQuery()
    const [removeSong] = useDeleteNewLikedMutation()
    const [removePTrack] = useDeletePTrackMutation()
  
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
    },[lsuccess,liked])

    

    return(
        <>        
            {loading ? <Loading2 yes={true} /> : (
                <>
                <div>
                    <span className="fade-in-imageP">
                        <SpinComponent is_active={active} is_paused={paused}/>
                        {listImages(lastSegment, lastSegment == 'likedsongs' ? liked : singlePlist![0])}
                    </span>

                    <div>
        
        
          
                        <div style={{marginBottom: '60px', marginTop: '40px'}}>
            
                            <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>
                            <div style={{display: 'flex', marginRight: '10px'}}>
                                <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
                                <h5 style={{color: 'rgb(90, 210, 216)'}}>{lastSegment == 'likedsongs' ? liked?.tracks?.length : singlePlist![0].tracks.length} Song(s)</h5>

                
                            </div>

                            <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol">Title</span><span className="lolP">Duration</span></div>
                            {userPlaylists(lastSegment == 'likedsongs' ? liked : singlePlist![0], liked_uris, paused,removeSong, removePTrack, lastSegment) }
            
                        </div>
                    </div>

                </div>
                </>
            )}
        </>
    )
}