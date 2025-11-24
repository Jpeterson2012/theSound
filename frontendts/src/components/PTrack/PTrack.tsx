//session storage variable name set here
import './PTrack.css'
import SavedSong from "../SavedSong/SavedSong.tsx"
import musicBar from '../musicBar/musicBar.tsx';
import { spotifyRequest, timeCalc } from '../../utils/utils.ts';

export default function PTrack ( {uri, name, number, duration, liked, artist, t_uri, rplay,paused}: any ) {        
    return (
        <div className='pTrackContainer' style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <a 
                onClick={() => {                                                
                    sessionStorage.setItem("name", sessionStorage.getItem("playlist_name")!);
                    
                    const url = `https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem([null, "null"].includes(sessionStorage.getItem("currentContext")) ? "device_id" : "currentContext")}`;
                    
                    try{
                        spotifyRequest(url, 'PUT', {
                            body: JSON.stringify({uris: liked, offset: {position: number}})
                        });
                    } catch(e) {
                        console.log(e);
                    }
                    
                }}
            >
                <div>            
                    <div className="ptrackInfo">
                        <div style={{display: 'flex'}} >
                            {!paused && <span className="pMusic">{(sessionStorage.getItem('current') === t_uri) && musicBar()}</span>}

                            <h2 className="ptrackName">{name}</h2>
                        </div>                    

                        <h4 className="ptrackArtist">{artist?.map((a: any,index: number,row: any) => row.length - 1 !== index ? a.name + ", " : a.name)}</h4>
                    </div>
                </div>
            
            </a>

            <div style={{display: 'flex'}} >{rplay && <SavedSong track={t_uri}/>}<span className="ptrackDur">{timeCalc(duration)}</span></div>
      </div>
    );
};