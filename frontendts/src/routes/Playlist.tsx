//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import { useState, useEffect, useMemo } from "react";
import './Playlist.css'
import { useGetPlaylistsQuery, useGetLikedQuery, Playlists } from "../ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'
import RPlaylist from "./RPlaylist.tsx";
import UPlaylist from "./UPlaylist.tsx";


export default function Playlist({SpinComponent, active, paused}: any) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  const [u_plist, setU_plist] = useState(true)
  
  

type getPlaylistfromResultArg = TypedUseQueryStateResult<Playlists[],any,any>

const selectPlaylistIDs = createSelector(
  (res: getPlaylistfromResultArg) => res.data,
  (data) => data?.map(plist => plist.playlist_id)
)

const { pListIDs, isSuccess: isuccess } = useGetPlaylistsQuery(undefined, {
  selectFromResult: result => ({
    ...result,
    pListIDs: selectPlaylistIDs(result)
  })
})

  
  
  useEffect (() => {    

      if (isuccess){
      if ((pListIDs?.find((e:any)=> e === lastSegment) === undefined) || lastSegment !== 'likedsongs') setU_plist(false)
      
      console.log(lastSegment)
      console.log(pListIDs?.find((e:any)=> e === lastSegment))
      console.log(u_plist)
}
      
    
  }, []);

  console.log(sessionStorage.getItem("uplist"))

  return (
      <>
        {isuccess ? (sessionStorage.getItem("uplist") === "true" ? <UPlaylist SpinComponent={SpinComponent} lastSegment={lastSegment} active={active} paused={paused}  /> : <RPlaylist SpinComponent={SpinComponent} lastSegment={lastSegment} active={active} paused={paused}  />) : <h2>something fucked up</h2>}
      </>
      
  )
}