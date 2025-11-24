import { useState } from "react";
import './SeekBar.css';
import { useInterval } from "../../hooks/useInterval.ts";
import { spotifyRequest } from "../../utils/utils.ts";

export default function SeekBar({duration, player, paused}: any) {
  
  const [pos, setPos] = useState<any>(0);
      
  let found = [undefined, null, "null"].includes(sessionStorage.getItem("currentContext")) ??  false
  
  //Checks if current device is The Sound. If not uses session variable to update song progress
  if (found) {
    useInterval(() => {
      !paused && player?.getCurrentState().then((state: any) => {
        setPos(state?.position);
      });
    },1000);
  } else {
    useInterval(() => {
      setPos(sessionStorage.getItem("progress") ?? 0);
    },3000);
  }          

  return(
    <input 
      id='seeker' 
      type='range' 
      min="0" 
      max={duration ?? 0} 
      value={pos ?? 0} 
      step="100" 
      onChange={(e) => { 
        setPos(e.target.value);     

        if(found) {
          player.seek(e.target.value)              
        } else 
          setTimeout(() => {         
            spotifyRequest(`/player/seek/${sessionStorage.getItem("currentContext")},${+e.target.value}`, 'POST');
          },150);        
      }}
    />
  );
};

export { useInterval };