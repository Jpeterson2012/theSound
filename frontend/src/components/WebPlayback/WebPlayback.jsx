import React, { useState, useEffect, memo } from 'react';
import './WebPlayback.css'
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from '../../routes/Home';
import Album from '../../routes/Album';
import Playlist from '../../routes/Playlist.jsx';
import Artist from '../../routes/Artist.jsx';
import Logo from '../Logo/Logo.jsx';
import Loading from '../Loading/Loading.jsx';
import Discover from '../../routes/Discover.jsx';

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
    const e = document.getElementById("record")
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
              <text className="writing" y="230" x="115" textLength="170">{sessionStorage.getItem("name")}</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        {/* {is_paused ? e.getElementById("record").style.animationPlayState = 'paused' : (
            e.getElementById("record").style.animation = 'spin 2.5s linear infinite',
            e.getElementById("record").style.transformOrigin = 'center center'
        )} */}
        </>
    )
}

const WebPlayback = memo(function WebPlayback() {
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);

    const [albums, setAlbums] = useState([]);
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
                        setPaused(state.paused);        
                    
                        player.getCurrentState().then( state => { 
                            (!state)? setActive(false) : setActive(true) 
                        });

                        // const e = document.getElementById("record")
                        // if (location.href !== 'http://localhost:5173/app'){
                        // if (state.paused !== true) {
                        //     e.style.animation = 'spin 2.5s linear infinite'
                        //     e.style.transformOrigin = 'center center'
                        //     sessionStorage.setItem("playing", true)
                            
                        // }
                        // else {
                        //     e.style.animationPlayState = 'paused'
                        //     sessionStorage.setItem("playing", false)
                        // }

                    //}
                    
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
                
                console.log(tempAlbums)
                setUsers(tempUsers.display_name)
                setAlbums(tempAlbums)
                sessionStorage.setItem("username", tempUsers.display_name)
                sessionStorage.setItem("albums", JSON.stringify(tempAlbums))
                }
                fetchBoth()
            }
        // }
    }, []);
    
    return (
        <>
        {isLoading ? <Loading yes={true}/> : (
            <>
                <Logo />
                <Routes>
                <Route path = '/' element={<Home albums={albums}/>}/>
                <Route path='/discover' element={<Discover />} />
                <Route path='/album/:id' element={<Album SpinComponent={Spin} active={is_active}  paused={is_paused}/>}/>
                <Route path='/playlist/:id' element={<Playlist plists={albums.items2} SpinComponent={Spin} active={is_active}  paused={is_paused}/>} />
                <Route path='/artist/:id' element={<Artist />} />
                </Routes>    
                
                <div className='wrapper'>
                        <div className="main-wrapper">
                            <a onClick={function handleClick() {
                                navigate(`/app/album/${sessionStorage.getItem("id")}`)
                            }}>
                            <img src={current_track.album.images[1]?.url} 
                                className="now-playing__cover" alt="" />
                            </a>
                            

                            <div className="now-playing__side">
                                <div className="now-playing__name">{
                                            current_track.name
                                            }</div>

                                <div className="now-playing__artist">{
                                            current_track.artists[0].name
                                            }</div>
                            </div>
                            
                        </div>
                    
                    <div className='buttonWrapper'>
                        { !is_active ? null : ( is_paused ? null : (
                            <div class="now playing" id="music">
                            <span class="bar n1">A</span>
                            <span class="bar n2">B</span>
                            <span class="bar n3">c</span>
                            <span class="bar n4">D</span>
                            <span class="bar n5">E</span>
                            <span class="bar n6">F</span>
                            <span class="bar n7">G</span>
                            <span class="bar n8">H</span>
                            </div>
                        ))}

                    <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                        &lt;&lt;
                    </button>

                    <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                        { is_paused ? "PLAY" : "PAUSE" }
                    </button>

                    <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                        &gt;&gt;
                    </button>                      
                    </div>
                    
                    
                </div>

            </>
        )}

        </>
    )
})
export default WebPlayback

