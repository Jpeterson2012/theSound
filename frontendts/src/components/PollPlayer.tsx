//Session storage var progress created here, used in SeekBar

import { useEffect,useRef } from "react";

function useInterval(callback: any, delay: any){
    const savedCallback: any = useRef();
   
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
   
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

export default function PollPlayer({track,setTrack,duration}: any){

    useInterval(() => {            
        const poll = async () => {
            const resp = await fetch('http://localhost:8888/auth/player/currently-playing')
            const data = await resp.json()
            setTrack(data.item)
            duration(data.item.duration_ms)
            sessionStorage.setItem("name", data.item.album.name)
            sessionStorage.setItem("current", data.item.uri)
            sessionStorage.setItem("currentTrack",JSON.stringify(data.item))
            sessionStorage.setItem("progress",data.progress_ms)
                        
        } 
        //Checks if current device is The Sound. If not uses spotify api to get current track
        (sessionStorage.getItem("currentContext") === null || sessionStorage.getItem("currentContext") === "null") ? null :  poll()

    },3000)
    return(
        <>
        </>
    )
}