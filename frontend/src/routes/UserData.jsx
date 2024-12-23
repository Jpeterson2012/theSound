//USE SESSION STORAGE TO PERSIST DATA BETWEEN RENDERS!!!!!!!!!!!!

import { useState,useEffect } from 'react'
import WebPlayback from '../components/WebPlayback/WebPlayback.jsx'
import Loading from '../components/Loading/Loading.jsx'


export default function UserData() {    

    const [users, setUsers] = useState("")
    const [isLoading, setIsLoading] = useState(true)
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
                setPlaylists({...a, tracks: [track, ...a.tracks]})
                // return {...a, tracks: [track, ...a.tracks]}
            }
            // else
            //     return a
        })
        console.log(temp)
        // setPlaylists(temp)
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
        const playlist = sessionStorage.getItem("playlists")
        const liked = sessionStorage.getItem("liked")
            if (user){
                setUsers(user);
                setAlbums(JSON.parse(album))
                setPlaylists(JSON.parse(playlist))
                setLiked_songs(JSON.parse(liked))
                setIsLoading(false)
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
                    // var temp = await fetch("http://localhost:8888/auth/homepage2/albums")
                .then((res) => {
                    return res.json();
                }).then((data) => {return data})
                    return temp
                }
                catch (err) {}
                }
                
                const fetchBoth = async () => {
                // setIsLoading(true)
                const tempUsers = await fetchUsers();
                const tempAlbums = await fetchAlbums();
                setIsLoading(false)
                console.log("done")
                // console.log(tempAlbums)
                setUsers(tempUsers.display_name)
                setAlbums(tempAlbums.items)
                setPlaylists(tempAlbums.items2)
                setLiked_songs(tempAlbums.items3)
                sessionStorage.setItem("username", tempUsers.display_name)
                sessionStorage.setItem("albums", JSON.stringify(tempAlbums.items))
                sessionStorage.setItem("playlists", JSON.stringify(tempAlbums.items2))
                sessionStorage.setItem("liked", JSON.stringify(tempAlbums.items3))
                // localStorage.setItem("albums", JSON.stringify(tempAlbums))
                }
                fetchBoth()
            }
    }, []);

    return (
        <>
            {isLoading ? <Loading yes={true} /> : (
                (<WebPlayback users={users} albums={albums} playlists={playlists} liked_songs={liked_songs} passAlbum={passAlbum} passPlaylist={passPlaylist} passLiked={passLiked} setLiked_songs={setLiked_songs} />)
            )}        
        </>
        
    )

}


