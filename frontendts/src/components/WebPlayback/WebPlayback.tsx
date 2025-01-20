//Session storage variable uplist created here
//Fix current track session variable situation at some point
import { useState, useEffect } from 'react';
import './WebPlayback.css'
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from '../../routes/Home';
import Album from '../../routes/Album';
import Playlist from '../../routes/Playlist.tsx';
import Artist from '../../routes/Artist.tsx';
import Logo from '../Logo/Logo.tsx';
import Loading2 from '../Loading2/Loading2.tsx';
import Discover from '../../routes/Discover.tsx';
import Categories from '../../routes/Categories.tsx';
import shuffle from '../../images/shuffle.png'
import repeat from '../../images/repeat.png'
import repeat1 from '../../images/repeat1.png'
import HScroll from '../HScroll.tsx';
import 'react-responsive-modal/styles.css';
import SeekBar from '../Seekbar/SeekBar.tsx';
import AddLiked from '../AddLiked/AddLiked.tsx';
import volume from '../../images/volume.png'
import { useGetDevicesQuery, Devices } from '../../ApiSlice.ts';
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import escape from '../../images/escape.jpg'
import device from '../../images/device.png'

declare global {
    interface Window{
        onSpotifyWebPlaybackSDKReady: any;
        Spotify: any;
    }
}

const track: any = {
    name: "",
    album: {
        images: [
            { url: "" }
        ],
        uri: "",
        name: ""
    },
    artists: [
        { name: "" }
    ],
    uri: ""
}
function Spin({is_active, is_paused}: any){
    
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
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" >{sessionStorage.getItem("name") ? (sessionStorage.getItem("name")!.length > 49 ? (sessionStorage.getItem("name")!.substring(0,25) + "...") : sessionStorage.getItem("name")) : null}</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </>
    )
}


