//session storage variable name set here

function timeCalc (ms) {
    const temp = Math.round(ms / 1000)
    const mins = Math.floor(temp / 60)
    const secs = temp - mins * 60

    if (secs.toString().length == 1) return `${mins}.${secs}0`
    else return `${mins}.${secs}`
}

export default function PTrack ( {uri, name, number, duration, liked, artist} ) {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <a onClick={function handleClick () {
                // sessionStorage.setItem("name", sessionStorage.getItem("playlist_name"))
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
            <div style={{position: 'relative', display: 'flex', marginRight: '300px', textAlign: 'left', color: 'rgb(90, 210, 216)' }}>
            <h2 style={{textAlign: 'left', margin: '0px', padding: '0px', fontSize: '20px'}}>{name}</h2>
            <h4 style={{position: 'absolute'}}>{artist.map((a,i,row) => row.length - 1 !== i ? a.name + ", " : a.name)}</h4>
            </div>
            </a>
            <span style={{position: 'absolute', left: '83.5vw', fontWeight: 'bold', color: 'rgb(90, 210, 216)'}}>{timeCalc(duration)}</span>
      </div>
    )
}