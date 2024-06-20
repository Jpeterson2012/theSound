import ori from '../../local/34-LumaPools.mp3'
import { useEffect, useState } from 'react'

export default function Local() {
  useEffect(() => {
    const fetchLocal = async () => {
      const resp = await fetch("http://localhost:8888/auth/local")
      const data = await resp.json()
      console.log(data)
    }
    fetchLocal()
  })
  
  let audio = new Audio(ori)

  const start = () => {
    audio.play()
  }
  const stop = () => {
    audio.pause()
  }

  return (
    < div >    
      <button onClick={start}>Play</button>
      <button onClick={stop}>Pause</button>
    </div >
  );
}

