//session storage variable name set hereimport musicBar from "../musicBar/musicBar.tsx"
import './Track.css';
import { useEffect, useState } from "react";
import SavedSong from '../SavedSong/SavedSong';
import musicBar from '../musicBar/musicBar.tsx';
import { spotifyRequest, timeCalc, getRandomInt } from '../../utils/utils.ts';

export default function Track ( {uri, name, number, duration, album_name, artist, t_uri, show, customWidth, paused}: any) {
    const [plays, setPlays] = useState<string>("1,000,000");

    useEffect(() => {
        setPlays(getRandomInt(1000000, 10000000));
    }, []);

    return (
        <div className='trackContainer' style={{...(customWidth ? {width: `${customWidth}%`} : {width: '100%'}), ...(show === undefined && {borderBottom: '1px solid rgba(90, 210, 216, 0.3)'})}}>
            <a 
                onClick={() => {                
                    // console.log(sessionStorage.get
                    // console.log(sessionStorage.getItem("uri"))                    
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

            {(show === undefined && !customWidth) && <span style={{position: 'absolute', color: 'rgb(90, 210, 216)', top: '25%', left: '60%', fontWeight: 'bold'}} >{plays}</span>}

            {show === undefined && <div style={{display: 'flex'}}><SavedSong track={t_uri} /><span className="songLength">{timeCalc(duration)}</span></div>}
      </div>
    );
};