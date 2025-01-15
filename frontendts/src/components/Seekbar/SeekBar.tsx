import { useState, useEffect } from "react"
import './SeekBar.css'

export default function SeekBar({position, duration, player, paused}: any){
    const [pos, setPos] = useState<any>(0)
    // let a = position
    // useEffect(()=>{
    //     console.log(paused)
    //     // setPos(position)
        
    //     sessionStorage.getItem('current') ? window.setInterval(()=>{
            
    //         !paused ? a += 0 : a += 500
    //         // setPos(a)
    //         console.log(a)
    //         // player?.getCurrentState().then((state: any) => {
    //         //     setPos(state?.position)
    //         // })
    //     },500) : null
    // },[sessionStorage.getItem('current'),paused])

    
    
    
    

    return(
        <input id='seeker' type='range' min="0" max={duration} value="0" step="100" onChange={function handleChange(e){ 
            setPos(e.target.value)
            player.seek(e.target.value)
        }} style={{position: 'absolute', left: '300px', bottom: '12px', width: '500px'}} />
    )
}