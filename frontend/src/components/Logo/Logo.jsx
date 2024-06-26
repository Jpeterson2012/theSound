import logo from '../../images/logo.png'
import './Logo.css'
import { useNavigate } from 'react-router-dom'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useState, useEffect } from 'react';
import Track from '../Track/Track';
import escape from '../../images/escape.jpg'
import search from '../../images/search.png'
import space from '../../images/space.gif'

function getTracks(ptracks) {
    var key = 0
    return (
      ptracks.map(t =>
  
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center'}}>
            
            <img src={t.images.filter(t=>t.height == 64).map(s => s.url)} style={{height: '64px', width: '64px'}}/>
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
  function getAlbums(palbums, nav, close) {
    var artists = []
    var a_ids = []
    return (
      palbums.map(t =>
        <a onClick={function handleClick() {
            t.artists.map(s => artists.push(s.name))
            t.artists.map(s => a_ids.push(s.id))
            sessionStorage.setItem("artist", JSON.stringify(artists))
            sessionStorage.setItem("artist_id", JSON.stringify(a_ids))
            sessionStorage.setItem("image", t.images.filter(t=>t.height == 300).map(s => s.url))
            nav(`/app/album/${t.id}`)
            close()
        }}>
            <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold'}}>
                <img src={t.images.filter(t=>t.height == 64).map(s => s.url)} style={{height: '64px'}}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <div>{t.name}</div>
                <div>{t.artists.map(a => a.name + " ")}</div>
                </div>
                
            </div>
        </a>
      )
      
    )
  }
  function getArtists(partists, nav, close){
    return (
      partists.map(a => 
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
  function getPlaylists(plists, nav, close){
    return (
      plists.map(a => 
      <>

      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", a.name)
        sessionStorage.setItem("p_image", a.images.length == 1 ? a.images.map(s => s.url) : a.images.filter(s => s.height == 60).map(s => s.url))
        nav(`/app/playlist/${a.id}`)
        close()
      }}>
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold'}}>
        <img src={a.images?.length == 1 ? a.images?.map(s => s.url) : a.images?.filter(s => s.height == 60).map(s => s.url)} alt={a.name} style={{height: '64px', width: '64px'}}/>
        {a.name}
        </div>
      
      <br></br>
      </a>
      
    </>
      )
    )
  }

export default function Logo () {
    const navigate = useNavigate()

    const [html, setHtml] = useState(null)
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [plist, setPlist] = useState([]);
    const [artist, setArtist] = useState([])

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => {setOpen(false); setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([])};
    
    const closeIcon = (
        <img src={escape} style={{height: '64px', width: '64px'}}/>
      );

    useEffect(() => {

    }, [tracks])

    return(
        <div style={{display: 'flex', position: 'absolute', right: '140px', top: '30px', alignItems: 'center'}}>
            <h2 style={{marginRight: '57vw'}}>{sessionStorage.getItem("username")}</h2>
            <img src={search} style={{cursor: 'pointer', width: '70px', height: '70px', position: 'absolute', left: '35vw'}} onClick={function handleClick(){onOpenModal()}} />


            {/* <div className="wrap">
                <div className="search">
                    <input type="text" className="searchTerm" id='searchTerm'  placeholder="What are you looking for?" />
                    <button type="button" className="searchButton" onClick={function handleSubmit() {
                        
                        onOpenModal();
                        // console.log(document.getElementById("searchTerm").value);
                        const fetchSearch = async () => {
                            const resp = await fetch(`http://localhost:8888/auth/search/${document.getElementById("searchTerm").value}`)
                            // const data = await resp.json()
                            let reader = resp.body.getReader()
                            let result
                            let temp
                            let temp2
                            let t_arr = []
                            let al_arr = []
                            let ar_arr = []
                            let p_arr = []
                            let decoder = new TextDecoder('utf8')
                            while(!result?.done){
                                result = await reader.read()
                                let chunk = decoder.decode(result.value)
                                // console.log(chunk ? JSON.parse(chunk) : {})
                                chunk ? (
                                    temp = JSON.parse(chunk),
                                    temp2 = temp.tracks,
                                    t_arr.push(...temp2),  
                                    setTracks([...t_arr]),
                                    temp2 = temp.albums,
                                    al_arr.push(...temp2),
                                    setAlbums([...al_arr]),
                                    temp2 = temp.artists,
                                    ar_arr.push(...temp2),
                                    setArtist([...ar_arr]),
                                    temp2 = temp.playlists,
                                    p_arr.push(...temp2),
                                    setPlist([...p_arr])
                                    )
                                    : {}
                            }
                            // console.log(data)
                        }
                        fetchSearch()
                         return false
                         }}>
                        <i className="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}}></i>
                    </button>
                </div>
            </div> */}
            <a onClick={function handleClick() {navigate('/app/discover')}}>
                <h2 style={{position: 'relative', right: '5vw'}} >Discover</h2>
            </a>
            <a onClick={function handleClick() {navigate('/app')}}>
                <img style={{width: '80px', height: '80px'}} src={logo} alt="Avatar"/>
            </a>

            <div>
            
                <Modal open={open} onClose={onCloseModal} center classNames={{overlay: 'customOverlay', modal: 'customModal'}} closeIcon={closeIcon}>
                  
                <div className="wrap">
                <div className="search">
                    <input type="text" className="searchTerm" id='searchTerm'  placeholder="What are you looking for?" />
                    <button type="button" className="searchButton" onClick={function handleSubmit(){
                      setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([])
                      console.log(document.getElementById("searchTerm").value);
                      const fetchSearch = async () => {
                          const resp = await fetch(`http://localhost:8888/auth/search/${document.getElementById("searchTerm").value}`)
                          // const data = await resp.json()
                          let reader = resp.body.getReader()
                          let result
                          let temp
                          let temp2
                          let t_arr = []
                          let al_arr = []
                          let ar_arr = []
                          let p_arr = []
                          let decoder = new TextDecoder('utf8')
                          while(!result?.done){
                              result = await reader.read()
                              let chunk = decoder.decode(result.value)
                              // console.log(chunk ? JSON.parse(chunk) : {})
                              chunk ? (
                                  temp = JSON.parse(chunk),
                                  temp2 = temp.tracks,
                                  t_arr.push(...temp2),  
                                  setTracks([...t_arr]),
                                  temp2 = temp.albums,
                                  al_arr.push(...temp2),
                                  setAlbums([...al_arr]),
                                  temp2 = temp.artists,
                                  ar_arr.push(...temp2),
                                  setArtist([...ar_arr]),
                                  temp2 = temp.playlists,
                                  p_arr.push(...temp2),
                                  setPlist([...p_arr])
                                  )
                                  : {}
                          }
                          // console.log(data)
                      }
                      fetchSearch()
                       return false
                    }}><i className="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}} ></i></button>
                    </div>
                    </div>
                    <img src={space} style={{zIndex: '0', width: '100%', height: '200px', position: 'absolute', top: '0'}} />


                    <div style={{display: 'flex', justifyContent: 'center', zIndex: '9', position: 'relative', marginTop: '5vw'}}>
                        <button onClick={() => setHtml(getTracks(tracks))}>Tracks</button>
                        <button onClick={() => setHtml(getAlbums(albums, navigate, onCloseModal))}>Albums</button>
                        <button onClick={() => setHtml(getArtists(artist, navigate, onCloseModal))}>Artists</button>
                        <button onClick={() => setHtml(getPlaylists(plist, navigate, onCloseModal))}>Playlists</button>
                    </div>

                    <div style={{maxWidth: '55vw', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{html ? html : getTracks(tracks)}</div>
                </Modal>
            </div>
        </div>
    )
}
