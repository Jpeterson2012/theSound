//sessionstorage items created: cusername, albums, playlist_name

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css'
import Card from "../components/Card/Card.jsx";
import Local from "../components/Local/Local.jsx";

function Albums(listItems){
  return(
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingTop: '15px',
    }}>
      {listItems}
    </div>
  )
}
function Playlists(navigate, listPlaylists){
  return(
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      paddingTop: '15px',
      marginBottom: '90px'
    }}>
      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", "Liked Songs")
        navigate('/app/playlist/likedsongs')
      }}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>Liked Songs</h2>
      </div>
      </a>
    {listPlaylists}
    </div>
  )
}
function Podcasts(){
  return(
    <h4>Hello there</h4>
  )
}
function localSong(){
  return(
    <Local />
  )
}

export default function Home( {albums, set_albums, playlists} ) {
  const navigate = useNavigate()

    // const [albums, setAlbums] = useState([]);
    // const [users, setUsers] = useState("")
    const [html, setHtml] = useState(null)

    useEffect(() => {
      // sessionStorage.setItem("loggedIn", true)
      // //Get UserName
      // const user = sessionStorage.getItem("username")
      // const album = sessionStorage.getItem("albums")
      // if (user && album){
      //   setUsers(user);
      //   setAlbums(JSON.parse(album))
      // }
      // else{
      //   const fetchUsers = async () => {
      //     try {
      //       var temp = await fetch("http://localhost:8888/auth/users")
      //     .then((res) => {
      //       return res.json();
      //     })
      //       return temp
      //     }
      //     catch (err) {}
      //   }
      //   const fetchAlbums = async () => {
      //     try {
      //       var temp = await fetch("http://localhost:8888/auth/homepage")
      //     .then((res) => {
      //       return res.json();
      //     }).then((data) => {return data})
      //       return temp
      //     }
      //     catch (err) {}
      //   }
        
      //   const fetchBoth = async () => {
      //     setIsLoading(true)
      //     const tempUsers = await fetchUsers();
      //     const tempAlbums = await fetchAlbums();
      //     setIsLoading(false)
          
      //     console.log(tempAlbums)
      //     setUsers(tempUsers.display_name)
      //     setAlbums(tempAlbums)
      //     sessionStorage.setItem("username", tempUsers.display_name)
      //     sessionStorage.setItem("albums", JSON.stringify(tempAlbums))
      //   }
      //   fetchBoth()
      // }
      let temp = sessionStorage.getItem('home')
      if (temp === 'playlist') setHtml(Playlists(navigate,listPlaylists))
      if (temp === 'podcast') setHtml(Podcasts())
      if (temp === 'local') setHtml(localSong())

    
  }, []);
  const listItems = albums?.map(a => 
    <Card
      // key={a.id}
      id={a.album_id}
      uri={a.uri}
      image={a.images.filter(t=>t.height == 300).map(s => s.url)}
      name={a.name}
      artist={a.artists.map(t => t.name)}
      a_id={a.artists.map(t => t.id)}
    />
  )
  const listPlaylists = playlists?.map(a =>
    <>

      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", a.name)
        navigate(`/app/playlist/${a.playlist_id}`)
      }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
        <img className="fade-in-image" src={a.images.length == 1 ? a.images.map(s => s.url) : a.images.filter(s => s.height == 300).map(s => s.url)} alt={a.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>{a.name}</h2>
        </div>
      
      <br></br>
      </a>
      
    </>
  )
  return (
    <>
      <div style={{marginTop: '170px'}}>
        <button onClick={() => {setHtml(Albums(listItems)),sessionStorage.setItem('home','album')}}>Albums</button>
        <button onClick={() => {setHtml(Playlists(navigate, listPlaylists)), sessionStorage.setItem('home','playlist'),console.log(sessionStorage.getItem('home'))}}>Playlists</button>
        <button onClick={() => {setHtml(Podcasts()), sessionStorage.setItem('home', 'podcast') }}>Podcasts</button>
        <button onClick={() => {setHtml(localSong()), sessionStorage.setItem('home', 'local') }}>Local</button>
        <span onClick={function handleClick(){
          let temp = [...albums]
          temp.sort((a,b) => a.name.localeCompare(b.name))
          set_albums(temp)
          // console.log(albums)
          setHtml(null)
          // setHtml(Albums(listItems))
          
        }}>Sort</span>
      </div>
      
      {html ? html : Albums(listItems)}
    </>
  )
}