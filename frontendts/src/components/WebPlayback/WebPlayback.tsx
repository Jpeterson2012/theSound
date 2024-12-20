// import { useState, useEffect, memo } from 'react';
// import './WebPlayback.css'
// import { Routes, Route, useNavigate } from "react-router-dom"
// import Home from '../../routes/Home';
// import Album from '../../routes/Album';
// import Playlist from '../../routes/Playlist.jsx';
// import Artist from '../../routes/Artist.jsx';
// import Logo from '../Logo/Logo.jsx';
// import Loading from '../Loading/Loading.jsx';
// import Discover from '../../routes/Discover.jsx';
// import Categories from '../../routes/Categories.jsx';
// import shuffle from '../../images/shuffle.png'
// import repeat from '../../images/repeat.png'
// import repeat1 from '../../images/repeat1.png'
// import HScroll from '../HScroll.jsx';
// import 'react-responsive-modal/styles.css';
// import { Modal } from 'react-responsive-modal';
// import escape from '../../images/escape.jpg'

// const track = {
//     name: "",
//     album: {
//         images: [
//             { url: "" }
//         ]
//     },
//     artists: [
//         { name: "" }
//     ]
// }
// function Spin({is_active, is_paused}){
    
//     return (
//         <>
//         <svg viewBox="0 0 400 400">
//               <g id="record"  style={!is_active ? {animationPlayState: 'paused'} :  is_paused ? {animationPlayState: 'paused'} : ({animationPlayState: 'running'})}>
//               <circle r="200" cx="200" cy="200" />
//               <circle className="line1" r="180" cx="200" cy="200" />
//               <circle className="line2" r="160" cx="200" cy="200" />
//               <circle className="line3" r="140" cx="200" cy="200" />
//               <circle id="label" cx="200" cy="200" r="100" style={{fill: '#0066ff'}}/>
//               <text className="writing" y="160" x="165">TheSound </text>  
//               <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" >{sessionStorage.getItem("name") ? (sessionStorage.getItem("name").length > 49 ? (sessionStorage.getItem("name").substring(0,25) + "...") : sessionStorage.getItem("name")) : null}</text>    
//               <circle id="dot" cx="200" cy="200" r="6" />
//               </g>
//             </svg>
//         </>
//     )
// }
// function saved(uri,liked,playlists){
//     (liked.tracks.find((e)=>e.uri === uri)) === undefined ? console.log("not in liked") : console.log("in liked")
//     for(let i = 0; i < playlists.length; i++){
//         (playlists[i].tracks.find((e)=>e.uri === uri)) === undefined ? console.log(`not in playlist: ${playlists[i].name}`) : console.log(`in playlist: ${playlists[i].name}`)
//     }
// }

// const WebPlayback = memo(function WebPlayback({users, albums, playlists, liked_songs, passAlbum, passPlaylist, passLiked, setLiked_songs}) {
//     var submit1 = []
//     var submit2 = []    
//     const [player, setPlayer] = useState(undefined);
//     const [is_paused, setPaused] = useState(false);
//     const [is_active, setActive] = useState(false);
//     const [current_track, setTrack] = useState(track);
//     const [pos, setPos] = useState(0)
//     const [duration, setDuration] = useState(0)
//     const [shuffled, setisShuffled] = useState(true)
//     const [repeated, setRepeated] = useState(0)
//     const [isLoading, setIsLoading] = useState(true)
//     const [open, setOpen] = useState(false);

//     const onOpenModal = () => {setOpen(true); submit1 = [], submit2 = []}
//     const onCloseModal = () => {
//         setOpen(false);
//         // console.log(submit1)
//         let temp = document.getElementById('checkbox').checked
//         if (submit1[0] !== temp){
//             // var parts = current_track.album.uri.split(':');
//             // var lastSegment = parts.pop() || parts.pop();

