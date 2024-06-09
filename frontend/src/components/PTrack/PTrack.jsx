//session storage variable name set here

function timeCalc (ms) {
    const temp = Math.round(ms / 1000)
    const mins = Math.floor(temp / 60)
    const secs = temp - mins * 60

    if (secs.toString().length == 1) return `${mins}.${secs}0`
    else return `${mins}.${secs}`
}

export default function PTrack ( {uri, name, number, duration, liked} ) {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <a onClick={function handleClick () {
                console.log(uri)
                sessionStorage.setItem("name", sessionStorage.getItem("playlist_name"))
                var url =`https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
                    const headers = {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer ' + sessionStorage.getItem("token")
                    }
                    
                    fetch(url, {
                        method: 'PUT',
                        headers: headers,
                        body: liked !== null ? JSON.stringify({uris: liked, offset: {position: number}}) : JSON.stringify({context_uri: uri, offset: {position: number}})
                    })
                
            }}>
            <h3 style={{textAlign: 'left', color: 'rgb(90, 210, 216)'}}>{name}</h3>
            </a>
            <span style={{position: 'absolute', left: '83.5vw', fontWeight: 'bold', color: 'rgb(90, 210, 216)'}}>{timeCalc(duration)}</span>
      </div>
    )
}