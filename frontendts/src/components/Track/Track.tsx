//session storage variable name set here
import musicBar from "../musicBar/musicBar.tsx"
import './Track.css'

function timeCalc (ms: number) {
    const temp = Math.round(ms / 1000)
    const mins = Math.floor(temp / 60)
    const secs = temp - mins * 60

    if (secs.toString().length == 1) return `${mins}.${secs}0`
    else return `${mins}.${secs}`
}

export default function Track ( {uri, name, number, duration, album_name, artist, t_uri, pause, mbarVal}: any ) {
    return (
        <div style={{display: 'flex'}}>
            <a onClick={function handleClick () {
                // console.log(sessionStorage.get
                // console.log(sessionStorage.getItem("uri"))
                // console.log(sessionStorage.getItem("token"))
                album_name && sessionStorage.setItem("albumname", album_name)
                
                // sessionStorage.setItem("name", sessionStorage.getItem("albumname"))

                var url =`https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
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
            <div className="main" style={{display: 'flex', alignItems: 'center'}}>
                {!pause ? <span className="mbar" style={mbarVal ? {marginTop: '40px'} : {}} >{sessionStorage.getItem('current') === t_uri ? musicBar() : null}</span> : null}
                <div className="innerMain">
                    <h2>{name}</h2>
                    <h4>{artist.map((a: any,i: number,row: any) => row.length - 1 !== i ? a.name + ", " : a.name)}</h4>
                </div>
            
            </div>
            <br></br>
            <br></br>
            </a>
            <span className="songLength">{timeCalc(duration)}</span>
      </div>
    )
}