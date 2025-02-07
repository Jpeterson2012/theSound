//session storage variable name set hereimport musicBar from "../musicBar/musicBar.tsx"
import './Track.css'
import SavedSong from '../SavedSong/SavedSong'

function timeCalc (ms: number) {
    const temp = Math.round(ms / 1000)
    let mins = Math.floor(temp / 60)
    let secs = temp - mins * 60
    secs > 59 ? (mins += 1, secs -= 60) : null
    secs.toString().length === 1 && secs > 5 ? (mins += 1, secs -= 6) : null

    if (secs.toString().length == 1) return `${mins}:${secs}0`
    else return `${mins}:${secs}`
}

export default function Track ( {uri, name, number, duration, album_name, artist,t_uri,show,customWidth}: any ) {
    return (
        <div className='trackContainer' style={customWidth ? {width: `${customWidth}%`} : {width: '100%'}}>
            <a onClick={function handleClick () {                
                // console.log(sessionStorage.get
                // console.log(sessionStorage.getItem("uri"))
                // console.log(sessionStorage.getItem("token"))
                album_name && sessionStorage.setItem("albumname", album_name)
                
                // sessionStorage.setItem("name", sessionStorage.getItem("albumname"))
                if (sessionStorage.getItem("currentContext")! === null || sessionStorage.getItem("currentContext")! === "null"){
                    var url = `https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
                }
                else{
                    var url = `https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("currentContext")}`
                }
                
                    const headers = {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer ' + sessionStorage.getItem("token")
                    }
                    
                    fetch(url, {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify({context_uri: uri, offset: {position: number - 1}})
                    })
                
            }}>            
                
                <div className="innerMain">
                    <h2>{name}</h2>
                    <h4>{artist.map((a: any,i: number,row: any) => row.length - 1 !== i ? a.name + ", " : a.name)}</h4>                
            
            </div>
            <br></br>            
            </a>
            {show === false ? null : <div style={{display: 'flex'}}><SavedSong track={t_uri} /><span className="songLength">{timeCalc(duration)}</span></div>}
      </div>
    )
}