//Session storage vars ref_id and ref_items created here
//import './UAlbum.css';
import styles from './UAlbum.module.css';
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Spin } from "../components/Spin/Spin.tsx";
import { useGetAlbumsQuery, useAddAlbumMutation,useDeleteAlbumMutation, Albums } from "../App/ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'
import Track from "../components/Track/Track.tsx";
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import { filterTracks } from "../components/filterTracks.tsx";
import { spotifyRequest, msToReadable } from '../utils/utils.ts';

import { useAppSelector, useAppDispatch } from '../App/hooks.ts';
import { setCurrentAlbum } from '../App/defaultSlice.ts';

import { AddToLibrary } from '../helpers/AddToLibrary.tsx';

export default function UAlbum() {
  const currentAlbum = useAppSelector(state => state.defaultState.currentAlbum);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash    
  const [isLoading, setIsLoading] = useState(true);

  var zip = currentAlbum.artists.map((e: any,i: number) => {
    return [e, currentAlbum.artist_ids[i]]
  })

  const [addAlbum] = useAddAlbumMutation()
  const [deleteAlbum] = useDeleteAlbumMutation()
  const [artists, setArtists] = useState<any>([])
  const [talbum, setTAlbum] = useState<any>([])
  const [snack, setSnack] = useState(false)
  const [modal, setModal] = useState(false)
  const [trackData, setTrackData] = useState<any>(null)
  const [filter_val, setFilter_val] = useState<string>('');

  const [discog, setDiscog] = useState<any>({});

  const {is_active, playerState} = useContext(UsePlayerContext);
  
  type getAlbumfromResultArg = TypedUseQueryStateResult<Albums[],any,any>;
  
  const selectOneAlbum = createSelector(
    (res: getAlbumfromResultArg) => res.data,
    (res: getAlbumfromResultArg, userId: string) => userId,
    (data, userId) => data?.filter(alist => alist.album_id === userId)
  );

  const { singleAlbum, isSuccess: asuccess } = useGetAlbumsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      singleAlbum: selectOneAlbum(result, lastSegment!)
    })
  });

  const {data: albumss = []} = useGetAlbumsQuery();
  
  let artistss: any = [];
          
  useEffect (() => {                          
    sessionStorage.setItem("albumStatus", "user");    
    
    if(asuccess) {
      setIsLoading(false)
      //Assigns user album to session storage to prevent error if removed from library
      singleAlbum!.length > 0 
        ? (sessionStorage.setItem("ualbum",JSON.stringify(singleAlbum![0])), setTAlbum(singleAlbum![0])) 
        : ( setTAlbum(JSON.parse(sessionStorage.getItem("ualbum")!)), setArtists(JSON.parse(sessionStorage.getItem("uartist")!)) );            
    }
      
    singleAlbum !== undefined && singleAlbum![0]?.artists?.map((a:any) => artistss.push(a.id));
          
    const fetchArtists = async () => {
      try {        
        const temp = await spotifyRequest(`/tracks/artists`, "POST", {body: JSON.stringify(artistss)})
          .then((res) => {                
            return res.json();
          }).then((data) => {return data});

        return temp;
      } catch (err) {
        console.log(err);
      }
    };

    const assignArtists = async () => {            
      const tempArtists = await fetchArtists();

      sessionStorage.setItem("uartist",JSON.stringify(tempArtists));

      setArtists(tempArtists);                            
    };

    assignArtists();

    const fetchDiscog = async () => {
      //const resp = await spotifyRequest(`/artists2/albums/${zip[0][1]}`);
      const resp = await spotifyRequest(`/artists2/albums/${zip.map((z: any) => z[1]).join()}`);
      const data = await resp.json();

      //console.log(data);
      setDiscog(data);
    };

    fetchDiscog();

    //This fixes render bug where fetch doesn't activate when clicking on currently playing album
  }, [currentAlbum.image, ,asuccess]);  
    
  const listItems2 = talbum?.tracks?.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).map((t: any,i:any) =>         
    <div className={styles.listContainer} key={i}>                
      <div className={styles.removeContainer3} id="removeContainer3" style={{position: 'relative'}}>
        <button className={styles.removeAlbum3} onClick={() => {     
          let temp = {images: talbum?.images, uri: t.uri, name: t.name, track_number: 0, duration_ms: t.duration_ms, artists: t.artists} ;

          setTrackData(temp);

          setModal(true);               
        }}>
          Edit Playlists
        </button>

        `<img src={dots} className={styles.removeImg2} onClick={() => {
          let temp = {images: talbum?.images, uri: t.uri, name: t.name, track_number: 0, duration_ms: t.duration_ms, artists: t.artists} ;

          setTrackData(temp);

          setModal(true);
        }}/>            

      </div>

      <Track 
        uri={`spotify:album:${talbum?.album_id}`}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={null}
        artist={t.artists}
        t_uri={t.uri}        
        paused={playerState.is_paused}
      />
    </div>
  );

  const showDiscog = (arr: []) => {
    return (
      <div style={{display: 'flex', gap: '25px'}} >
        {arr?.map((val:any,i: number) =>                
          <a key={i} style={{display: 'flex', flexDirection: 'column', gap: '10px'}} onClick={() => {
          // console.log(val)
          // console.log(sessionStorage.getItem("name"))

            let found = (albumss?.find((e: any) => e?.album_id === val.id) || (albumss?.find((e: any) => e?.name === val.name)))  
            
            if (found) {
              sessionStorage.setItem("albumStatus","user");

              if (val.id !== found?.album_id) {
                found?.album_id;
              }                  
            } else {
              sessionStorage.setItem("albumStatus","notuser");
            }
            
            sessionStorage.setItem("image", val.images.find((b: any) => b.height > 160).url);
            
            dispatch(setCurrentAlbum({
              image: val.images.find((b: any) => b.height > 160).url,
              artists: val.artists.map((t: any) => t.name),
              artist_ids: val.artists.map((t: any) => t.uri.split(':').pop()),
            }));

            sessionStorage.setItem("artist", JSON.stringify(val.artists.map((t: any) => t.name)));

            sessionStorage.setItem(
              "artist_id", 
              JSON.stringify(
                val.artists.map((t: any) => t.uri.split(':').pop())
              ),
            );

            navigate(`/app/album/${val.id}`);
          }}>
            <img key={i} src={val.images.find((b: any) => b.height > 160).url} style={{width: '150px', height: '190px', borderRadius: '10px'}}/>

            <span style={{color: 'rgb(90, 210, 216)'}}>{val.name}</span>

            <span style={{color: 'rgb(90, 210, 216)'}}>{val.release_date}</span>           
          </a>                    
        )}        
      </div>
    );
  };
  
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '95vw', maxWidth: '95vw', marginBottom: '150px'}}>                      
      <h2 style={{fontSize: '30px'}} >{talbum?.name}</h2>
        
      {/* Spin Component import now instead of prop */}
      {Spin(is_active, playerState.is_paused, currentAlbum.image, null)}
                  
      <h2 className={styles.artistName}>
        {zip.map((artist: any,index: number, row: any) =>
          <a 
            key={index}  
            onClick={() => {
              navigate(`/app/artist/${artist[1]}`);
            }}
          >
            {row.length - 1 !== index ? artist[0] + ", " : artist[0]}
          </a>             
        )}
      </h2>

      <div style={{width: '90%'}}>
        <div className={styles.albumDescription}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div className={styles.innerDescription}>
              <h5 className={styles.desc1}>{talbum?.album_type === 'single' && talbum?.total_tracks > 1 ? 'EP' : (talbum?.album_type ?? "").toUpperCase() } &#8226;</h5>

              <h5>{talbum?.tracks?.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).length 
                + " Song(s) • "
                + msToReadable(talbum?.tracks?.items.reduce((acc: any, item: any) => {
                  acc += item.duration_ms;

                  return acc;
                }, 0)) 
              }</h5>              
            </div>

            {/* <img src={tracks.images?.map(b => b.find(b => b.height > 100).url)} style={{borderRadius: '50%', height: '40px'}} /> */}

            {artists?.images?.map((a: any,i:any) => <img key={i} className={styles.tinyArtist} src={a.find((b: any) => b.height > 160).url} />)}

            <AddToLibrary 
              onClick={(e) => {
                const el = e.target as HTMLElement;

                setSnack(true);

                //el.style.transform = 'scale(1)';

                // el.style.animation = 'pulse3 linear 1s';

                // setTimeout(()=>{
                //   el.style.removeProperty('animation');

                //   //el.style.removeProperty('transform');
                // }, 1000);                    

                if (!singleAlbum!.length){      
                  addAlbum({album_type: talbum?.album_type, total_tracks: talbum?.total_tracks, album_id: lastSegment!, images: talbum?.images, name: talbum?.name, 
                    release_date: talbum?.release_date, uri: talbum?.uri, artists: talbum?.artists, tracks: talbum?.tracks, 
                    copyrights: talbum?.copyrights, label_name: talbum?.label_name, date_added: new Date().toISOString()});              
                  // setTimeout (() => {
                  //   addAlbum({album_type: talbum[0]?.album_type, total_tracks: talbum[0]?.total_tracks, album_id: lastSegment!, images: talbum[0]?.images, name: talbum[0]?.name, 
                  //     release_date: talbum[0]?.release_date, uri: talbum[0]?.uri, artists: talbum[0]?.artists, tracks: talbum[0]?.tracks, 
                  //     copyrights: talbum[0]?.copyrights, label_name: talbum[0]?.label_name, date_added: new Date().toISOString()}) 
                  // },1100);                    
                } else {                                        
                  deleteAlbum({aID: lastSegment!});
                  //setTimeout(() => { deleteAlbum({aID: lastSegment!}) },1100);                                        
                }                  
              }}
            >
              {!singleAlbum!.length ? "+" : "✓"}
            </AddToLibrary>
          </div>
          
          {filterTracks(setFilter_val)}
        </div>                                      
        
        <div className={styles.tdContainer}>
          <div style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
            <span className={styles.uTitle}>Title</span>

            <span style={{marginLeft: '30px', position: 'absolute', top: '0', left: '60%'}} className={styles.uTitle}>Plays</span>


            <span className={styles.uTitle2}>Duration</span>
          </div>

          {listItems2}
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
          <div style={{display: 'flex', flexDirection: 'column', marginTop: '50px', marginBottom: '50px'}}>
            {artists?.images?.map((a: any, i:any) => <img key={i} src={a.find((b: any) => b.height > 160).url} style={{width: '90px', height: '90px', borderRadius: '10px'}} />)}
          </div>
          
          <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>Release Date: {talbum?.release_date}</h5>

          <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>{ talbum?.copyrights?.[0]?.text} </h5>

          <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>(R) {talbum?.label_name}</h5>
        </div>

        {zip.map((zID: any, i: number) => 
          <div key={i}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h5 style={{fontSize: '20px', color: 'rgb(90, 210, 216)'}}>More by {zID[0]}</h5>

              <h5 style={{fontSize: '20px', color: 'rgb(90, 210, 216)', cursor: 'pointer'}} onClick={() => {navigate(`/app/artist/${zID[1]}`);}}>See discography</h5>
            </div>

            <div style={{overflowX: 'auto'}}>
              {showDiscog(discog[zID[1]])}
            </div>
          </div>
        )}                        
        
        <ButtonScroll />

        {modal && <EditPlaylist track={trackData} boolVal={modal} setbool={setModal} setsnack={setSnack} />}

        {snack && <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>}
      </div>
    </div>
  );
};