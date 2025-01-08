//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import { useState, useEffect, useMemo } from "react";
import PTrack from "../components/PTrack/PTrack.tsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import './Playlist.css'
import { useGetPlaylistsQuery, useGetLikedQuery, Playlists } from "../ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'
import RPlaylist from "./RPlaylist.tsx";
import UPlaylist from "./UPlaylist.tsx";


// function mainImage(url: string) {
//   return (<img src={url} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '110px', top: '10px'}}/>)
// }

// function listImages(last: any, ptracks: any) {
//   if (last == 'likedsongs'){
//     return (<img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '110px', top: '10px'}}/>)
//   }
//   else{
//     return (
//       ptracks.images?.length == 1 ? ptracks.images?.map((s: any) => mainImage(s.url)) :
//       ptracks.images?.filter((t: any) => t.height == 640).map((s: any) => mainImage(s.url))
//     )
//   }
// }
// {/* Old method of playling playlist using playlist uri. doesnt work with sorting */}
// {/* {last == 'likedsongs' ? liked_urls.push(t.uri) : liked_urls = null } */}
// function userPlaylists(userLists: any, liked_urls: any, paused: any) {
//   let key = 0
//   return (
//     userLists?.tracks?.map((t: any) =>

//       <div style={{display: 'flex', alignItems: 'center'}}>

//           <p hidden>{liked_urls.push(t.uri)}</p>
//           <img src={t.images.filter((t: any)=>t.height == 64).map((s: any) => s.url)} style={{height: '64px', width: '64px'}}/>
//           <PTrack 
//           uri={userLists.uri}
//           name={t.name}
//           number={key}
//           duration={t.duration_ms}
//           liked={liked_urls}
//           artist={t.artists}
//           t_uri={t.uri}
//           pause={paused}
//           />
//         <p hidden>{key++}</p>
//         <h1 id="deleteSong" onClick={function handleClick(){
//           let temp = document.getElementById('deleteSong')!
//           temp.style.animation = 'hithere 1s ease'
//           setTimeout(()=>{
//               temp.style.removeProperty('animation')
//           }, 750)

//           var parts = t.uri.split(':');
//           var lastSegment = parts.pop() || parts.pop();

//           // set_liked({tracks: liked.tracks?.filter((a: any) => a.uri !== t.uri)})
//           // setpTracks({tracks: ptracks?.tracks?.filter(a => a.uri !== t.uri)})
          

//           fetch(`http://localhost:8888/auth/update`, {
//             method: 'DELETE',
//             headers: {"Content-Type":"application/json"},
//             body: JSON.stringify({track_id: lastSegment})
//         })
//         }}>-</h1>
//       </div>
//     )
//   )
// }

// function regPlaylists(ptracks: any, last: any, liked_urls: any, paused: any){
//   let key = 0
//   return (
//     ptracks?.map((t: any) => 

//       <div style={{display: 'flex', alignItems: 'center'}} >
//           <p hidden>{liked_urls.push(t.uri)}</p>  
//           <img src={t.album?.filter((t: any)=>t.height == 64).map((s: any) => s.url)} />
//           <PTrack 
//           uri={"spotify:playlist:" + last}
//           name={t.name}
//           number={key}
//           duration={t.duration_ms}
//           liked={liked_urls}
//           artist={t.artists}
//           t_uri={t.uri}
//           pause={paused}
//           />
//         <p hidden>{key++}</p>
//       </div>
//     )
//   )
// }


export default function Playlist({SpinComponent, active, paused}: any) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  // var liked_uris: any = []
  // const [ptracks, setpTracks] = useState<any>([]);
  const [loading, setLoading] = useState(true)
  const [u_plist, setU_plist] = useState(true)
  // const [total, setTotal] = useState(null)

  // const {data: plists = [], isSuccess: psuccess} = useGetPlaylistsQuery()
  // const {data: liked = [], isSuccess: lsuccess} = useGetLikedQuery()
  

type getPlaylistfromResultArg = TypedUseQueryStateResult<Playlists[],any,any>

// const selectOnePlaylist = createSelector(
//     (res: getPlaylistfromResultArg) => res.data,
//     (res: getPlaylistfromResultArg, userId: string) => userId,
//     (data, userId) => data?.filter(plist => plist.playlist_id === userId)
// )
const selectPlaylistIDs = createSelector(
  (res: getPlaylistfromResultArg) => res.data,
  (data) => data?.map(plist => plist.playlist_id)
)

// const { singlePlist, isSuccess: psuccess } = useGetPlaylistsQuery(undefined, {
//   selectFromResult: result => ({
//     ...result,
//     singlePlist: selectOnePlaylist(result, lastSegment!)
//   })
// })

const { pListIDs, isSuccess: isuccess } = useGetPlaylistsQuery(undefined, {
  selectFromResult: result => ({
    ...result,
    pListIDs: selectPlaylistIDs(result)
  })
})