//             setLiked_songs({tracks: liked_songs?.tracks?.filter(a => a.uri !== current_track.uri)})
//             fetch(`http://localhost:8888/auth/update`, {
//                 method: 'DELETE',
//                 headers: {"Content-Type":"application/json"},
//                 body: JSON.stringify({track_id: current_track.id})
//             })
//         }
//         // submit2.push(temp)
//         for (let i = 0; i < playlists.length; i++){
//             submit2.push(document.getElementById(`checkbox${i}`).checked)
//             if (submit1[i+1] !== document.getElementById(`checkbox${i}`).checked){
//                 setTimeout(()=>{
//                 passPlaylist(i,{images: current_track.album.images, uri: current_track.uri, name: current_track.name, track_number: 0, duration_ms: duration, artists: current_track.artists})
//                 // console.log(playlists[i].tracks)
//                 fetch(`http://localhost:8888/auth/update/${playlists[i].playlist_id}`, {
//                          method: 'POST',
//                          headers: {"Content-Type":"application/json"},
//                          body: JSON.stringify({code: 'hi'})
//                      })
//                 },1000)
//             }
//         }
//         // console.log(submit2)
//         // setLiked_songs({tracks: [{album_id: current_track.album.uri, images: current_track.album.images, artists: current_track.artists, duration_ms: duration, uri: current_track.uri, name: current_track.name}, ...liked_songs.tracks]})
//         // var parts = current_track.album.uri.split(':');
//         // var lastSegment = parts.pop() || parts.pop();
//         // fetch(`http://localhost:8888/auth/update`, {
//         //     method: 'POST',
//         //     headers: {"Content-Type":"application/json"},
//         //     body: JSON.stringify({album_id: lastSegment, images: JSON.stringify(current_track.album.images), artists: JSON.stringify(current_track.artists), duration: duration, track_id: current_track.id, name: current_track.name})
//         // })
//     }
//     const closeIcon = (
//         <img src={escape} style={{height: '44px', width: '44px'}}/>
//     )
    

//     const navigate = useNavigate()

//     useEffect(() => {
// ///////////////////////////Create Spotify web player client

//             const script = document.createElement("script");
//             script.src = "https://sdk.scdn.co/spotify-player.js";
//             script.async = true;
//             var token = ''
//             const fetchToken = async () => {
//                 const response = await fetch("http://localhost:8888/auth/token")
//                 const data = await response.json()
//                 token = data.items
//                 sessionStorage.setItem("token", data.items)
                
//             }
//             fetchToken()
            

//             document.body.appendChild(script);
            
//             window.onSpotifyWebPlaybackSDKReady = () => {  
                
//                     const player = new window.Spotify.Player({ 
//                         name: 'TheSound',
//                         getOAuthToken: cb => { cb(token); },
//                         volume: 0.5
//                     });
//                     setPlayer(player);
//                     setIsLoading(false)
                    
//                     player.addListener('ready', ({ device_id }) => {
//                         console.log('Ready with Device ID', device_id);
//                         sessionStorage.setItem("device_id", device_id);
                        
//                     });

//                     player.addListener('not_ready', ({ device_id }) => {
//                         console.log('Device ID has gone offline', device_id);
//                     });
//                     player.addListener('initialization_error', ({ message }) => {
//                         console.error(message);
//                     });
                
//                     player.addListener('authentication_error', ({ message }) => {
//                         console.error(message);
//                     });
                
//                     player.addListener('account_error', ({ message }) => {
//                         console.error(message);
//                     });
                    
                    
//                     player.addListener('player_state_changed', ( state => {
//                         if (!state) {
//                             return;
//                         }
//                         setTrack(state.track_window.current_track);
//                         sessionStorage.setItem("name", state.track_window.current_track.album.name)
//                         sessionStorage.setItem("current", state.track_window.current_track.uri)
//                         setPaused(state.paused);        
//                         setDuration(state.duration)                                                
                      
                    
//                         player.getCurrentState().then( state => { 
//                             !state ? setActive(false) : setActive(true)
                                
                                                    
//                         })
                                                            
//                     }));
                    
                    
                    
