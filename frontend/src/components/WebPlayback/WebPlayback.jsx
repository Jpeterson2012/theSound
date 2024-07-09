import { useState, useEffect, memo } from 'react';
import './WebPlayback.css'
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from '../../routes/Home';
import Album from '../../routes/Album';
import Playlist from '../../routes/Playlist.jsx';
import Artist from '../../routes/Artist.jsx';
import Logo from '../Logo/Logo.jsx';
import Loading from '../Loading/Loading.jsx';
import Discover from '../../routes/Discover.jsx';
import Categories from '../../routes/Categories.jsx';
import shuffle from '../../images/shuffle.png'
import repeat from '../../images/repeat.png'
import repeat1 from '../../images/repeat1.png'
import HScroll from '../HScroll.jsx';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}
function Spin({is_active, is_paused}){
    
    return (
        <>
        <svg viewBox="0 0 400 400">
              <g id="record"  style={!is_active ? {animationPlayState: 'paused'} :  is_paused ? {animationPlayState: 'paused'} : ({animationPlayState: 'running'})}>
              <circle r="200" cx="200" cy="200" />
              <circle className="line1" r="180" cx="200" cy="200" />
              <circle className="line2" r="160" cx="200" cy="200" />
              <circle className="line3" r="140" cx="200" cy="200" />
              <circle id="label" cx="200" cy="200" r="100" style={{fill: '#0066ff'}}/>
              <text className="writing" y="160" x="165">TheSound </text>  
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" >{sessionStorage.getItem("name") ? (sessionStorage.getItem("name").length > 49 ? (sessionStorage.getItem("name").substring(0,25) + "...") : sessionStorage.getItem("name")) : null}</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </>
    )
}

