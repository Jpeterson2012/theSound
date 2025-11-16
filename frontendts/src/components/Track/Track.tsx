//session storage variable name set hereimport musicBar from "../musicBar/musicBar.tsx"
import './Track.css';
import SavedSong from '../SavedSong/SavedSong';
import musicBar from '../musicBar/musicBar.tsx';
import { spotifyRequest } from '../../utils.ts';

function timeCalc (ms: number) {
    const temp = Math.round(ms / 1000);
    let mins = Math.floor(temp / 60);
    let secs = temp - mins * 60;
    secs > 59 && (mins += 1, secs -= 60);
    (secs.toString().length === 1 && secs > 5) && (mins += 1, secs -= 6);

    if (secs.toString().length == 1) return `${mins}:${secs}0`;
    else return `${mins}:${secs}`;
};

export default function Track ( {uri, name, number, duration, album_name, artist, t_uri, show, customWidth, paused}: any) {
    return (
        <div className='trackContainer' style={customWidth ? {width: `${customWidth}%`} : {width: '100%'}}>
            <a 
                onClick={() => {                
                    // console.log(sessionStorage.get
                    // console.log(sessionStorage.getItem("uri"))
                    // console.log(sessionStorage.getItem("token"))
                    album_name && sessionStorage.setItem("albumname", album_name);
                    
                    // sessionStorage.setItem("name", sessionStorage.getItem("albumname"))
                    const url = `https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem([null, "null"].includes(sessionStorage.getItem("currentContext")) ? "device_id" : "currentContext")}`;
                    
                    spotifyRequest(url, 'PUT', {
                        body: JSON.stringify({context_uri: uri, offset: {position: number - 1}}),
                    });                
                }}
            >                            
                <div className="innerMain">
                    <div style={{display: 'flex'}}>
                        {!paused && <span className="tMusic">{(sessionStorage.getItem('current') === t_uri) && musicBar()}</span>}

                        <h2>{name}</h2>
                    </div>                    

                    <h4>{artist.map((a: any,index: number,row: any) => row.length - 1 !== index ? a.name + ", " : a.name)}</h4>                            
                </div>
                
                <br></br>            
            </a>
            {show === undefined && <div style={{display: 'flex'}}><SavedSong track={t_uri} /><span className="songLength">{timeCalc(duration)}</span></div>}
      </div>
    );
};