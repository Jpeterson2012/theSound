import ori from '../../local/34-LumaPools.mp3'
import Loading from '../Loading/Loading'
import { useEffect, useState } from 'react'

function displaySongs(songs){
  return (
    <>
    <p>{songs[0]?.album}</p>
    <div style={{marginBottom: '80px'}}>
      {
        songs?.map(a => 
          <div style={{display: 'flex', marginBottom: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{position: 'relative', display: 'flex', marginRight: '300px', textAlign: 'left', color: 'rgb(90, 210, 216)' }}>
                  <h2 style={{margin: '0px', padding: '0px', fontSize: '20px',maxWidth: '700px', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} >{a?.title}</h2>
                  <h4 style={{position: 'absolute', maxWidth: '700px', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{a?.artist}</h4>
              </div>
          
          </div>
          <br></br>
          <br></br>
          
          <span style={{position: 'absolute', left: '81vw', fontWeight: 'bold', color: 'rgb(90, 210, 216)'}}>{a?.track_number}</span>
        </div>
        )
      }
    </div>
    </>
  )
}

export default function Local() {
  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState([])
  useEffect(() => {
    
    if (sessionStorage.getItem("local_tracks")){
      setSongs(JSON.parse(sessionStorage.getItem("local_tracks")))
    }
    else{
    const fetchLocal = async () => {
      setLoading(true)
      const resp = await fetch("http://localhost:8888/auth/local")
      const data = await resp.json()
      setLoading(false)
      setSongs(data.items)
      sessionStorage.setItem("local_tracks", JSON.stringify(data.items))
    }
    fetchLocal()
  }
  }, [])
  
  let audio = new Audio(ori)

  const start = () => {
    audio.play()
  }
  const stop = () => {
    audio.pause()
  }
  

  return (
    <>
    < div >    
      <button onClick={start}>Play</button>
      <button onClick={stop}>Pause</button>
    </div >
    {loading ? <Loading yes={true} /> : displaySongs(songs)}
    </>
  );
}

