import logo from '../../images/logo.png'
import './Logo.css'
import { useNavigate } from 'react-router-dom'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useState, useEffect } from 'react';
import Track from '../Track/Track';
import escape from '../../images/escape.jpg'
import search from '../../images/search.png'
import space from '../../images/music.gif'
import { useGetUserQuery,useGetAlbumsQuery } from '../../App/ApiSlice';

function getTracks(ptracks: any) {
    var key = 0
    return (
      ptracks.map((t:any) =>
  
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center'}}>
            
            <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px', width: '64px'}}/>
            <Track 
            uri={t.url}
            name={t.name}
            number={t.track_number}
            duration={t.duration_ms}
            album_name={t.album_name}
            artist={t.artists}
            />
          <p hidden>{key++}</p>
        </div>
      )
    )
  }
  function getAlbums(albumss: any,palbums: any, nav: any, close: any) {
    var artists: any = []
    var a_ids: any = []
    
    return (
      palbums.map((t:any) =>
        <a onClick={function handleClick() {
          
          //Check if album is already in library or not
          let found = albumss?.find((e: any) => e?.album_id === t.id)
          found === undefined ? sessionStorage.setItem("albumStatus", "notuser") : sessionStorage.setItem("albumStatus","user")

            t.artists.map((s:any) => artists.push(s.name))
            t.artists.map((s:any) => a_ids.push(s.id))
            sessionStorage.setItem("artist", JSON.stringify(artists))
            sessionStorage.setItem("artist_id", JSON.stringify(a_ids))
            sessionStorage.setItem("image", t.images.filter((t:any) => t.height == 300).map((s:any) => s.url))
            nav(`/app/album/${t.id}`)
            close()
        }}>
            <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold'}}>
                <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px'}}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <div>{t.name}</div>
                <div>{t.artists.map((a:any) => a.name + " ")}</div>
                </div>
                
            </div>
        </a>
      )
      
    )
  }
  function getArtists(partists: any, nav: any, close: any){
    return (
      partists.map((a:any) => 
        <a onClick={function handleClick() {
          nav(`/app/artist/${a.id}`)
          close()
        }}>
      <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold'}}>
      {/* <img src={a.images?.length == 1 ? a.images?.map(s => s.url) : a.images?.filter(s => s.height == 160).map(s => s.url)} alt={a.name} style={{height: '64px', width: '64px'}}/> */}
      <img src={a.images?.length == 0 ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' : a.images[2]?.url} alt={a.name} style={{height: '64px', width: '64px'}} />
        {a.name}
        </div>
        </a>
      )
    )
  }
  function getPlaylists(plists: any, nav: any, close: any){
    return (
      plists.map((a:any) => 
      <>

      <a onClick={function handleClick() {
        sessionStorage.setItem("uplist", "false")
        sessionStorage.setItem("playlist_name", a.name)
        sessionStorage.setItem("p_image", a.images.length == 1 ? a.images.map((s:any) => s.url) : a.images.filter((s:any) => s.height == 60).map((s:any) => s.url))
        nav(`/app/playlist/${a.id}`)
        close()
      }}>
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold'}}>
        <img src={a.images?.length == 1 ? a.images?.map((s:any) => s.url) : a.images?.filter((s:any) => s.height == 60).map((s:any) => s.url)} alt={a.name} style={{height: '64px', width: '64px'}}/>
        {a.name}
        </div>
      
      <br></br>
      </a>
      
    </>
      )
    )
  }

let counter = 0

export default function Logo () {
    const navigate = useNavigate()

    const [html, setHtml] = useState<any>(null)
    const [tracks, setTracks] = useState<any>([]);
    const [albums, setAlbums] = useState<any>([]);
    const [plist, setPlist] = useState<any>([]);
    const [artist, setArtist] = useState<any>([])
    const {data: albumss = []} = useGetAlbumsQuery()

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => {setOpen(false); setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0};

    const fetchSearch = async () => {

      try {
        var temp = await fetch(`http://localhost:8888/auth/search/${(document.getElementById("searchTerm") as HTMLInputElement).value},${counter}`)
      .then((res) => {
        // console.log(res.json())
        return res.json();
      }).then((data) => {
        if (counter !== 0){
        setTracks([...tracks,...data.tracks])
        setAlbums([...albums,...data.albums])
        setArtist([...artist,...data.artists])
        setPlist([...plist,...data.playlists])
        }
        else{
          setTracks([...data.tracks])
          setAlbums([...data.albums])
          setArtist([...data.artists])
          setPlist([...data.playlists])
        }
      })
        return temp
      }
      catch (err) {console.log(err)}
    }
    
    const closeIcon = (
        <img src={escape} style={{height: '44px', width: '44px'}}/>
      );
    const {
            data: user,
            isSuccess
            } = useGetUserQuery()
    
    useEffect(() => {
      switch(sessionStorage.getItem('searchHome')){
        case 'tracks':
          setHtml(getTracks(tracks))
          break
        case 'albums':
          setHtml(getAlbums(albumss,albums, navigate, onCloseModal))
          break
        case 'artists':
          setHtml(getArtists(artist, navigate, onCloseModal))
          break
        case 'playlists':
          setHtml(getPlaylists(plist, navigate, onCloseModal))
          break
        // case 'local':
        //   setHtml(localSong())
        //   break
        default:
          setHtml(getTracks(tracks))
      }
    }, [tracks])

    return(
        <>
          {!isSuccess ? null :
          <div className='mainLogo'>
              <h2 className='userName'>{isSuccess ? user!.items : 'hi'}</h2>

              <h2 style={{position: 'absolute', left: '25vw', fontSize: '30px', cursor: 'pointer'}} onClick={function handleClick(){
                if (window.history?.length && window.history.length > 1) navigate(-1)
                else navigate('/app/', {replace: true})
              }}>{"<"}</h2>

              <img className='searchimg' src={search} onClick={function handleClick(){onOpenModal()}} />

              <h2 style={{position: 'absolute', right: '30vw', fontSize: '30px', cursor: 'pointer'}} onClick={function handleClick(){
                if (window.history?.length && window.history.length > 1) navigate(1)
                  else navigate('/app/', {replace: true})
              }}>{">"}</h2>

              <a onClick={function handleClick() {navigate('/app/discover')}}>
                  <h2 style={{position: 'relative', right: '5vw'}} >Discover</h2>
              </a>
              <a onClick={function handleClick() {navigate('/app')}}>
                  <img style={{width: '80px', height: '80px'}} src={logo} alt="Avatar"/>
              </a>



              <div>

                  <Modal modalId='modal3' open={open} onClose={onCloseModal} center closeIcon={closeIcon}>

                  <div className="wrap">
                  <div className="search">
                      <input type="text" className="searchTerm" id='searchTerm'  placeholder="What are you looking for?" />
                      <button type="button" className="searchButton" onClick={function handleSubmit(){

                        setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0;

                        console.log((document.getElementById("searchTerm") as HTMLInputElement).value);
                        let t = document.getElementById('modalbuttons')!
                        t.style.display = 'flex'
                        t.style.animation = 'fadeIn 0.5s'

                        fetchSearch()
                         return false
                      }}><i className="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}} ></i></button>
                      </div>
                      </div>
                      <img src={space} style={{zIndex: '0', width: '100%', height: '180px', position: 'absolute', top: '0', opacity: '0.3', objectFit: 'cover', objectPosition: '20% 50%'}} />


                      <div id='modalbuttons' style={{display: 'none', justifyContent: 'center', zIndex: '9', position: 'relative', marginTop: '8vw'}}>
                          <button onClick={() => {setHtml(getTracks(tracks)), sessionStorage.setItem('searchHome', 'tracks')}}>Tracks</button>
                          <button onClick={() => {setHtml(getAlbums(albumss,albums, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'albums')}}>Albums</button>
                          <button onClick={() => {setHtml(getArtists(artist, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'artists')}}>Artists</button>
                          <button onClick={() => {setHtml(getPlaylists(plist, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'playlists')}}>Playlists</button>
                      </div>

                      <div style={{maxWidth: '55vw', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', marginTop: '40px'}}>{html ? html : getTracks(tracks)}</div>


                      {tracks.length > 0 ? <button onClick={function handleSubmit(){
                        counter += 10
                        fetchSearch()
                      }} style={{marginLeft: 'auto', marginRight: 'auto'}} >Load More</button> : null}
                  </Modal>
              </div>
          </div>
          }
        </>
    )
}


