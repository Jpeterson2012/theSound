import './RPlaylist.css'
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import PTrack from "../components/PTrack/PTrack.tsx";
import { Spin, Spin3 } from '../components/Spin/Spin.tsx';
import dots from '../images/dots.png'
import EditPlaylist from '../components/EditPlaylist/EditPlaylist.tsx';
import MySnackbar from '../components/MySnackBar.tsx';
import ButtonScroll from '../components/ButtonScroll/ButtonScroll.tsx';
import { useGetPlaylistsQuery,useDeletePlaylistMutation } from '../App/ApiSlice.ts';
import { filterTracks } from "../components/filterTracks.tsx";
import { spotifyRequest, msToReadable } from '../utils/utils.ts';

import { AddToLibrary } from '../helpers/AddToLibrary.tsx';

function regPlaylists(ptracks: any, last: any, liked_urls: any, paused: any,setmodal:any,settrack:any,rplay:any,filter_val:any){
  let temp2 = document.getElementById('dropdown-content2')!;

  if (temp2) temp2.style.display = 'none';
  
  return (
    ptracks?.filter((a:any) => a.name.toLowerCase().includes(filter_val.toLowerCase())).map((t: any, index: number) => 
      <div style={{display: 'flex', alignItems: 'center'}} key={t.uri.split(':').pop()}>
        <p hidden>{liked_urls.push(t.uri)}</p>   

        <div className="removeContainer3" id='removeContainer3' style={{display: 'flex', alignItems: 'center'}}>
          <button className="removeAlbum3" onClick={() => {        
            settrack(t);

            setmodal(true) ;
          }}>Edit Playlists</button>

          <img src={dots} onClick={() => {
            settrack(t);

            setmodal(true);
          }} className="removeImg2" />

          <img className="uPlaylistImgs" src={t.images?.filter((t: any)=>t.height == 64).map((s: any) => s.url)}/>
        </div>

        <PTrack 
          uri={"spotify:playlist:" + last}
          name={t.name}
          number={index}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}
          rplay={rplay}
          paused={paused}
        />        
      </div>
    )
  );
};

function playlistSort(tplaylist: any, setTPlaylist: any){
  let temp: any

  const buttonData: any = {
    "A-Z": (a:any,b:any) => a.name.localeCompare(b.name),
    "Z-A": (a:any,b:any) => b.name.localeCompare(a.name),
    "Artist A-Z": (a:any,b:any) => a.artists[0].name.localeCompare(b.artists[0].name),
    "Artist Z-A": (a:any,b:any) => b.artists[0].name.localeCompare(a.artists[0].name),
    "Oldest": (a:any,b:any) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime(),
    "Newest": (a:any,b:any) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime(),
  };

  return(
    <>
      {Object.keys(buttonData).map((key, index) =>
        <button 
          key={index}
          className="theme" 
          onClick={() => {                  
            temp = tplaylist;            

            temp.sort(buttonData[key]);      ;

            setTPlaylist([...temp])      
          }}
        >
          {key}
        </button>
      )}
    </>
  );
};