// let truth: boolean = lsuccess && psuccess && isuccess
  
  
  useEffect (() => {    

    // console.log(singlePlist?.length)
    // console.log(singlePlist)
    // console.log(pListIDs)
    
  //   if ((singlePlist?.length !== 0 && (pListIDs!.find((e:any) => e.playlist_id === lastSegment) !== undefined) ) || lastSegment === 'likedsongs') {
  //     setU_plist(true)
  //     setLoading(false)
  //   }
  //   else{
  //     if(lsuccess && psuccess) setLoading(false)
    
      
  //     if (sessionStorage.getItem("ref_id") === lastSegment) {
  //       setpTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
  //       setTotal(JSON.parse(sessionStorage.getItem("ref_items")!).length)
  //       setLoading(false)
  //     }
  //     else{
  //    const fetchpTracks = async () => {
  //     // setLoading(true)
  //     const resp = await fetch(`http://localhost:8888/auth/ptracks/${lastSegment}`)
  //     setLoading(false)
  //     let reader = resp.body!.getReader()
  //     let result
  //     let temp
  //     let a = []
  //     let decoder = new TextDecoder('utf8')
  //     while(!result?.done){
  //         result = await reader.read()
  //         let chunk = decoder.decode(result.value)
  //         // console.log(chunk ? JSON.parse(chunk) : {})
  //         chunk ? (
  //         total ? null : setTotal(JSON.parse(chunk).total),
  //         temp = JSON.parse(chunk).items,
  //         a.push(...temp),  
  //         setpTracks([...a]) )
  //         : (sessionStorage.setItem("ref_id", lastSegment!),  sessionStorage.setItem("ref_items", JSON.stringify(a)))
          
  //     }
      
  //   }
  //   fetchpTracks()
  // }
  // }
      if (isuccess){
      if ((pListIDs?.find((e:any)=> e === lastSegment) === undefined) || lastSegment !== 'likedsongs') setU_plist(false)
      
      console.log(lastSegment)
      console.log(pListIDs?.find((e:any)=> e === lastSegment))
      console.log(u_plist)
}
      
    
  }, []);

  console.log(u_plist)

  return (
      <>
        <h2>{u_plist}</h2>
        {isuccess ? (u_plist ? <UPlaylist SpinComponent={SpinComponent} lastSegment={lastSegment} active={active} paused={paused}  /> : <h3>oops</h3>) : <h2>something fucked up</h2>}
      </>
      // <RPlaylist SpinComponent={SpinComponent} lastSegment={lastSegment} active={active} paused={paused}  />

    // <div style={{marginTop: '30px'}}>
    // <span className="fade-in-imageP">
    //       <SpinComponent is_active={active} is_paused={paused}/>
    //       {u_plist ? listImages(lastSegment, lastSegment == 'likedsongs' ? liked : singlePlist![0]) : <img src={sessionStorage.getItem("p_image")!} style={{height: '360px', width: '350px', zIndex: '1', position: 'relative', right: '110px', top: '10px'}}/>}
    //     </span>
    //   {loading ? <Loading2 yes={true} /> : (
        
    //     <div>
        
        
          
    //       <div style={{marginBottom: '60px', marginTop: '40px'}}>
            
    //         <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>
    //         <div className="dropdown" id="dropdown" style={{right: '-300px'}}>
    //               <button className="dropbtn">Sort</button>
    //               <div className="dropdown-content">
                    
    //               <button className="theme" onClick={function handleClick(){
    //                 let temp
    //                 u_plist ? (
    //                   temp = [...ptracks.tracks],
    //                   temp.sort((a,b) => a.name.localeCompare(b.name)),
    //                   setpTracks({...ptracks, tracks: temp})
    //                  ) : (
    //                   temp = [...ptracks],
    //                   temp.sort((a,b) => a.name.localeCompare(b.name)),
    //                   setpTracks(temp)
    //                  )                                  
                    
                    
    //               }}>A-Z</button>

    //               <button className="theme" onClick={function handleClick(){
    //                 let temp
    //                 u_plist ? (
    //                   temp = [...ptracks.tracks],
    //                   temp.sort((a,b) => b.name.localeCompare(a.name)),
    //                   setpTracks({...ptracks, tracks: temp})
    //                  ) : (
    //                   temp = [...ptracks],
    //                   temp.sort((a,b) => b.name.localeCompare(a.name)),
    //                   setpTracks(temp)
    //                  )                                  
                    
                    
    //               }}>Z-A</button>

    //               <button className="theme" onClick={function handleClick(){
    //                 let temp
    //                 u_plist ? (
    //                   temp = [...ptracks.tracks],
    //                   temp.sort((a,b) => a.artists[0]?.name.localeCompare(b.artists[0]?.name)),
    //                   setpTracks({...ptracks, tracks: temp})
    //                  ) : (
    //                   temp = [...ptracks],
    //                   temp.sort((a,b) => a.artists[0]?.name.localeCompare(b.artists[0]?.name)),
    //                   setpTracks(temp)
    //                  )                                  
                    
                    
    //               }}>Artist A-Z</button>

    //               <button className="theme" onClick={function handleClick(){
    //                 let temp
    //                 u_plist ? (
    //                   temp = [...ptracks.tracks],
    //                   temp.sort((a,b) => b.artists[0]?.name.localeCompare(a.artists[0]?.name)),
    //                   setpTracks({...ptracks, tracks: temp})
    //                  ) : (
    //                   temp = [...ptracks],
    //                   temp.sort((a,b) => b.artists[0]?.name.localeCompare(a.artists[0]?.name)),
    //                   setpTracks(temp)
    //                  )                                  
                    
                    
    //               }}>Artist Z-A</button>
                
    //               </div>
    //             </div>
            
    //           <div style={{display: 'flex', marginRight: '10px'}}>
    //             <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>
    //             <h5 style={{color: 'rgb(90, 210, 216)'}}>{total ? total : ptracks?.tracks?.length} Songs</h5>

                
    //           </div>
              
            


    //         <div style={{display: 'inline-flex', marginTop: '50px'}}><span className="lol">Title</span><span className="lolP">Duration</span></div>
    //         {u_plist ? userPlaylists(lastSegment == 'likedsongs' ? liked : singlePlist![0], liked_uris, paused) : regPlaylists(ptracks, lastSegment, liked_uris, paused) }
            
    //       </div>
    //     </div>
    //   )}
    // </div>
  )
}