import styles from './Logo.module.css';
import 'react-responsive-modal/styles.css';
import { useGetUserQuery,useGetAlbumsQuery, useGetPlaylistsQuery } from '../../App/ApiSlice';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { useState, useEffect, useContext, useRef } from 'react';
import Track from '../Track/Track';
import search from '../../images/search.png';
import space from '../../images/music.gif';
import logo from '../../images/logo.png';
import UsePlayerContext from '../.././hooks/PlayerContext.tsx';
import { spotifyRequest } from '../../utils/utils.ts';
import { closeIcon } from '../../helpers/CloseIcon.tsx';

import { useAppDispatch } from '../../App/hooks.ts';
import { setCurrentAlbum } from '../../App/defaultSlice.ts';

import InfiniteObserver from '../../helpers/InfiniteObserver.tsx';

function getTracks(ptracks: any) {
  let key = 0;

  return (    
    ptracks.map((t:any, index:any) =>  
      <div className='logoTracks fade-in-image' style={{display: 'flex', alignItems: 'center', fontSize: '20px'}} key={index}>            
        <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px', width: '64px', borderRadius: '5px'}}/>

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
function getAlbums(albumss: any, palbums: any, nav: any, close: any, dispatch: any) {
  var artists: any = [];
  var a_ids: any = [];
  
  return (
    palbums.map((t:any) =>
      <a 
        key={t.id} 
          onClick={() => {
          //Check if album is already in library or not
          let found = albumss?.find((e: any) => e?.album_id === t.id);

          sessionStorage.setItem("albumStatus", found ? "user" : "notuser");

          t.artists.map((s:any) => artists.push(s.name));
          t.artists.map((s:any) => a_ids.push(s.id));

          dispatch(setCurrentAlbum({
            image:  t.images.filter((t:any) => t.height == 300).map((s:any) => s.url),
            artists: artists,
            artist_ids: a_ids,
          }));

          nav(`/app/album/${t.id}`);

          close();
        }}
      >
        <div className='fade-in-image' style={{display: 'flex', alignItems: 'center', color: 'rgb(90, 210, 216)', fontWeight: 'bold',fontSize: '20px'}}>
          <img src={t.images.filter((t:any) => t.height == 64).map((s:any) => s.url)} style={{height: '64px', borderRadius: '5px'}}/>

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
            style={{height: '64px', width: '64px', borderRadius: '5px'}} 
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
              style={{height: '64px', width: '64px', borderRadius: '5px'}}
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
  const dispatch = useAppDispatch();

  const navigate: any = useNavigate();

  const selectorRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [html, setHtml] = useState<any>(null)
  const [tracks, setTracks] = useState<any>([]);
  const [albums, setAlbums] = useState<any>([]);
  const [plist, setPlist] = useState<any>([]);
  const [artist, setArtist] = useState<any>([]);
  const {data: albumss = []} = useGetAlbumsQuery();
  const {data: playlists = []} = useGetPlaylistsQuery();    

  const [open, setOpen] = useState(false);        
  const onOpenModal = () => {setOpen(true)};
  const onCloseModal = () => {setOpen(false); setHtml(null); setTracks([]); setAlbums([]); setPlist([]); setArtist([]); setIsLoading(false); counter = 0};
  
  const {resetPlayer} = useContext(UsePlayerContext);

  const buttonNames = ["tracks", "albums", "artists", "playlists"];
  const [activeButton, setActiveButton] = useState<string>(sessionStorage.getItem('searchHome') ?? "tracks");

  const capitalize = (str: any) => {return str.charAt(0).toUpperCase() + str.slice(1)};

  const fetchSearch = async () => {        
    try {      
      const temp = spotifyRequest(`/search/${(document.getElementById("searchTerm") as HTMLInputElement).value},${counter}`)
        .then((res) => {          
          return res.json();
        })
        .then((data) => {
            if (counter){
              setTracks((prev: []) => [...prev, ...data.tracks]);
              //setTracks([...tracks,...data.tracks]);
              //setAlbums([...albums,...data.albums]);
              setAlbums((prev: []) => [...prev, ...data.albums]);
              //setArtist([...artist,...data.artists]);
              setArtist((prev: []) => [...prev, ...data.artists]);
              //setPlist([...plist,...data.playlists]);
              setPlist((prev: []) => [...prev, ...data.playlists]);
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

  const {data: user,isSuccess} = useGetUserQuery()    
  
  useEffect(() => {         
    isSuccess && sessionStorage.setItem("username", user.name);

    switch(sessionStorage.getItem('searchHome')) {
      case 'tracks':
        setHtml(getTracks(tracks));

        break;

      case 'albums':
        setHtml(getAlbums(albumss, albums, navigate, onCloseModal, dispatch));

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
        <div style={{display: 'flex', flexDirection: 'column', position: 'fixed', right: '0', top: '0', maxHeight: '92%', overflowY: 'auto', padding: '3px', background: 'linear-gradient(to bottom, #0066ff 0%, #cc33ff 100%)'}}>
          {temp.map((val:any,i: number) => 
            <div key={i}>        
              <a onClick={() => {
              // console.log(val)
              // console.log(sessionStorage.getItem("name"))

                let found = (albumss?.find((e: any) => e?.album_id === val.id) || (albumss?.find((e: any) => e?.name === val.name)));                                
                
                sessionStorage.setItem("albumStatus", found ? "user" : "notuser");

                if (found && val.id !== found?.album_id) {
                  val.id = found?.album_id;
                }
                
                dispatch(setCurrentAlbum({
                  image: val.img.url,
                  artists: val.artists.map((t: any) => t.name),
                  artist_ids: val.artists.map((t: any) => t.uri.split(':').pop()),
                }));

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

        <div className={styles.mainLogo}>          
          <button 
            className={styles.userName}
            style={{
              cursor: 'pointer',
              ...(window.innerWidth < 500 && {backgroundColor: 'rgb(90, 210, 216)', width: '32px', height: '32px', borderRadius: '50%'}),
            }} 
            onClick={() => {
              resetPlayer();

              navigate('/', {replace: true});              
            }}
          >
            {isSuccess ? (window.innerWidth > 500 ? user!.name : user!.name[0]) : ''}
          </button>         

          <div></div> 

          <h2 
            className={styles.navIcon1} 
            onClick={() => {
              if (window.history?.length && window.history.length > 1) navigate(-1, {replace: true});

              else navigate('/app/', {replace: true});
            }}
          >
            {"<"}
          </h2>

          <img 
            className={styles.searchimg} 
            src={search} 
            onClick={() => {onOpenModal()}}
          />

          <h2 
            className={styles.navIcon2} 
            onClick={() => {
              if (window.history?.length && window.history.length > 1) navigate(1, {replace: true});

              else navigate('/app/', {replace: true});
            }}
          >
            {">"}
          </h2>
          
          <button className={styles.Discover} onClick={() => {navigate('/app/discover')}}>Discover</button>   
                          
          <a onClick={(() => {navigate('/app')})}>
            <img className={styles.logoIcon} src={logo} alt="Avatar" onClick={(() => {navigate('/app')})}/>
          </a>
                    
          <Modal 
            ref={selectorRef}
            modalId='modal3' 
            open={open} 
            onClose={onCloseModal} 
            center 
            closeIcon={closeIcon()}
            styles={{
              modal: {
                minWidth: '85vw',
                minHeight: '90vh',     
                maxHeight: '90vh',                                             
                background: 'rgb(33, 33, 33)',                
              },
            }}
          >
            <InfiniteObserver
              root={selectorRef.current}
              rootMargin="300px"
              disabled={isLoading || !tracks.length}
              onIntersect={async (obj: IntersectionObserverEntry) => {
                //if (counter > 29) return;
                //console.log(obj);

                setIsLoading(true);                                

                counter += 20;

                //await new Promise(resolve => setTimeout(resolve, 500));  
                
                await fetchSearch();                                    

                setIsLoading(false);                
              }}
            >
              <div className={styles.wrap}>
                <div className={styles.search}>
                  <input 
                    type="text" 
                    className={styles.searchTerm} 
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
                    className={styles.searchButton} 
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

              <img src={space} style={{zIndex: '0', width: '100%', height: '180px', position: 'fixed', top: '0', left: '0', opacity: '0.3', objectFit: 'cover', objectPosition: '20% 50%'}}/>

              <div id='modalbuttons' style={{display: 'none', justifyContent: 'center', zIndex: '9', position: 'absolute', top: '120px', left: '50%', right: '50%'}}>
                {buttonNames.map((name: string, index: number) =>
                  <button 
                    key={index}
                    style={{
                      color: 'black', fontWeight: '900', fontFamily: 'math',
                      ...(activeButton === name ? {background: 'rgb(90, 210, 216)'} : {background: '#7a19e9'}),
                      ...(name === "tracks" ? {borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'} : {}),
                      ...(name === "playlists" ? {borderTopRightRadius: '10px', borderBottomRightRadius: '10px'} : {})
                    }}
                    onClick={() => {
                      setActiveButton(name);

                      switch (name) {
                        case "tracks":
                          setHtml(getTracks(tracks));
                          break;
                        case "albums":
                          setHtml(getAlbums(albumss,albums, navigate, onCloseModal, dispatch));
                          break;
                        case "artists":
                          setHtml(getArtists(artist, navigate, onCloseModal));
                          break;
                        case "playlists":
                          setHtml(getPlaylists(playlists,plist, navigate, onCloseModal));
                          break;
                        default:
                          return;
                      };                      

                      sessionStorage.setItem('searchHome', name.toLowerCase());
                    }}
                  >
                    {capitalize(name)}
                  </button>
                )}                
              </div>

              <div                 
                className={styles.logoModal} 
                style={{maxWidth: '55vw', textOverflow: 'ellipsis', whiteSpace: 'nowrap', position: 'relative', overflowY: 'auto', top: '170px', paddingBottom: '20px'}}
              >
                {html ?? getTracks(tracks)}               

                {/* {isLoading && <div style={{textAlign: 'center', fontSize: '36px', color: 'white'}}>Loading...</div>}  */}
                {isLoading &&
                  <div 
                    style={{
                      width: '24px',
                      height: '24px',
                      border: '4px solid rgb(90, 210, 216)',
                      borderTop: '4px solid #7a19e9',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '10px 5px 0px',
                    }}
                  />
                }
              </div>            

              {tracks.length < 0 && 
                <button 
                  onClick={() => {
                    counter += 10;

                    fetchSearch();
                  }} 
                  style={{width: '100%', height: '54px', fontSize: '25px', fontWeight: 'bolder', color: 'black', background: '#7a19e9', position: 'absolute', bottom: '0', left: '0'}} 
                >
                  Load More
                </button>}
              </InfiniteObserver>                      
          </Modal>          
        </div>
        </>
      }
    </>
  );
};