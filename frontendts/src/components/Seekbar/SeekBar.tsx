import { useState, useEffect, useRef } from "react"
import './SeekBar.css'

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

export default function SeekBar({duration, player, paused}: any){
    const [pos, setPos] = useState<any>(0)
    

        // let getPosition = () => {
        //     if(paused) return position

        //     let temp = position + (performance.now() - update) / 1000
        //     return temp > duration ? duration : temp
        // }
        // useInterval(()=>{
        //     let a = getPosition()
        //     console.log(a)
        // },1500)
        useInterval(() => {
            paused ? null : player?.getCurrentState().then((state: any) => {
               setPos(state?.position)
             })
        },1000)
        // console.log(getPosition)
        

        // if (position && duration) {
        //     setPos(duration ? (position >= duration ? 0 : position / duration) : 0);
        // }
        // setPos(position)
        
        
    

    
    
    
    

    return(
        <input id='seeker' type='range' min="0" max={duration} value={pos} step="100" onChange={function handleChange(e){ 
            setPos(e.target.value)
            player.seek(e.target.value)
        }} style={{position: 'absolute', left: '300px', bottom: '12px', width: '500px'}} />
    )
}