//sessionstorage items created: cusername, albums, playlist_name

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css'
import Card from "../components/Card/Card.tsx";
// import Local from "../components/Local/Local.jsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import { useGetAlbumsQuery, useGetPlaylistsQuery } from "../ApiSlice.ts"; 

function Albums(listItems: any){
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
// function albumSort(albums: any, set_albums: any, setSorted: any){
//   return(
//     <>
//     <button className="theme" onClick={function handleClick(){
//       let temp = [...albums]
//       temp.sort((a,b) => a.name.localeCompare(b.name))
//       set_albums(temp)
//       setSorted(true)
//     }}>A-Z</button>

//     <button className="theme" onClick={function handleClick(){
//       let temp = [...albums]
//       temp.sort((a,b) => b.name.localeCompare(a.name))
//       set_albums(temp)
//       setSorted(true)
//     }}>Z-A</button>

//     <button className="theme" onClick={function handleClick(){
//       let temp = [...albums]
//       temp.sort((a,b) => a.artists[0]?.name.localeCompare(b.artists[0]?.name))
//       set_albums(temp)
//       setSorted(true)
//     }}>Artist A-Z</button>

//     <button className="theme" onClick={function handleClick(){
//       let temp = [...albums]
//       temp.sort((a,b) => b.artists[0]?.name.localeCompare(a.artists[0]?.name))
//       set_albums(temp)
//       setSorted(true)
//     }}>Artist Z-A</button>
//     </>
//   )
// }
function Playlists(navigate: any, listPlaylists: any){
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
// function playlistSort(playlists: any, set_playlists: any, setSorted: any){
//   return(
//     <>
//       <button className="theme" onClick={function handleClick(){
//       let temp = [...playlists]
//       temp.sort((a,b) => a.name.localeCompare(b.name))
//       set_playlists(temp)
//       setSorted(true)
//     }}>A-Z</button>

//     <button className="theme" onClick={function handleClick(){
//       let temp = [...playlists]
//       temp.sort((a,b) => b.name.localeCompare(a.name))
//       set_playlists(temp)
//       setSorted(true)
//     }}>Z-A</button>
//     </>
//   )
// }
function Podcasts(){
  return(
    <h4>Hello there</h4>
  )
}
// function localSong(){
//   return(
//     <Local />
//   )
// }

export default function Home() {
    const navigate = useNavigate()
    const [html, setHtml] = useState<any>(null)
    const [sorted, setSorted] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        data: albums = [],
        isSuccess
        } = useGetAlbumsQuery()

        const {
        data: playlists = [],
    } = useGetPlaylistsQuery()

    useEffect(() => {
      setSorted(false)
      
      // let temp = sessionStorage.getItem('home')
      // if (temp === 'playlist') setHtml(Playlists(navigate,listPlaylists))
      // if (temp === 'podcast') setHtml(Podcasts())
      // if (temp === 'local') setHtml(localSong())
      setLoading(true)
      switch(sessionStorage.getItem('home')){
        case 'album':
          setHtml(Albums(listItems))
          break
        case 'playlist':
          setHtml(Playlists(navigate,listPlaylists))
          break
        case 'podcast':
          setHtml(Podcasts())
          break
        // case 'local':
        //   setHtml(localSong())
        //   break
        default:
          setHtml(Albums(listItems))
      }
      setLoading(false)

    
  }, [isSuccess]);
  const listItems = albums?.map((a: any) => 
    <Card
      // key={a.id}
      id={a.album_id}
      uri={a.uri}
      image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
      name={a.name}
      artist={a.artists.map((t: any) => t.name)}
      a_id={a.artists.map((t: any) => t.id)}
    />
  )
  const listPlaylists = playlists?.map((a: any) =>
    <>

      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", a.name)
        navigate(`/app/playlist/${a.playlist_id}`)
      }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
        <img className="fade-in-image" src={a.images.length == 1 ? a.images.map((s: any) => s.url) : a.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} alt={a.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>{a.name}</h2>
        </div>
      
      <br></br>
      </a>
      
    </>
  )
  return (
    <>
      {!isSuccess ? <Loading2 yes={true} /> : (<>
      <div className="homeContainer">
        <button className="homeButtons" onClick={() => {setHtml(Albums(listItems)),sessionStorage.setItem('home','album')}}>Albums</button>
        <button className="homeButtons" onClick={() => {setHtml(Playlists(navigate, listPlaylists)), sessionStorage.setItem('home','playlist')}}>Playlists</button>
        <button className="homeButtons" onClick={() => {setHtml(Podcasts()), sessionStorage.setItem('home', 'podcast') }}>Podcasts</button>
        {/* <button className="homeButtons" onClick={() => {setHtml(localSong()), sessionStorage.setItem('home', 'local') }}>Local</button> */}
        {/* <div className="dropdown" id="dropdown">
          <button className="dropbtn">Sort</button>
          <div className="dropdown-content">
            {(sessionStorage.getItem('home') === null || sessionStorage.getItem('home') === 'album') && albumSort(albums, set_albums, setSorted)}
            {sessionStorage.getItem('home') === 'playlist' && playlistSort(playlists, set_playlists, setSorted)}
          </div>
        </div> */}
        
      </div>
      
      {html}
      </>
    )}
    </>
  )
}