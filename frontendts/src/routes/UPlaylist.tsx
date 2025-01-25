//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import { useState, useEffect } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import { useGetPlaylistsQuery, useGetLikedQuery, Playlists, useDeleteNewLikedMutation, useDeletePTrackMutation } from "../App/ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'
import './UPlaylist.css'
import { Spin } from "../components/Spin/Spin.tsx";
import dots from "../images/dots.png"

function customImage(ptracks: any){
  return(
    <div className="mainImage2">
      <div className="subImage" >
        <img className="subsubImage" style={{borderRadius: '15px 0px 0px 0px'}} src={ptracks.tracks[0].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
        <img className="subsubImage" style={{borderRadius: '0px 15px 0px 0px'}} src={ptracks.tracks[1].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
      </div>
      <div className="subImage" >
        <img className="subsubImage" style={{borderRadius: '0px 0px 0px 15px'}} src={ptracks.tracks[2].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
        <img className="subsubImage" style={{borderRadius: '0px 0px 15px 0px'}} src={ptracks.tracks[3].images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
      </div>
    </div>
  )
}

function returnUrl(ptracks: any){  
  
  if (ptracks.images.length === 0) return 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg'
  else if (ptracks.images.length === 1) return ptracks.images.map((s:any) => s.url)
  else return ptracks.images.filter((t: any) => t.height == 640).map((s: any) => s.url)
  
}
{/* Old method of playling playlist using playlist uri. doesnt work with sorting */}
{/* {last == 'likedsongs' ? liked_urls.push(t.uri) : liked_urls = null } */}
function userPlaylists(userLists: any, liked_urls: any, paused: any,removeSong: any, removePTrack: any, lastSegment: any) {
  let key = 0
  return (
    userLists?.tracks?.map((t: any) =>

      <div style={{display: 'flex', alignItems: 'center'}}>

          <p hidden>{liked_urls.push(t.uri)}</p>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <div className="removeContainer2" style={{width: '20px'}}>
              <div className="removeAlbum2">

              <button style={{color: 'black',background: 'rgb(90, 210, 216)', fontSize: '13px',width: '130px', height: '60px'}} onClick={function handleClick(){        
              
              }}>Edit Playlists</button>

              {lastSegment !== 'likedsongs' ? null : <button style={{color: 'black',background: 'rgb(90, 210, 216)', fontSize: '13px', width: '130px', height: '60px'}} onClick={function handleClick(){        
                  lastSegment === 'likedsongs' ? setTimeout(() => { removeSong({name: t.name}) },500) : setTimeout(() => { removePTrack({pID: userLists.playlist_id, name: t.name}) },500)
              }}>Remove From Liked Songs</button>}

              </div>
              <img src={dots} className="removeImg2" style={{marginBottom: '20px', height: '30px', width: '30px', margin: '0px', cursor: 'pointer'}} />      
            </div>
            <img src={t.images.filter((t: any)=>t.height == 64).map((s: any) => s.url)} style={{height: '64px', width: '64px'}}/>
          </div>
          
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
        {/* <h1 id="deleteSong" onClick={function handleClick(){          
                
          lastSegment === 'likedsongs' ? setTimeout(() => { removeSong({name: t.name}) },500) : setTimeout(() => { removePTrack({pID: userLists.playlist_id, name: t.name}) },500)

        
        }}>-</h1> */}
      </div>
    )
  )
}

export default function UPlaylist({lastSegment, active, paused}: any){
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
            {loading ? null : (
                <>
                <div>                    

                    {(lastSegment! === 'likedsongs' ? Spin(active,paused,"https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg",null) 
                    : (singlePlist![0].images.length === 0 && singlePlist![0].tracks.length > 3) ? Spin(active,paused,"",customImage(singlePlist![0])) 
                    : Spin(active,paused,returnUrl(singlePlist![0]),null) )}

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