//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import './Playlist.css'
import RPlaylist from "./RPlaylist.tsx";
import UPlaylist from "./UPlaylist.tsx";
import { useEffect } from 'react';


export default function Playlist({active, paused}: any) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash  
  useEffect(() => {
    console.log(lastSegment)
  },[lastSegment])

  return (
      <>
        { sessionStorage.getItem("uplist") === "true" ? <UPlaylist lastSegment={lastSegment} active={active} paused={paused}  /> : <RPlaylist lastSegment={lastSegment} active={active} paused={paused}  /> }
      </>
      
  )
}