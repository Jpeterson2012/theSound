import { useState,useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from '../../routes/Home';
import Album from '../../routes/Album';
import Playlist from '../../routes/Playlist.jsx';
import Artist from '../../routes/Artist.jsx';
import Loading from '../Loading/Loading.jsx';
import Discover from '../../routes/Discover.jsx';
import Categories from '../../routes/Categories.jsx';

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

export default function UserData( {is_paused, is_active} ) {    

    const [users, setUsers] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [albums, setAlbums] = useState([])
    function passAlbum(temp){
        setAlbums(temp)
    }

    const [playlists, setPlaylists] = useState([])
    function passPlaylist(index,track){
        setTimeout(()=>{

        
        var temp = playlists.map((a,i) => {
            if (i === index) {
                console.log("track added to " + a.name)
                
                return {...a, tracks: [track, ...a.tracks]}
            }
            else
                return a
        })
        console.log(temp)
        setPlaylists(temp)
        console.log(playlists)
    },1000)
    }

    const [liked_songs, setLiked_songs] = useState([])
    function passLiked(temp){
        setLiked_songs(temp)
    }

    useEffect(() => {
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
    }, []);

    return (
        <>
            {isLoading ? <Loading yes={true}/> : (
                <>
                    <Routes>
                        <Route path = '/' element={<Home albums={albums} set_albums={passAlbum} playlists={playlists} set_playlists={passPlaylist}/>}/>
                        <Route path='/discover' element={<Discover />} />
                        <Route path='/categories/:id' element={<Categories />} />
                        <Route path='/album/:id' element={<Album SpinComponent={Spin} active={is_active}  paused={is_paused}/>}/>
                        <Route path='/playlist/:id' element={<Playlist plists={playlists} liked={liked_songs} set_liked={passLiked} SpinComponent={Spin} active={is_active}  paused={is_paused}/>} />
                        <Route path='/artist/:id' element={<Artist paused={is_paused} />} />
                    </Routes>
                </>
            )}
        </>
    )

}