export default function RPlaylist({lastSegment}: any){
  const [ptracks, setpTracks] = useState<any>([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [modal, setModal] = useState(false);
  const[trackData, setTrackData] = useState(null);
  const[snack, setSnack] = useState(false);
  const [rplay, setRplay] = useState(true);
  const [filter_val, setFilter_val] = useState<string>('')

  const {data: playlists = [], refetch} = useGetPlaylistsQuery();
  let found = playlists?.find((e: any) => e?.playlist_id === lastSegment);
  const [deletePlaylist] = useDeletePlaylistMutation();

  var liked_uris: any = []

  const {is_active, playerState} = useContext(UsePlayerContext);

  useEffect (() => {                         
    // if (sessionStorage.getItem("ref_id") === lastSegment) {
    //   setpTracks(JSON.parse(sessionStorage.getItem("ref_items")!))
    //   setTotal(JSON.parse(sessionStorage.getItem("ref_items")!).length)
    //   setLoading(false)
    // }
    if (sessionStorage.getItem("cplaylist") !== undefined && sessionStorage.getItem("cplaylist")) {      
      setpTracks(JSON.parse(sessionStorage.getItem("cplaylist")!));

      setLoading(false);
    } else {
      const fetchpTracks = async () => {
        // setLoading(true)        
        const resp = await spotifyRequest(`/ptracks/${lastSegment}`);

        setLoading(false)
        
        const reader = resp?.body?.getReader();
        const decoder = new TextDecoder();
        let buffer: any = "";

        while (true) {
          const { value, done }: any = await reader?.read();
          if (done) break;

          const chunk = decoder.decode(value, {stream: true});          

          buffer += chunk;

          let lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            if (line.trim() === "") continue;

            const obj = JSON.parse(line);

            console.log(obj.items);
            
            !total && setTotal(obj.total),
            setpTracks((prev: []) => [...prev, ...obj.items]);
          }
        }
  
      }
      fetchpTracks();
      //   const fetchTracks = async () => {
      //     try {
      //         var temp = await fetch(import.meta.env.VITE_URL + `/ptracks/${lastSegment}`,{credentials: "include"})
      //       .then((res) => {
      //         // console.log(res.json())
      //         return res.json();
      //       }).then((data) => {return data})
      //         return temp
      //       }
      //       catch (err) {}
      // }
      // const assignTracks = async () => {
      //   // setIsLoading(true)
      //   const tempTracks = await fetchTracks()
      //   setLoading(false)
      //   console.log(tempTracks)
      //   setpTracks(tempTracks.items)
      //   // sessionStorage.setItem("ref_id", lastSegment!)
      //   // sessionStorage.setItem("ref_items", JSON.stringify(tempTracks))

      // }
      // assignTracks()

    }               
    
  }, [sessionStorage.getItem("playlist_name")!]);

  return(
    <>        
      {loading ? Spin3() : (
        <>
          <div style={{marginBottom: '150px'}}>                
            {/* Spin Component import now instead of prop */}
            {Spin(is_active,playerState.is_paused,sessionStorage.getItem("p_image")!,null)} 

            <div>              
              <div style={{marginBottom: '60px', marginTop: '40px'}}>      
                <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>

                <div className="desc2" style={{display: 'flex', marginRight: '10px', alignItems: 'center'}}>
                  <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>

                  <h5 style={{color: 'rgb(90, 210, 216)'}}>
                    {ptracks?.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).length 
                    + " Song(s) • "
                    +  msToReadable(ptracks?.reduce((acc: number, item: any) => {
                        acc += Number(item.duration_ms);

                        return acc;
                      }, 0)
                    )}
                  </h5>

                  {/* {(sessionStorage.getItem("cplaylist") === undefined && !sessionStorage.getItem("cplaylist")) &&  */}
                    <AddToLibrary 
                      onClick={(e) => {
                        const el = e.target as HTMLElement;
                        setSnack(true);                        

                        el.style.transform = 'scale(1)';

                        el.style.animation = 'pulse3 linear 1s';

                        setTimeout(() => {
                          el.style.removeProperty('animation');

                          el.style.removeProperty('transform');
                        }, 1000);                    
                      
                        if (found) {                                        
                          setSnack(true);

                          setTimeout(() => { deletePlaylist({pID: lastSegment!}), setRplay(true) }, 300);                                                                           
                        } else {           
                          setSnack(true);

                          setRplay(false);

                          setTimeout (() => {
                            spotifyRequest("/users/playlist", "POST", {
                              body: JSON.stringify({id: lastSegment,name: sessionStorage.getItem("playlist_name"), images: JSON.parse(sessionStorage.getItem("fullp_image")!)})
                            });
                          },500);

                          setTimeout(() => {refetch()}, 800);                 
                        }                  
                      
                      }}
                    >
                      {found ? "✓" : "+"}
                    </AddToLibrary>
                  {/* } */}

                  <div className="dropdown" id="dropdown">                                                        
                    <button 
                      className="dropbtn" 
                      style={{marginLeft: '100%'}}
                      onBlur={() => {
                        let temp = document.getElementById('dropdown-content2')!;

                        setTimeout(() => {
                          temp.style.display = 'none';
                        }, 250);                  
                      }} 
                      onClick={() => {
                        let temp = document.getElementById('dropdown-content2')!;
                        
                        if (temp.style.display === 'flex') temp.style.display = 'none';
                        else {
                          temp.style.display = 'flex';

                          temp.style.flexDirection = 'column';
                        }
                      }}
                    >
                      Sort
                    </button>
                      <div className="dropdown-content2" id='dropdown-content2'>
                        {playlistSort(ptracks, setpTracks)}
                      </div>
                  </div>                                                                    
                </div>

                {filterTracks(setFilter_val)}

                <div className="tdContainer" style={{width: '80vw'}} >
                  <div className="subTdContainer" style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                    <span className="lol">Title</span>

                    <span className="lolP">Duration</span>
                  </div>

                  {regPlaylists(ptracks, lastSegment, liked_uris, playerState.is_paused,setModal,setTrackData,rplay,filter_val) }
                </div>                        
              </div>
            </div>
          </div>
        </>
      )}

      <ButtonScroll />

      {modal && <EditPlaylist track={trackData} boolVal={modal} setbool={setModal} setsnack={setSnack} />}

      {snack && <MySnackbar state={snack} setstate={setSnack} message="Changes Saved"/>}
    </>
  );
};