//                     player.connect();
                        
//             };
// ////////////////////////////////////////////Fetches user library here
//             // const user = sessionStorage.getItem("username")
//             // const album = sessionStorage.getItem("albums")
//             // if (user && album){
//             //     setUsers(user);
//             //     setAlbums(JSON.parse(album))
//             // }
            
//     }, []);

//     return (
//         <>
//         {isLoading ? <Loading yes={true}/> : (
//             <>
//                 <Logo />
//                 <Routes>
//                 <Route path = '/' element={<Home albums={albums} set_albums={passAlbum} playlists={playlists} set_playlists={passPlaylist}/>}/>
//                 <Route path='/discover' element={<Discover />} />
//                 <Route path='/categories/:id' element={<Categories />} />
//                 <Route path='/album/:id' element={<Album SpinComponent={Spin} active={is_active}  paused={is_paused}/>}/>
//                 <Route path='/playlist/:id' element={<Playlist plists={playlists} liked={liked_songs} set_liked={passLiked} SpinComponent={Spin} active={is_active}  paused={is_paused}/>} />
//                 <Route path='/artist/:id' element={<Artist paused={is_paused} />} />
//                 </Routes>    
                
//                 <div className='wrapper'>

//                     <div id="snackbar">Added to Liked Songs <button style={{border: 'none'}} onClick={function handleClick(){
//                         onOpenModal()
//                     }}>Change</button></div>
//                     <div>            
//                         <Modal open={open} onClose={onCloseModal} center classNames={{overlay: 'customOverlay', modal: 'customModal'}} closeIcon={closeIcon}>
//                             <div>
//                             <div style={{display: 'flex', alignItems: 'center'}}>
//                                 <img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '100px', width: '100px', marginRight: '50px'}}/>
//                                 <h3>Liked Songs</h3>
//                                 {/* <button>{(liked_songs?.tracks?.find((e)=>e.uri === current_track.uri) === undefined ? "Add" : "Remove")}</button> */}
//                                 <input id='checkbox' type='checkbox' ></input>
//                                 {open ? (()=>{
//                                     setTimeout(()=>{
//                                         document.getElementById('checkbox').checked = true
//                                         submit1.push(document.getElementById('checkbox').checked)
//                                     },300)
                                    
//                                 })() : null}
                                
//                             </div>
//                             {playlists.map((a,i) =>
//                                 <div style={{display: 'flex', alignItems: 'center'}}>
//                                 <img className="fade-in-image" src={a.images.length == 1 ? a.images.map(s => s.url) : a.images.filter(s => s.height == 300).map(s => s.url)} alt={a.name} style={{height: '100px', width: '100px', marginRight: '50px'}}/>
//                                 <h3>{a.name}</h3>
//                                 {/* <button>{(a.tracks?.find((e)=>e.uri === current_track?.uri) === undefined ? "Add" : "Remove")}</button> */}
//                                 <input id={"checkbox" + i} type='checkbox'></input>
//                                 {open ? (()=>{
//                                     setTimeout(()=>{
//                                         a.tracks?.find((e)=>e.uri === current_track?.uri) === undefined ? null : document.getElementById(`checkbox${i}`).checked = true
//                                         submit1.push(document.getElementById(`checkbox${i}`).checked)
//                                     },300)
                                    
//                                 })() : null}
//                                 </div>    
//                             )}
//                             </div>                               
//                         </Modal>
//                     </div>

//                         <div className="main-wrapper">
//                             <a onClick={function handleClick() {
//                                 var parts = current_track.album.uri.split(':');
//                                 var lastSegment = parts.pop() || parts.pop();
                                
//                                 var artistss = []
//                                 var artist_idss = []
//                                 current_track.artists.map(s => { 
//                                     artistss.push(s.name),
//                                     artist_idss.push(s.uri.split(':').pop())
//                                 }
//                                 )

