import './Logo.css';
import 'react-responsive-modal/styles.css';
import { useGetUserQuery,useGetAlbumsQuery, useGetPlaylistsQuery } from '../../App/ApiSlice';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { useState, useEffect, useContext } from 'react';
import Track from '../Track/Track';
import escape from '../../images/escape.jpg';
import search from '../../images/search.png';
import space from '../../images/music.gif';
import logo from '../../images/logo.png';
import UsePlayerContext from '../.././hooks/PlayerContext.tsx';
import { spotifyRequest } from '../../utils.ts';

function getTracks(ptracks: any) {
  let key = 0;

  return (
    ptracks.map((t:any, index:any) =>  
      <div className='logoTracks' style={{display: 'flex', alignItems: 'center', fontSize: '20px'}} key={index}>            
        <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px', width: '64px'}}/>

        <Track 
          uri={t.url}
          name={t.name}
          number={t.track_number}
          duration={t.duration_ms}
          album_name={t.album_name}
          artist={t.artists}
          show={false}
        />

        <p hidden>{key++}</p>
      </div>
    )
  );
};
function getAlbums(albumss: any, palbums: any, nav: any, close: any) {
  var artists: any = [];
  var a_ids: any = [];
  
  return (
    palbums.map((t:any) =>
      <a 
        key={t.id} 
          onClick={() => {
          //Check if album is already in library or not
          let found = albumss?.find((e: any) => e?.album_id === t.id);

          found ? sessionStorage.setItem("albumStatus","user") : sessionStorage.setItem("albumStatus", "notuser");

          t.artists.map((s:any) => artists.push(s.name));
          t.artists.map((s:any) => a_ids.push(s.id));
          sessionStorage.setItem("artist", JSON.stringify(artists));
          sessionStorage.setItem("artist_id", JSON.stringify(a_ids));
          sessionStorage.setItem("image", t.images.filter((t:any) => t.height == 300).map((s:any) => s.url));
          nav(`/app/album/${t.id}`);
          close();
        }}
      >
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
          <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px'}}/>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div>{t.name}</div>

            <div>{t.artists.map((a:any) => a.name + " ")}</div>
          </div>            
        </div>
      </a>
    )    
  );
};
function getArtists(partists: any, nav: any, close: any){
  return (
    partists.map((a:any) => 
      <a 
        key={a.id} 
        onClick={() => {
          nav(`/app/artist/${a.id}`);

          close();
        }}
      >
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>          
          <img 
            src={!a.images?.length ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' : a.images[2]?.url} 
            alt={a.name} 
            style={{height: '64px', width: '64px'}} 
          />

          {a.name}
        </div>
      </a>
    )
  );
};
function getPlaylists(plistss:any,plists: any, nav: any, close: any){
  return (
    plists.map((a:any) =>
      <div key={a.id}>
        <a onClick={() => {
          sessionStorage.removeItem("cplaylist");

          let found = plistss?.find((e: any) => e?.playlist_id === a.id)

          sessionStorage.setItem("uplist", found ? "true" : "false");

          sessionStorage.setItem("playlist_name", a.name);

          sessionStorage.setItem("fullp_image", JSON.stringify(a.images));

          sessionStorage.setItem("p_image", a.images.length == 1 ? a.images.map((s:any) => s.url) : a.images.filter((s:any) => s.height == 60).map((s:any) => s.url));

          nav(`/app/playlist/${a.id}`);

          close();
        }}>
          <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
            <img 
              src={a.images?.length == 1 ? a.images?.map((s:any) => s.url) : a.images?.filter((s:any) => s.height == 60).map((s:any) => s.url)} 
              alt={a.name} 
              style={{height: '64px', width: '64px'}}
            />

            {a.name}
          </div>
        
          <br></br>
        </a>      
      </div>
    )
  );
};

let counter = 0;

export default function Logo () {
  const navigate: any = useNavigate();

  const [html, setHtml] = useState<any>(null)
  const [tracks, setTracks] = useState<any>([]);
  const [albums, setAlbums] = useState<any>([]);
  const [plist, setPlist] = useState<any>([]);
  const [artist, setArtist] = useState<any>([]);
  const {data: albumss = []} = useGetAlbumsQuery();
  const {data: playlists = []} = useGetPlaylistsQuery();    

  const [open, setOpen] = useState(false);        
  const onOpenModal = () => {setOpen(true)};
  const onCloseModal = () => {setOpen(false); setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0};
  
  const {resetPlayer} = useContext(UsePlayerContext);

  const fetchSearch = async () => {        
    try {      
      const temp = spotifyRequest(`/search/${(document.getElementById("searchTerm") as HTMLInputElement).value},${counter}`)
        .then((res) => {          
          return res.json();
        })
        .then((data) => {
            if (counter){
              setTracks([...tracks,...data.tracks]);
              setAlbums([...albums,...data.albums]);
              setArtist([...artist,...data.artists]);
              setPlist([...plist,...data.playlists]);
            }
            else{
              setTracks([...data.tracks]);
              setAlbums([...data.albums]);
              setArtist([...data.artists]);
              setPlist([...data.playlists]);
            }
        });

      return temp;
    } catch (err) {
      console.log(err);
    }               
  };

  const closeIcon = (
    <img src={escape} style={{height: '44px', width: '44px'}}/>
  );

  const {data: user,isSuccess} = useGetUserQuery()    
  
  useEffect(() => {         
    isSuccess && sessionStorage.setItem("username", user.items);

    switch(sessionStorage.getItem('searchHome')) {
      case 'tracks':
        setHtml(getTracks(tracks));

        break;

      case 'albums':
        setHtml(getAlbums(albumss, albums, navigate, onCloseModal));

        break;
      case 'artists':
        setHtml(getArtists(artist, navigate, onCloseModal));

        break;
      case 'playlists':
        setHtml(getPlaylists(playlists, plist, navigate, onCloseModal));

        break;
      default:
        setHtml(getTracks(tracks));
    };
  }, [tracks]);

  function listRecent() { 
    let temp: any = [];
    let temp2 = JSON.parse(localStorage.getItem("recent")!);        

    if (temp2 && window.innerWidth > 500) {          
      Object.keys(temp2).forEach((val:any) => temp.push( {"id": temp2[val].id,"name": temp2[val].name,"artists": temp2[val].artists,"img": temp2[val].images.filter((t: any) => t.height == 640)[0]} ));    
      return (
        <div style={{display: 'flex', flexDirection: 'column', position: 'fixed', right: '0', top: '0', zIndex: '3', maxHeight: '100%', overflowY: 'auto', padding: '3px', background: 'linear-gradient(to bottom, #0066ff 0%, #cc33ff 100%)'}}>
          {temp.map((val:any,i: number) => 
            <div key={i}>        
              <a onClick={() => {
              // console.log(val)
              // console.log(sessionStorage.getItem("name"))

                let found = (albumss?.find((e: any) => e?.album_id === val.id) || (albums?.find((e: any) => e?.name === val.name)));                                
                
                if (found) {
                  sessionStorage.setItem("albumStatus","user");

                  if (val.id !== found?.album_id) {
                    found?.album_id;
                  }                  
                } else {
                  sessionStorage.setItem("albumStatus","notuser");
                }
                
                sessionStorage.setItem("image", val.img.url);

                sessionStorage.setItem("artist", JSON.stringify(val.artists.map((t: any) => t.name)));

                sessionStorage.setItem(
                  "artist_id", 
                  JSON.stringify(
                    val.artists.map((t: any) => t.uri.split(':').pop())
                  ),
                );

                navigate(`/app/album/${val.id}`);
              }}>                
                <img key={i} src={val.img.url} style={{width: '43px', height: '43px', borderRadius: '5px'}}/>           
              </a>          
            </div>
          )}
        </div>
      );
    }
    else{
      return (
        <>
        </>
      );
    }
  };

  return(
    <>
      {isSuccess &&     
        <>
        {listRecent()} 

        <div className='mainLogo'>          
          <h2 
            className='userName' 
            style={{cursor: 'pointer'}} 
            onClick={() => {
              resetPlayer();

              navigate('/', {replace: true});              
            }}
          >
            {isSuccess ? user!.items : 'hi'}
          </h2>

          <div className='u2Container' style={{backgroundColor: 'rgb(90, 210, 216)', width: '32px', height: '32px', borderRadius: '50%'}}>
            <h2 
              className='userName2' 
              style={{cursor: 'pointer'}} 
              onClick={() => {
                resetPlayer();

                navigate('/', {replace: true});              
              }}
            >
              {isSuccess ? user!.items[0] : 'hi'}
            </h2>
          </div>          

          <h2 
            className='navIcon1' 
            onClick={() => {
              if (window.history?.length && window.history.length > 1) navigate(-1, {replace: true});

              else navigate('/app/', {replace: true});
            }}
          >
            {"<"}
          </h2>

          <img 
            className='searchimg' 
            src={search} 
            onClick={() => {onOpenModal()}}
          />

          <h2 
            className='navIcon2' 
            onClick={() => {
              if (window.history?.length && window.history.length > 1) navigate(1, {replace: true});

              else navigate('/app/', {replace: true});
            }}
          >
            {">"}
          </h2>
          
          <h2 className='Discover' onClick={() => {navigate('/app/discover')}}>Discover</h2>   
                          
          <a onClick={function handleClick() {navigate('/app')}}>
            <img className='logoIcon' src={logo} alt="Avatar" onClick={function handleClick() {navigate('/app')}}/>
          </a>

          <div>          
            <Modal modalId='modal3' open={open} onClose={onCloseModal} center closeIcon={closeIcon}>            
              <div className="wrap">
                <div className="search">
                  <input 
                    type="text" 
                    className="searchTerm" 
                    id='searchTerm'  
                    placeholder="What are you looking for?" 
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0;
                      
                        let t = document.getElementById('modalbuttons')!;
                        t.style.display = 'flex';
                        t.style.animation = 'fadeIn 0.5s';

                        fetchSearch();

                        return;
                      }
                    }}
                  />

                  <button 
                    type="button" 
                    className="searchButton" 
                    onClick={() => {                    
                      setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); counter = 0;
                      
                      let t = document.getElementById('modalbuttons')!;
                      t.style.display = 'flex';
                      t.style.animation = 'fadeIn 0.5s';

                      fetchSearch();

                      return;
                    }}
                  >
                    <i className="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}}></i>
                  </button>
                </div>
              </div>

              <img src={space} style={{zIndex: '0', width: '100%', height: '180px', position: 'fixed', top: '0', opacity: '0.3', objectFit: 'cover', objectPosition: '20% 50%'}}/>

              <div id='modalbuttons' style={{display: 'none', justifyContent: 'center', zIndex: '9', position: 'relative', marginTop: '8vw'}}>
                <button onClick={() => {setHtml(getTracks(tracks)), sessionStorage.setItem('searchHome', 'tracks')}}>Tracks</button>

                <button onClick={() => {setHtml(getAlbums(albumss,albums, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'albums')}}>Albums</button>

                <button onClick={() => {setHtml(getArtists(artist, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'artists')}}>Artists</button>

                <button onClick={() => {setHtml(getPlaylists(playlists,plist, navigate, onCloseModal)), sessionStorage.setItem('searchHome', 'playlists')}}>Playlists</button>
              </div>

              <div className='logoModal' style={{maxWidth: '55vw', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', marginTop: '40px'}}>{html ? html : getTracks(tracks)}</div>

              {tracks.length > 0 && 
                <button 
                  onClick={() => {
                    counter += 10;

                    fetchSearch();
                  }} 
                  style={{width: '100%', marginTop: '10px', height: '54px', fontSize: '25px', fontWeight: 'bolder'}} 
                >
                  Load More
                </button>}                      
            </Modal>
          </div>
        </div>
        </>
      }
    </>
  );
};