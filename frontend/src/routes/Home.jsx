//sessionstorage items created: cusername, albums, playlist_name

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css'
import Card from "../components/Card/Card.jsx";

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
function Playlists(listPlaylists){
  return(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '15px',
      marginBottom: '90px'
    }}>
    <h4>Hi</h4>
    {listPlaylists}
    </div>
  )
}
function Podcasts(){
  return(
    <h4>Hello there</h4>
  )
}

export default function Home( {albums} ) {
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
    
  }, []);
  const listItems = albums.items?.map(a => 
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
  const listPlaylists = albums.items2?.map(a =>
    <>

      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", a.name)
        navigate(`/app/playlist/${a.playlist_id}`)
      }}>
      <img src={a.images.map(s => s.url)} alt={a.name} style={{height: '300px', width: '300px'}}/>
      <br></br>
      </a>
      
    </>
  )
  return (
    <>
      <div style={{marginTop: '70px'}}>
        <button onClick={() => setHtml(Albums(listItems))}>Albums</button>
        <button onClick={() => setHtml(Playlists(listPlaylists))}>Playlists</button>
        <button onClick={() => setHtml(Podcasts())}>Podcasts</button>
      </div>
      
      {html ? html : Albums(listItems)}
    </>
  )
}