//session storage variable name set here

function timeCalc (ms) {
    const temp = Math.round(ms / 1000)
    const mins = Math.floor(temp / 60)
    const secs = temp - mins * 60

    if (secs.toString().length == 1) return `${mins}.${secs}0`
    else return `${mins}.${secs}`
}

export default function Track ( {uri, name, number, duration, album_name, artist} ) {
    return (
        <div style={{display: 'flex'}}>
            <a onClick={function handleClick () {
                // console.log(sessionStorage.getItem("device_id"))
                // console.log(uri)
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
            <div style={{position: 'relative', display: 'flex', marginRight: '300px', textAlign: 'left', color: 'rgb(90, 210, 216)' }}>
            <h2 style={{margin: '0px', padding: '0px', fontSize: '20px',maxWidth: '700px', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} >{name}</h2>
            <h4 style={{position: 'absolute', maxWidth: '700px', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{artist.map((a,i,row) => row.length - 1 !== i ? a.name + ", " : a.name)}</h4>
            </div>
            <br></br>
            <br></br>
            </a>
            <span style={{position: 'absolute', left: '81vw', fontWeight: 'bold', color: 'rgb(90, 210, 216)'}}>{timeCalc(duration)}</span>
      </div>
    )
}