export default function WebPlayback() {
    // sessionStorage.setItem("uplist", "false")

    const [player, setPlayer] = useState<any>(undefined);
    const [is_paused, setPaused] = useState<any>(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [pos, setPos] = useState<any>(0)

    const [duration, setDuration] = useState<any>(0)
    

    const [shuffled, setisShuffled] = useState(true)
    const [repeated, setRepeated] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const [currentDev, setCurrentDev] = useState<any>("TheSound")

    const {data: devices = [], isSuccess: dSuccess} = useGetDevicesQuery()
    
    type getDevicefromResultArg = TypedUseQueryStateResult<Devices[],any,any>

    const selectDevice = createSelector(
        (res: getDevicefromResultArg) => res.data,        
        (data) => data?.filter(plist => plist.is_active === true)
    )

    const { mainDevice } = useGetDevicesQuery(undefined, {
      selectFromResult: result => ({
        ...result,
        mainDevice: selectDevice(result)
      })
    })

    let pVol: any = "1"

    const [open, setOpen] = useState(false);

    const onOpenModal = () => {setOpen(true)}
    const onCloseModal = () => {setOpen(false)}
    const closeIcon = (
        <img src={escape} style={{height: '44px', width: '44px'}}/>
    )
    

    const navigate = useNavigate()

    useEffect(() => {
///////////////////////////Create Spotify web player client

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
                        getOAuthToken: (cb: any) => { cb(token); },
                        volume: 0.5
                    });
                    setPlayer(player);
                    setIsLoading(false)
                    
                    player.addListener('ready', ({ device_id }:any) => {
                        console.log('Ready with Device ID', device_id);
                        sessionStorage.setItem("device_id", device_id);
                        
                    });

                    player.addListener('not_ready', ({ device_id }: any) => {
                        console.log('Device ID has gone offline', device_id);
                    });
                    player.addListener('initialization_error', ({ message }: any) => {
                        console.error(message);
                    });
                
                    player.addListener('authentication_error', ({ message }: any) => {
                        console.error(message);
                    });
                
                    player.addListener('account_error', ({ message }: any) => {
                        console.error(message);
                    });
                    
                    
                    player.addListener('player_state_changed', ( (state: any) => {
                        if (!state) {
                            return;
                        }
                        setTrack(state.track_window.current_track);                        
                        setPaused(state.paused);        
                        setDuration(state.duration)        
                        setPos(state.position)      
                        
                        sessionStorage.setItem("name", state.track_window.current_track.album.name)
                        sessionStorage.setItem("current", state.track_window.current_track.uri)
                        sessionStorage.setItem("currentTrack",JSON.stringify(state.track_window.current_track))
                                                                                               
                    
                        player.getCurrentState().then( (state: any) => { 
                            !state ? setActive(false) : setActive(true)
                                
                                                    
                        })
                                                            
                    }));
                    
                    
                    
                    player.connect();
                        
            };
            
    }, []);

    return (
        <>
        {isLoading ? <Loading2 yes={true}/> : (
            <>
                <Logo />
                <Routes>
                <Route path = '/' element={<Home/>}/>
                <Route path='/discover' element={<Discover />} />
                <Route path='/categories/:id' element={<Categories />} />
                <Route path='/album/:id' element={<Album SpinComponent={Spin} active={is_active}  paused={is_paused}/>}/>
                <Route path='/playlist/:id' element={<Playlist SpinComponent={Spin} active={is_active}  paused={is_paused}/>} />
                <Route path='/artist/:id' element={<Artist paused={is_paused} />} />
                </Routes>    
                
                <div className='wrapper'>
            
                        <div className="main-wrapper">
                            <a onClick={function handleClick() {
                                var parts = current_track.album.uri.split(':');
                                var lastSegment = parts.pop() || parts.pop();
                                
                                var artistss: any[] = []
                                var artist_idss: any[] = []
                                current_track.artists.map((s: any) => { 
                                    artistss.push(s.name),
                                    artist_idss.push(s.uri.split(':').pop())
                                }
                                )

                                sessionStorage.setItem("uri", current_track.album.uri)
                                sessionStorage.setItem("artist", JSON.stringify(artistss))
                                sessionStorage.setItem("artist_id", JSON.stringify(artist_idss))
                                sessionStorage.setItem("image", current_track.album.images?.filter((s:any) => s.height == 640).map((s:any) => s.url))
                                // sessionStorage.setItem("name", current_track.album.name)
                                sessionStorage.setItem("albumname", current_track.album.name)
                                // console.log(sessionStorage.getItem("name")!.length)

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
                                    {/* <p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{
                                    current_track.name
                                    }</p> */}
                                    <p className='temp' style={{margin: '0px', padding: '0px'}}>{current_track.name}</p>
                                    {current_track.name ? <HScroll name={"scrollbar1"}/> : null}</div>
                                </div>
                                
                                <div className='scrollbar2'>
                                    <div className="now-playing__artist" data-direction="right">
                                        <p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{current_track.artists.map((s:any,i:number,row:any) => <a onClick={function handleClick(){ 
                                            navigate(`/app/artist/${s.uri.split(':').pop()}`)
                                            }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
                                        </p>
                                        {/* <p className='temp' style={{margin: '0px', padding: '0px'}}>{current_track.artists.map((s:any,i:number,row:any) => <a onClick={function handleClick(){ 
                                            navigate(`/app/artist/${s.uri.split(':').pop()}`)
                                            }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
                                        </p> */}
                                        {current_track.name ? <HScroll name={'scrollbar2'} /> : null}
                                    </div>
                                </div>
                                
                            </div>
                            
                            {/* Replaced old modal method for adding to playlists here */}
                            <AddLiked active={is_active} trackUri={current_track} duration={duration} />                        
                            
                        </div>
                    
                    <div className='buttonWrapper'>
                        <div>
                        <img id="volumeIcon" src={volume} style={{position: 'absolute',right: '430px',bottom: '8px', height: '30px', cursor: 'pointer'}} 
                            onMouseEnter={(() => {
                                document.getElementById("volumeIcon")!.style.opacity = '1'
                            })} 
                            onMouseLeave={(()=>{
                                player.getVolume().then((a:any) => document.getElementById("volumeIcon")!.style.opacity = a === 0 ? '0' : pVol)
                            })} 
                            onClick={function handleClick(){
                                let temp = (document.getElementById('volumeBar') as HTMLInputElement)
                                let temp2 = document.getElementById("volumeIcon")!
                                if(temp.value === "0") {
                                    player?.setVolume(+pVol)
                                    temp.value = pVol
                                    temp2.style.opacity = "1"
                                } 
                                else{ 
                                    player?.setVolume(0)
                                    pVol = temp.value
                                    temp.value = "0"
                                    temp2.style.opacity = "0"
                                    
                                }
                        }}/>
                        <input id='volumeBar' type='range' min={0} max={1} step={0.05} style={{position: 'absolute', bottom: '14px',right: '290px'}} onChange={function handleChange(e){
                            let temp2 = document.getElementById("volumeIcon")!
                            e.target.value === "0" ? temp2.style.opacity = '0' : temp2.style.opacity = e.target.value
                            player?.setVolume(e.target.value)
                            pVol = e.target.value
                        }} />
                        </div>
                    
                    <img id='toggle1' src={repeated < 2 ? repeat : repeat1} style={{position: 'absolute', right: '250px', bottom: '12px', height: '20px', cursor: 'pointer', opacity: repeated === 0 ? '0.5' : 1}} onClick={function handleClick(){   
                        let temp = document.getElementById('toggle1')!
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

                    <button className="btn-spotify" onClick={() => { pos > 3000 ? player!.seek(0) : player!.previousTrack() }} >
                        &lt;&lt;
                    </button>

                    <button className="btn-spotify" style={{maxWidth: '85px', minWidth: '85px'}} onClick={() => { player!.togglePlay() }} >
                        { is_paused ? "PLAY" : "PAUSE" }
                    </button>

                    <button className="btn-spotify" onClick={() => { player!.nextTrack() }} >
                        &gt;&gt;
                    </button>

                    <img id='toggle2' src={shuffle} style={{position: 'absolute', left: '240px', bottom: '12px', height: '19px', cursor: 'pointer', opacity: shuffled ? '0.5' : '1'}} onClick={function handleClick(){     

                        let temp = document.getElementById('toggle2')!
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
                    
                    {/* Replaced old music seek bar method here */}
                    <SeekBar duration={duration} player={player} paused={is_paused} />

                    <img src={device} onClick={function handleClick(){      
                        onOpenModal()                  
                        dSuccess ? console.log(devices) : null                                                
                    }} style={{position: 'absolute', right: '-42vw', height: '42px', cursor: 'pointer'}} />

                    <Modal modalId='modal1' open={open} onClose={onCloseModal} closeIcon={closeIcon} >
                        <div style={{marginTop: '60px'}}>
                            <p style={{color: 'black', fontWeight: 'bold', fontSize: '20px'}}>Current Device</p>
                            {/* <p>{mainDevice!.name}</p> */}
                            <p>{currentDev}</p>
                            <p style={{color: 'black', fontWeight: 'bold', fontSize: '20px'}}>Select Another Device</p>
                            <a onClick={function handleClick(){
                                    setCurrentDev("TheSound")
                                    fetch(`http://localhost:8888/auth/player/${sessionStorage.getItem("device_id")}`, {
                                        method: 'POST',
                                        headers: {"Content-Type":"application/json"},                                        
                                    })
                                }}>
                                   <p>TheSound</p> 
                                </a> 
                            {devices.map(a =>
                                a.name === "TheSound" ? null : <a onClick={function handleClick(){
                                    setCurrentDev(a.name)
                                    fetch(`http://localhost:8888/auth/player/${a.id}`, {
                                        method: 'POST',
                                        headers: {"Content-Type":"application/json"},                                        
                                    })
                                }}>
                                   <p>{a.name}</p> 
                                </a> 
                                
                            )}
                        </div>
                    </Modal>
                    
                    </div>
                    
                    
                </div>

            </>
        )}
        
        </>
    )
}




























// import { useGetAlbumsQuery, useGetPlaylistsQuery, useGetLikedQuery } from "../../ApiSlice";
// import { useEffect, useState } from "react";
// let a: string

// export default function WebPlayback(){

//     const [users, setUsers] = useState("")
//     useEffect(() => {
        
//     // const fetchUsers = async () => {
//     //     try {
//     //         var temp = await fetch("http://localhost:8888/auth/users")
//     //     .then((res) => {
//     //         console.log(res.json())
//     //         return res.json();
//     //     }).then((data) => {
//     //         return data;
//     //     })
//     //         return temp
//     //     }
//     //     catch (err) {}
//     //     }
//     // const fetchBaby = async () => {
//     //     const tempUsers = await fetchUsers()
//     //     console.log(tempUsers.items)
//     //     sessionStorage.setItem("username", tempUsers.items)
//     // }
//     // fetchBaby()
//     const getUser = async () => {
//         try{
//         const res = await fetch("http://localhost:8888/auth/users")
        
//         const data = await res.json()
//         return data
//         }
//         catch (err){}
//     }
//     getUser().then(data => {
//         sessionStorage.setItem("username", data)
//         setUsers(data.items)
//     })
//     },[])
    
//     // const {
//     //     data: albums = [],
//     //     isSuccess
//     // } = useGetAlbumsQuery()

//     // const {
//     //     data: playlists = [],
//     //     isSuccess
//     // } = useGetPlaylistsQuery()
//     const {
//         data: liked = [],
//         isSuccess
//     } = useGetLikedQuery()
    
//     if (isSuccess) console.log(liked)
//     return(
//         <>
//         <h1>Hi</h1>
//         </>
//     )
//     // return (
//     //     <>
//     //     <h2>{users}</h2>
//     //     </>
//     // )
// }