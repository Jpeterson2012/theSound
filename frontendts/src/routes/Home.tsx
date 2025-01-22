//sessionstorage items created: cusername, albums, playlist_name, sortVal, psortVal

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css'
import Card from "../components/Card/Card.tsx";
// import Local from "../components/Local/Local.jsx";
import Loading2 from "../components/Loading2/Loading2.tsx";
import { useGetAlbumsQuery, useGetPlaylistsQuery, useGetAudiobooksQuery, useGetPodcastsQuery } from "../ApiSlice.ts"; 


function Albums(listItems: any){
  return(
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingTop: '15px',width: '90vw',position: 'absolute', left: '5vw', top: '16vw'
    }}>
      {listItems}
    </div>
  )
}
function albumSort(setSorted: any){
  return(
    <>
    <button className="theme" onClick={function handleClick(){
      setSorted(1)
      sessionStorage.setItem('sortVal','1')
    }}>A-Z</button>

    <button className="theme" onClick={function handleClick(){      
      setSorted(2)
      sessionStorage.setItem('sortVal','2')
    }}>Z-A</button>

    <button className="theme" onClick={function handleClick(){      
      setSorted(3)
      sessionStorage.setItem('sortVal','3')
    }}>Artist A-Z</button>

    <button className="theme" onClick={function handleClick(){      
      setSorted(4)
      sessionStorage.setItem('sortVal','4')
    }}>Artist Z-A</button>
    </>
  )
}
function Playlists(navigate: any, listPlaylists: any){
  return(
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      paddingTop: '5vw',
      marginBottom: '90px'
    }}>
      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", "Liked Songs")
        sessionStorage.setItem("uplist", "true")
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
function playlistSort(setPSorted: any){
  return(
    <>
      <button className="theme" onClick={function handleClick(){      
      setPSorted(1)
      sessionStorage.setItem('psortVal','1')
    }}>A-Z</button>

    <button className="theme" onClick={function handleClick(){      
      setPSorted(2)
      sessionStorage.setItem('psortVal','2')
    }}>Z-A</button>
    </>
  )
}
function Podcasts(podcasts:any){
  const listItems = podcasts?.items.map((a:any) =>
    <a onClick={function handleClick(){
      var url =`https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
      const headers = {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + sessionStorage.getItem("token")
      }
      
      fetch(url, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({context_uri: a.show.uri})
      })
    }}>
      <div style={{display: 'flex', alignItems: 'center'}}>
      < img className="fade-in-image" src={a.show.images.length == 1 ? a.show.images.map((s: any) => s.url) : a.show.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} alt={a.show.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>{a.show.name}</h2>
      </div>
      </a>
      )
  
  return(
    <div style={{marginTop: '10vw'}}>
      {listItems}
    </div>
    
  )
}
function Audiobooks(audiobooks:any){
  const listItems = audiobooks?.items.map((a:any) =>
      <a onClick={function handleClick(){
        var url =`https://api.spotify.com/v1/me/player/play?device_id=${sessionStorage.getItem("device_id")}`
        const headers = {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + sessionStorage.getItem("token")
        }
        
        fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({context_uri: a.uri})
        })
      }}>
      <div style={{display: 'flex', alignItems: 'center'}}>
      < img className="fade-in-image" src={a.images.length == 1 ? a.images.map((s: any) => s.url) : a.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} alt={a.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>
        <h2>{a.name}</h2>
      </div>
      </a>
      )
  
  return(
    <div style={{marginTop: '10vw'}}>
      {listItems}
    </div>
    
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
    const [sorted, setSorted] = useState(0)
    const [psorted, setPSorted] = useState(0)
    const [loading, setLoading] = useState(false)

    
      
    const {data: albums = [],isSuccess} = useGetAlbumsQuery()
    const {data: podcasts} = useGetPodcastsQuery()
    const {data: audiobooks} = useGetAudiobooksQuery()
    

    const sortedAlbums = (() => {
      const sortedAlbums = albums.slice()
      switch(sorted){
        case 0:
          return sortedAlbums
        case 1:
          sortedAlbums.sort((a,b) => a.name.localeCompare(b.name))
          return sortedAlbums
        case 2:
          sortedAlbums.sort((a,b) => b.name.localeCompare(a.name))
          return sortedAlbums
        case 3:
          sortedAlbums.sort((a,b) => a.artists[0].name.localeCompare(b.artists[0].name))
          return sortedAlbums
        case 4:
          sortedAlbums.sort((a,b) => b.artists[0].name.localeCompare(a.artists[0].name))
          return sortedAlbums
        default:
          return sortedAlbums
      }      
    })

    const {data: playlists = []} = useGetPlaylistsQuery()

    const sortedPlaylists = (() => {
      const sortedPlaylists = playlists.slice()
      switch(psorted){
        case 0:          
          return sortedPlaylists
        case 1:
          sortedPlaylists.sort((a,b) => a.name.localeCompare(b.name))
          return sortedPlaylists
        case 2:
          sortedPlaylists.sort((a,b) => b.name.localeCompare(a.name))
          return sortedPlaylists
        default:
          return sortedPlaylists
      }
    })

    useEffect(() => {      
      sessionStorage.getItem('sortVal') && setSorted(+sessionStorage.getItem('sortVal')!)
      sessionStorage.getItem('psortVal') && setPSorted(+sessionStorage.getItem('psortVal')!)
      
      setLoading(true)
      switch(sessionStorage.getItem('home')){
        case 'album':
          setHtml(Albums(listItems))
          break
        case 'playlist':
          setHtml(Playlists(navigate,listPlaylists))
          break
        case 'podcast':
          setHtml(Podcasts(podcasts))
          break
        case 'audiobook':
          setHtml(Audiobooks(audiobooks))
          break
        // case 'local':
        //   setHtml(localSong())
        //   break
        default:
          setHtml(Albums(listItems))
      }
      setLoading(false)
      
      

    
  }, [isSuccess,sorted, psorted]);
    
  const listItems = sortedAlbums()?.map((a: any) => 
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

  

  const listPlaylists = sortedPlaylists()?.map((a: any) =>
    <>

      <a onClick={function handleClick() {
        sessionStorage.setItem("uplist", "true")
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
          <div style={{position: 'absolute', top: '10vw', right: '40vw'}}>
            <button className="homeButtons" onClick={() => {setHtml(Albums(listItems)),sessionStorage.setItem('home','album')}}>Albums</button>
            <button className="homeButtons" onClick={() => {setHtml(Playlists(navigate, listPlaylists)), sessionStorage.setItem('home','playlist')}}>Playlists</button>
            <button className="homeButtons" onClick={() => {setHtml(Podcasts(podcasts)), sessionStorage.setItem('home', 'podcast') }}>Podcasts</button>
            <button className="homeButtons" onClick={() => {setHtml(Audiobooks(audiobooks)), sessionStorage.setItem('home', 'audiobook') }}>AudioBooks</button>
        
            {/* <button className="homeButtons" onClick={() => {setHtml(localSong()), sessionStorage.setItem('home', 'local') }}>Local</button> */}
            <div className="dropdown" id="dropdown">
              <button className="dropbtn">Sort</button>
              <div className="dropdown-content">
                {(sessionStorage.getItem('home') === null || sessionStorage.getItem('home') === 'album') && albumSort(setSorted)}
                {sessionStorage.getItem('home') === 'playlist' && playlistSort(setPSorted)}
              </div>
            </div>

          </div>
        
      </div>
          
        {html}      
      
      </>
    )}
    </>
  )
}