//                                 sessionStorage.setItem("uri", current_track.album.uri)
//                                 sessionStorage.setItem("artist", JSON.stringify(artistss))
//                                 sessionStorage.setItem("artist_id", JSON.stringify(artist_idss))
//                                 sessionStorage.setItem("image", current_track.album.images?.filter(s => s.height == 640).map(s => s.url))
//                                 // sessionStorage.setItem("name", current_track.album.name)
//                                 sessionStorage.setItem("albumname", current_track.album.name)
//                                 console.log(sessionStorage.getItem("name").length)

//                                 navigate(`/app/album/${lastSegment}`)
//                             }}>
//                             <img src={current_track.album.images[0]?.url} 
//                                 className="now-playing__cover" alt="" style={{marginRight: '14px'}} />
//                             </a>
                            

//                             <div className="now-playing__side">
//                                 <div className='scrollbar1'>
//                                 <div className="now-playing__name" style={{fontWeight: 'bold',margin: '0px', padding: '0px'}}><p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{
//                                     current_track.name
//                                     }</p>
//                                     <p className='temp' style={{margin: '0px', padding: '0px'}}>{current_track.name}</p>
//                                     {current_track.name ? <HScroll name={'scrollbar1'}/> : null}</div>
//                                 </div>
                                
//                                 <div className='scrollbar2'>
//                                     <div className="now-playing__artist" data-direction="right">
//                                         <p style={{margin: '0px', padding: '0px', gap: '1rem'}}>{current_track.artists.map((s,i,row) => <a onClick={function handleClick(){ 
//                                             navigate(`/app/artist/${s.uri.split(':').pop()}`)
//                                             }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
//                                         </p>
//                                         <p className='temp' style={{margin: '0px', padding: '0px'}}>{current_track.artists.map((s,i,row) => <a onClick={function handleClick(){ 
//                                             navigate(`/app/artist/${s.uri.split(':').pop()}`)
//                                             }} style={{color: 'rgb(90, 210, 216)'}}>{row.length - 1 !== i ? s.name + ", " : s.name}</a>)}
//                                         </p>
//                                         {current_track.name ? <HScroll name={'scrollbar2'} /> : null}
//                                     </div>
//                                 </div>
                                
//                             </div>
//                             { !is_active ? null : (
//                             <h2 id='addSong' style={{height: '35px', width: '35px', marginLeft: '15px', cursor: 'pointer', border: '2px solid white', borderRadius: '50%'}} onClick={function handleClick(){
//                                 let temp = document.getElementById('addSong')
//                                 temp.style.animation = 'hithere 1s ease'
//                                 setTimeout(()=>{
//                                     temp.style.removeProperty('animation')
//                                 }, 750)

//                                 var x = document.getElementById("snackbar");
//                                 x.className = "show";
//                                 setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);

                                
//                                 setLiked_songs({tracks: [{album_id: current_track.album.uri, images: current_track.album.images, artists: current_track.artists, duration_ms: duration, uri: current_track.uri, name: current_track.name}, ...liked_songs.tracks]})
//                                 var parts = current_track.album.uri.split(':');
//                                 var lastSegment = parts.pop() || parts.pop();
//                                 fetch(`http://localhost:8888/auth/update`, {
//                                     method: 'POST',
//                                     headers: {"Content-Type":"application/json"},
//                                     body: JSON.stringify({album_id: lastSegment, images: JSON.stringify(current_track.album.images), artists: JSON.stringify(current_track.artists), duration: duration, track_id: current_track.id, name: current_track.name})
//                                 })
//                             }}>{(liked_songs.tracks.find((e)=>e.uri === current_track.uri) === undefined ? "+" : "✓")}</h2>
//                         )}
                            
//                         </div>
                    
//                     <div className='buttonWrapper'>
//                     <img id='toggle1' src={repeated < 2 ? repeat : repeat1} style={{position: 'absolute', right: '250px', bottom: '12px', height: '20px', cursor: 'pointer', opacity: repeated === 0 ? '0.5' : 1}} onClick={function handleClick(){   
//                         let temp = document.getElementById('toggle1')
//                         temp.style.animation = 'hithere 1s ease'  