const WebPlayback = memo(function WebPlayback() {
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [pos, setPos] = useState(0)
    const [duration, setDuration] = useState(0)
    const [shuffled, setisShuffled] = useState(true)
    const [repeated, setRepeated] = useState(0)

    const [albums, setAlbums] = useState([]);
    function passAlbum(temp){
        setAlbums(temp)
    }
    const [playlists, setPlaylists] = useState([])
    function passPlaylist(temp){
        setPlaylists(temp)
    }
    const [liked_songs, setLiked_songs] = useState([])
    function passLiked(temp){
        setLiked_songs(temp)
    }
    const [users, setUsers] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    

    const navigate = useNavigate()

    useEffect(() => {
///////////////////////////Create Spotify web player client

        // if (sessionStorage.getItem("loggedIn") !== true){

            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            var token = ''
            const fetchToken = async () => {
                const response = await fetch("http://localhost:8888/auth/token")
                const data = await response.json()
                token = data.items
                sessionStorage.setItem("token", data.items)
                
            }
            fetchToken()
            

            document.body.appendChild(script);
            
            window.onSpotifyWebPlaybackSDKReady = () => {  
                
                    const player = new window.Spotify.Player({ 
                        name: 'TheSound',
                        getOAuthToken: cb => { cb(token); },
                        volume: 0.5
                    });
                    setPlayer(player);
                    
                    player.addListener('ready', ({ device_id }) => {
                        console.log('Ready with Device ID', device_id);
                        sessionStorage.setItem("device_id", device_id)
                    });

                    player.addListener('not_ready', ({ device_id }) => {
                        console.log('Device ID has gone offline', device_id);
                    });
                    player.addListener('initialization_error', ({ message }) => {
                        console.error(message);
                    });
                
                    player.addListener('authentication_error', ({ message }) => {
                        console.error(message);
                    });
                
                    player.addListener('account_error', ({ message }) => {
                        console.error(message);
                    });
                    
                    
                    player.addListener('player_state_changed', ( state => {
                        if (!state) {
                            return;
                        }
                        setTrack(state.track_window.current_track);
                        sessionStorage.setItem("name", state.track_window.current_track.album.name)
                        sessionStorage.setItem("current", state.track_window.current_track.uri)
                        setPaused(state.paused);        
                        setDuration(state.duration)            
                    
                        player.getCurrentState().then( state => { 
                            !state ? setActive(false) : setActive(true)
                                
                                                    
                        })
                                                            
                    }));
                    
                    
                    
                    player.connect();
                        
            };
////////////////////////////////////////////Fetches user library here
            const user = sessionStorage.getItem("username")
            const album = sessionStorage.getItem("albums")
            if (user && album){
                setUsers(user);
                setAlbums(JSON.parse(album))
            }
            else{
                const fetchUsers = async () => {
                try {
                    var temp = await fetch("http://localhost:8888/auth/users")
                .then((res) => {
                    return res.json();
                })
                    return temp
                }
                catch (err) {}
                }
                const fetchAlbums = async () => {
                try {
                    var temp = await fetch("http://localhost:8888/auth/homepage")
                .then((res) => {
                    return res.json();
                }).then((data) => {return data})
                    return temp
                }
                catch (err) {}
                }
                
                const fetchBoth = async () => {
                setIsLoading(true)
                const tempUsers = await fetchUsers();
                const tempAlbums = await fetchAlbums();
                setIsLoading(false)
                
                // console.log(tempAlbums)
                setUsers(tempUsers.display_name)
                setAlbums(tempAlbums.items)
                setPlaylists(tempAlbums.items2)
                setLiked_songs(tempAlbums.items3)
                sessionStorage.setItem("username", tempUsers.display_name)
                // localStorage.setItem("albums", JSON.stringify(tempAlbums))
                console.log(tempAlbums)
                }
                fetchBoth()
            }
        // }
        

            
    }, []);

    setTimeout(() => {
    is_active && player.getCurrentState().then(state => {
            if (!state){console.error('error');return}
            setPos(state.position)
        })

    }, 1250)
    

    return (
        <>
        {isLoading ? <Loading yes={true}/> : (
            <>
                <Logo />
                <Routes>
                <Route path = '/' element={<Home albums={albums} set_albums={passAlbum} playlists={playlists} set_playlists={passPlaylist}/>}/>
                <Route path='/discover' element={<Discover />} />
                <Route path='/categories/:id' element={<Categories />} />
                <Route path='/album/:id' element={<Album SpinComponent={Spin} active={is_active}  paused={is_paused}/>}/>
                <Route path='/playlist/:id' element={<Playlist plists={playlists} liked={liked_songs} set_liked={passLiked} SpinComponent={Spin} active={is_active}  paused={is_paused}/>} />
                <Route path='/artist/:id' element={<Artist paused={is_paused} />} />
                </Routes>    
                
                <div className='wrapper'>
                        <div className="main-wrapper">
                            <a onClick={function handleClick() {
                                var parts = current_track.album.uri.split(':');
                                var lastSegment = parts.pop() || parts.pop();
                                
                                var artistss = []
                                var artist_idss = []
                                current_track.artists.map(s => { 
                                    artistss.push(s.name),
                                    artist_idss.push(s.uri.split(':').pop())
                                }
                                )

                                sessionStorage.setItem("uri", current_track.album.uri)
                                sessionStorage.setItem("artist", JSON.stringify(artistss))
                                sessionStorage.setItem("artist_id", JSON.stringify(artist_idss))
                                sessionStorage.setItem("image", current_track.album.images?.filter(s => s.height == 640).map(s => s.url))
                                // sessionStorage.setItem("name", current_track.album.name)
                                sessionStorage.setItem("albumname", current_track.album.name)
                                console.log(sessionStorage.getItem("name").length)

                                navigate(`/app/album/${lastSegment}`)
                            }}>
                            <img src={current_track.album.images[0]?.url} 
                                className="now-playing__cover" alt="" style={{marginRight: '14px'}} />
                            </a>
                            

                            <div className="now-playing__side">
                                <div className='scrollbar1'>
                                <div className="now-playing__name" style={{fontWeight: 'bold',margin: '0px', padding: '0px'}}><p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{
                                    current_track.name
                                    }</p>
                                    <p className='temp' style={{margin: '0px', padding: '0px'}}>{current_track.name}</p>
                                    {current_track.name ? <HScroll name={'scrollbar1'}/> : null}</div>
                                </div>
                                
                                <div className='scrollbar2'>
                                    <div className="now-playing__artist" data-direction="right">
                                        <p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{current_track.artists.map((s,i,row) => <a onClick={function handleClick(){ 
                                            navigate(`/app/artist/${s.uri.split(':').pop()}`)
                                            }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
                                        </p>
                                        <p className='temp' style={{margin: '0px', padding: '0px'}}>{current_track.artists.map((s,i,row) => <a onClick={function handleClick(){ 
                                            navigate(`/app/artist/${s.uri.split(':').pop()}`)
                                            }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
                                        </p>
                                        {current_track.name ? <HScroll name={'scrollbar2'} /> : null}
                                    </div>
                                </div>
                                
                            </div>
                            { !is_active ? null : (
                            <h2 id='addSong' style={{height: '35px', width: '35px', marginLeft: '15px', cursor: 'pointer', border: '2px solid white', borderRadius: '50%'}} onClick={function handleClick(){
                                let temp = document.getElementById('addSong')
                                temp.style.animation = 'hithere 1s ease'
                                setTimeout(()=>{
                                    temp.style.removeProperty('animation')
                                }, 750)

                                
                                setLiked_songs({tracks: [{album_id: current_track.album.uri, images: current_track.album.images, artists: current_track.artists, duration_ms: duration, uri: current_track.uri, name: current_track.name}, ...liked_songs.tracks]})
                                var parts = current_track.album.uri.split(':');
                                var lastSegment = parts.pop() || parts.pop();
                                fetch(`http://localhost:8888/auth/update`, {
                                    method: 'POST',
                                    headers: {"Content-Type":"application/json"},
                                    body: JSON.stringify({album_id: lastSegment, images: JSON.stringify(current_track.album.images), artists: JSON.stringify(current_track.artists), duration: duration, track_id: current_track.id, name: current_track.name})
                                })
                            }}>{(liked_songs.tracks.find((e)=>e.uri === current_track.uri) === undefined ? "+" : "✓")}</h2>
                        )}
                            
                        </div>
                    
                    <div className='buttonWrapper'>
                    <img id='toggle1' src={repeated < 2 ? repeat : repeat1} style={{position: 'absolute', right: '250px', bottom: '12px', height: '20px', cursor: 'pointer', opacity: repeated === 0 ? '0.5' : 1}} onClick={function handleClick(){   
                        let temp = document.getElementById('toggle1')
                        temp.style.animation = 'hithere 1s ease'  

                        if (repeated === 0) setRepeated(1)
                        else if (repeated === 1) setRepeated(2)
                        else if (repeated === 2) setRepeated(0)
                        console.log(repeated)                
                        fetch(`http://localhost:8888/auth/shuffle`, {
                            method: 'POST',
                            headers: {"Content-Type":"application/json"},
                            body: JSON.stringify({state: repeated === 0 ? 'context' : (repeated === 1 ? 'track' : 'off')})
                        })

                        setTimeout(()=>{
                            temp.style.removeProperty('animation')
                        }, 750)

                        }} />

                        { !is_active ? null : ( is_paused ? null : (
                            <div className="now_playing" id="music">
                            <span className="bar n1">A</span>
                            <span className="bar n2">B</span>
                            <span className="bar n3">c</span>
                            <span className="bar n4">D</span>
                            <span className="bar n5">E</span>
                            <span className="bar n6">F</span>
                            <span className="bar n7">G</span>
                            <span className="bar n8">H</span>
                            </div>
                        ))}

                    <button className="btn-spotify" onClick={() => { setPos(0), pos > 3000 ? player.seek(0) : player.previousTrack() }} >
                        &lt;&lt;
                    </button>

                    <button className="btn-spotify" style={{maxWidth: '85px', minWidth: '85px'}} onClick={() => { player.togglePlay() }} >
                        { is_paused ? "PLAY" : "PAUSE" }
                    </button>

                    <button className="btn-spotify" onClick={() => { setPos(0),player.nextTrack() }} >
                        &gt;&gt;
                    </button>

                    <img id='toggle2' src={shuffle} style={{position: 'absolute', left: '240px', bottom: '12px', height: '19px', cursor: 'pointer', opacity: shuffled ? '0.5' : '1'}} onClick={function handleClick(){     

                        let temp = document.getElementById('toggle2')
                        temp.style.animation = 'hithere 1s ease'

                        if (shuffled === true) setisShuffled(false)
                        else setisShuffled(true)                
                        fetch(`http://localhost:8888/auth/shuffle`, {
                            method: 'POST',
                            headers: {"Content-Type":"application/json"},
                            body: JSON.stringify({state: shuffled})
                        })
                        setTimeout(()=>{
                            temp.style.removeProperty('animation')
                        }, 750)
                        
                        
                    }} />            

                    <input id='seeker' type='range' min="0" max={duration} value={pos} onChange={function handleChange(e){ 
                        player.seek(e.target.value)
                        setPos(e.target.value)
                    }} style={{position: 'absolute', left: '300px', bottom: '12px', width: '500px'}} /> 

                    </div>
                    
                    
                </div>

            </>
        )}

        </>
    )
})
export default WebPlayback

