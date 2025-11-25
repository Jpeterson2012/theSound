//Session storage vars ref_id and ref_items created here
import './RAlbum.css'
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import Track from "../components/Track/Track.tsx";
import { useGetAlbumsQuery, useAddAlbumMutation,useDeleteAlbumMutation } from "../App/ApiSlice.ts";
import { Spin,Spin3 } from "../components/Spin/Spin.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";
import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import { filterTracks } from "../components/filterTracks.tsx";
import { spotifyRequest, msToReadable } from '../utils/utils.ts';

import { AddToLibrary } from '../helpers/AddToLibrary.tsx';

export default function RAlbum() {
  const navigate = useNavigate()
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  const [tracks, setTracks] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true)
  var zip = JSON.parse(sessionStorage.getItem("artist")!).map((e: any,i: number) => {
    return [e, JSON.parse(sessionStorage.getItem("artist_id")!)[i]]
  })
  
  const [addAlbum] = useAddAlbumMutation()
  const [deleteAlbum] = useDeleteAlbumMutation()
  const {data: albums = []} = useGetAlbumsQuery()
  const [snack, setSnack] = useState(false)
  const [modal, setModal] = useState(false)
  const [trackData, setTrackData] = useState<any>(null)
  const [filter_val, setFilter_val] = useState<string>('')
  //Check if album is already in library or not
  let found = albums?.find((e: any) => e?.album_id === lastSegment)  
  console.log(found)

  const {is_active, playerState} = useContext(UsePlayerContext);
  const [discog, setDiscog] = useState<any>({});

  useEffect (() => {
    sessionStorage.setItem("albumStatus", "notuser")
    if (sessionStorage.getItem("ref_id") === lastSegment) {
      setTracks(JSON.parse(sessionStorage.getItem("ref_items")!));

      setDiscog(JSON.parse(sessionStorage.getItem("discog")!));

      setIsLoading(false);
    }
    else {
      const fetchTracks = async () => {
        try {          
          const temp = await spotifyRequest(`/tracks/${lastSegment}`)
            .then((res) => {
              // console.log(res.json())
              return res.json();
            }).then((data) => {return data})
          return temp
        }
        catch (err) {}
      }
      const assignTracks = async () => {
        // setIsLoading(true)
        const tempTracks = await fetchTracks();
        setIsLoading(false)
        // console.log(tempTracks)
        setTracks(tempTracks)
        sessionStorage.setItem("ref_id", lastSegment!)
        sessionStorage.setItem("ref_items", JSON.stringify(tempTracks))
      }
      assignTracks();

      const fetchDiscog = async () => {
        //const resp = await spotifyRequest(`/artists2/albums/${zip[0][1]}`);
        const resp = await spotifyRequest(`/artists2/albums/${zip.map((z: any) => z[1]).join()}`);
        const data = await resp.json();
  
        console.log(data);
        setDiscog(data);
        sessionStorage.setItem("discog", JSON.stringify(data));
      };
  
      fetchDiscog();
    }
    //This fixes render bug where fetch doesn't activate when clicking on currently playing album
  }, [sessionStorage.getItem("image")]);
  
  const listItems = tracks.albums?.tracks?.items.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).map((t: any, index:any) =>
    <div className="listContainer" key={index}>

      <div className="removeContainer3" id="removeContainer3">
      
        <button className="removeAlbum3" onClick={() => {               
          let temp = {images: tracks?.albums?.images, uri: t.uri, name: t.name, track_number: 0, duration_ms: t.duration_ms, artists: t.artists}                                   
          setTrackData(temp)
          setModal(true)               
          }}>Edit Playlists</button>

        <img src={dots} className="removeImg2" onClick={() => {
          let temp = {images: tracks?.albums?.images, uri: t.uri, name: t.name, track_number: 0, duration_ms: t.duration_ms, artists: t.artists}                            
          setTrackData(temp)
          setModal(true)
        }}/>            
      
      </div>
        
      <Track 
        uri={tracks.albums.uri}
        name={t.name}
        number={t.track_number}
        duration={t.duration_ms}
        album_name={null}
        artist={t.artists}
        t_uri={t.uri}
        paused={playerState.is_paused}
      />
    </div>       
  )

  const showDiscog = (arr: []) => {
    return (
      <div style={{display: 'flex', gap: '25px'}} >
          {arr?.map((val:any,i: number) =>                
            <a key={i} style={{display: 'flex', flexDirection: 'column', gap: '10px'}} onClick={() => {
            // console.log(val)
            // console.log(sessionStorage.getItem("name"))

              let found = (albums?.find((e: any) => e?.album_id === val.id) || (albums?.find((e: any) => e?.name === val.name)))  
              
              if (found) {
                sessionStorage.setItem("albumStatus","user");

                if (val.id !== found?.album_id) {
                  found?.album_id;
                }                  
              } else {
                sessionStorage.setItem("albumStatus","notuser");
              }
              
              sessionStorage.setItem("image", val.images.find((b: any) => b.height > 160).url);

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
    <>
      {isLoading ? Spin3() : (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '95vw', maxWidth: '95vw', marginBottom: '150px'}}>          
            <h2 style={{fontSize: '30px'}} >{tracks?.albums?.name}</h2>
            
            {/* Spin Component import now instead of prop */}
            {Spin(is_active,playerState.is_paused,sessionStorage.getItem("image")!,null)}

            <h2 className="artistName">
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
              <div className="albumDescription">
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div className="innerDescription">
                    <h5 className="desc1">{tracks.albums?.album_type === 'single' && tracks.albums?.total_tracks > 1 ? 'EP' : tracks.albums?.album_type.toUpperCase() } &#8226;</h5>

                    <h5>{tracks.albums?.tracks.items.filter((a:any) => a.name.toLowerCase().includes(filter_val.toLowerCase())).length 
                      + " Song(s) • "
                      + msToReadable(tracks.albums?.tracks.items.reduce((acc: any, item: any) => {
                        acc += item.duration_ms;
      
                        return acc;
                      }, 0)) 
                    }</h5>              
                  </div>

                  {/* <img src={tracks.images?.map(b => b.find(b => b.height > 100).url)} style={{borderRadius: '50%', height: '40px'}} /> */}
                  {tracks.images?.map((a: any, i:any) => <img key={i} className="tinyArtist" src={a.find((b: any) => b.height > 160).url} />)}       

                  <AddToLibrary 
                    onClick={(e) => {
                      setSnack(true);

                      const el = e.target as HTMLElement;

                      el.style.transform = 'scale(1)';

                      el.style.animation = 'pulse3 linear 1s';

                      setTimeout(() => {                  
                        el.style.animation = "";

                        el.style.transform = "";
                      }, 1100);                    

                      if (found){                    
                        setTimeout(() => { deleteAlbum({aID: lastSegment!}) },1100);                                 
                      } else {                                        
                        setTimeout(() => {
                          addAlbum({album_type: tracks?.albums?.album_type, total_tracks: tracks?.albums?.total_tracks, album_id: lastSegment!, images: tracks?.albums?.images, 
                            name: tracks?.albums?.name, release_date: tracks?.albums?.release_date, uri: tracks?.albums?.uri, artists: tracks?.albums?.artists, tracks: tracks?.albums?.tracks, 
                            copyrights: tracks?.albums?.copyrights, label_name: tracks?.albums?.label, date_added: new Date().toISOString()}) 
                        },1100);                 
                      }          
                    }}
                  >
                    {found ? "✓" : "+"}
                  </AddToLibrary>                
                </div>

              {filterTracks(setFilter_val)}     
            </div>                 

            <div className="tdContainer" style={{width: '80vw', position: 'relative'}}>
              <div style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                <span className="rTitle">Title</span>

                <span style={{marginLeft: '30px', position: 'absolute', top: '0', left: '60%'}} className="uTitle">Plays</span>

                <span className="rTitle2">Duration</span>
              </div>

              {listItems}
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
              <div style={{display: 'flex', flexDirection: 'column', marginTop: '50px', marginBottom: '50px'}}>
                {tracks.images?.map((a: any, i:any) => <img key={i} src={a.find((b: any) => b.height > 160).url} style={{width: '90px', height: '90px',borderRadius: '10px'}} />)}
              </div>
              
              <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>Release Date: {tracks.albums?.release_date}</h5>

              <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>{ tracks.albums?.copyrights[0]?.text} </h5>

              <h5 style={{textAlign: 'left',color: 'rgb(90, 210, 216)'}}>(R) {tracks.albums?.label}</h5>
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
      )}      
    </>
  );
};