//                         if (repeated === 0) setRepeated(1)
//                         else if (repeated === 1) setRepeated(2)
//                         else if (repeated === 2) setRepeated(0)
//                         console.log(repeated)                
//                         fetch(`http://localhost:8888/auth/shuffle`, {
//                             method: 'POST',
//                             headers: {"Content-Type":"application/json"},
//                             body: JSON.stringify({state: repeated === 0 ? 'context' : (repeated === 1 ? 'track' : 'off')})
//                         })

//                         setTimeout(()=>{
//                             temp.style.removeProperty('animation')
//                         }, 750)

//                         }} />

//                         { !is_active ? null : ( is_paused ? null : (
//                             <div className="now_playing" id="music">
//                             <span className="bar n1">A</span>
//                             <span className="bar n2">B</span>
//                             <span className="bar n3">c</span>
//                             <span className="bar n4">D</span>
//                             <span className="bar n5">E</span>
//                             <span className="bar n6">F</span>
//                             <span className="bar n7">G</span>
//                             <span className="bar n8">H</span>
//                             </div>
//                         ))}

//                     <button className="btn-spotify" onClick={() => { pos > 3000 ? player.seek(0) : player.previousTrack() }} >
//                         &lt;&lt;
//                     </button>

//                     <button className="btn-spotify" style={{maxWidth: '85px', minWidth: '85px'}} onClick={() => { player.togglePlay(), saved(current_track.uri,liked_songs,playlists) }} >
//                         { is_paused ? "PLAY" : "PAUSE" }
//                     </button>

//                     <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
//                         &gt;&gt;
//                     </button>

//                     <img id='toggle2' src={shuffle} style={{position: 'absolute', left: '240px', bottom: '12px', height: '19px', cursor: 'pointer', opacity: shuffled ? '0.5' : '1'}} onClick={function handleClick(){     

//                         let temp = document.getElementById('toggle2')
//                         temp.style.animation = 'hithere 1s ease'

//                         if (shuffled === true) setisShuffled(false)
//                         else setisShuffled(true)                
//                         fetch(`http://localhost:8888/auth/shuffle`, {
//                             method: 'POST',
//                             headers: {"Content-Type":"application/json"},
//                             body: JSON.stringify({state: shuffled})
//                         })
//                         setTimeout(()=>{
//                             temp.style.removeProperty('animation')
//                         }, 750)
                        
                        
//                     }} />            

//                     <input id='seeker' type='range' min="0" max={duration} value={(()=>{
                        
                        
//                         window.setInterval(()=>{
//                             player?.getCurrentState().then(state => {
//                                 document.getElementById('seeker').value = state?.position
//                             })
//                         },500)
                        
                        
//                     })()} onChange={function handleChange(e){ 
//                         setPos(e.target.value)
//                         player.seek(e.target.value)
//                     }} style={{position: 'absolute', left: '300px', bottom: '12px', width: '500px'}} /> 

//                     </div>
                    
                    
//                 </div>

//             </>
//         )}
            
//         </>
//     )
// })
// export default WebPlayback
import { useGetAlbumsQuery, useGetPlaylistsQuery, useGetLikedQuery } from "../../ApiSlice";
import { useEffect } from "react";

export default function WebPlayback(){
    useEffect(() => {
        const user = sessionStorage.getItem("username")
            if (!user){
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
            const fetchBaby = async () => {
                const tempUsers = await fetchUsers()
                sessionStorage.setItem("username", tempUsers.display_name)
            }
            fetchBaby()
        }
    })
    
    // const {
    //     data: albums = [],
    //     isSuccess
    // } = useGetAlbumsQuery()

    const {
        data: playlists = [],
        isSuccess
    } = useGetPlaylistsQuery()
    // const {
    //     data: liked = [],
    //     isSuccess
    // } = useGetLikedQuery()
    
    if (isSuccess) console.log(playlists)
    return(
        <>
        </>
    )
}