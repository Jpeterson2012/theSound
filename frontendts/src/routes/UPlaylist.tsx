//Session storage vars ref_id and ref_items created here

//Working on fixing fetched playlists. attempting to split user and regular
import './UPlaylist.css'
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import PTrack from "../components/PTrack/PTrack.tsx";
import { useGetPlaylistsQuery, useGetLikedQuery, Playlists, useDeleteNewLikedMutation, useDeletePlaylistMutation } from "../App/ApiSlice.ts";
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'
import { Spin } from "../components/Spin/Spin.tsx";
import dots from "../images/dots.png"
import EditPlaylist from "../components/EditPlaylist/EditPlaylist.tsx";
import MySnackbar from "../components/MySnackBar.tsx";
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";
import { filterTracks } from "../components/filterTracks.tsx";
import { spotifyRequest, msToReadable } from '../utils/utils.ts';

import { AddToLibrary } from '../helpers/AddToLibrary.tsx';

import { useAppSelector } from '../App/hooks.ts';

function customImage(ptracks: any){
  return(
    <div className="mainImage2">
      <div className="subImage" >
        <img className="subsubImage" style={{borderRadius: '15px 0px 0px 0px'}} src={ptracks.tracks[0]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
        <img className="subsubImage" style={{borderRadius: '0px 15px 0px 0px'}} src={ptracks.tracks[1]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
      </div>
      <div className="subImage" >
        <img className="subsubImage" style={{borderRadius: '0px 0px 0px 15px'}} src={ptracks.tracks[2]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
        <img className="subsubImage" style={{borderRadius: '0px 0px 15px 0px'}} src={ptracks.tracks[3]?.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}/>
      </div>
    </div>
  )
}

function returnUrl(ptracks: any){    
  if (ptracks.images.length === 0) return 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg';
  else if (ptracks.images.length === 1) return ptracks.images.map((s:any) => s.url);
  else return ptracks.images.filter((t: any) => t.height == 640).map((s: any) => s.url); 
}
{/* Old method of playling playlist using playlist uri. doesnt work with sorting */}
{/* {last == 'likedsongs' ? liked_urls.push(t.uri) : liked_urls = null } */}
function userPlaylists(userLists: any, liked_urls: any, paused: any,removeSong: any, lastSegment: any, setmodal:any, settrack: any, setsnack:any, filter_val:any, exitingSong: any) {  
  let temp2 = document.getElementById('dropdown-content2')!;

  if(temp2) temp2.style.display = 'none'           
  
  return (
    userLists?.tracks?.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).map((t: any, index: number) =>
      <div 
        key={t.uri.split(':').pop()} 
        style={{
          display: 'flex', alignItems: 'center',
          ...(t.uri === exitingSong ? {animation: 'fadeOut 0.25s ease-in-out'} : {animation: 'fadeIn 0.25s ease-in-out'}),
        }}
      >
        <p hidden>{liked_urls.push(t.uri)}</p>

        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>                      
          <a>
            <div className="removeContainer2" id="removeContainer2">
              <div className="removeAlbum2" id="removeAlbum2">
                <button 
                  type="button" 
                  tabIndex={0} 
                  style={{color: 'black',background: 'rgb(90, 210, 216)', fontSize: '13px',width: '130px', height: '60px'}} 
                  onClick={() => {  
                    settrack(t);

                    setmodal(true);                                     
                  }}
                >
                  Edit Playlists
                </button>

                {lastSegment === 'likedsongs' && 
                  <button 
                    style={{color: 'black',background: 'rgb(90, 210, 216)', fontSize: '13px', width: '130px', height: '60px'}} 
                    onClick={() => {  
                      setsnack(true)
                    
                      setTimeout(() => {
                        removeSong({name: t.name}); 
                      }, 300);
                    }}
                  >
                    Remove From Liked Songs
                  </button>}
              </div>

              <img 
                src={dots} 
                className="removeImg2"
                onClick={() => {
                  settrack(t);

                  setmodal(true);                  
                }} 
              />      
            </div>
          </a>

          <img className="uPlaylistImgs" src={t.images.filter((t: any)=>t.height == 64).map((s: any) => s.url)} style={{height: '64px', width: '64px',borderRadius: '10px'}}/>
        </div>
        
        <PTrack 
          uri={userLists.uri}
          name={t.name}
          number={index}
          duration={t.duration_ms}
          liked={liked_urls}
          artist={t.artists}
          t_uri={t.uri}          
          paused={paused}
        />                
      </div>
    )
  );
};

function playlistSort(tplaylist: any, setTPlaylist: any) {  
  let temp: any;

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
            temp = tplaylist.tracks.slice();

            temp.sort(buttonData[key]);      ;

            setTPlaylist({...tplaylist, tracks: temp});      
          }}
        >
          {key}
        </button>
      )}
    </>
  );
}

export default function UPlaylist({lastSegment}: any){
  const [loading, setLoading] = useState(true);
  var liked_uris: any = [];
  const stockImage = "https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg";

  const {data: liked, isSuccess: lsuccess} = useGetLikedQuery()
  const [removeSong] = useDeleteNewLikedMutation()  
  const [modal, setModal] = useState(false)
  const [trackData, setTrackData] = useState(null)
  const [snack, setSnack] = useState(false)
  const [deletePlaylist] = useDeletePlaylistMutation()
  const [tplaylist, setTplaylist] = useState<any>([])
  const [filter_val, setFilter_val] = useState<string>('')

  const {data: pStorm = []} = useGetPlaylistsQuery();

  const {is_active, playerState} = useContext(UsePlayerContext);

  type getPlaylistfromResultArg = TypedUseQueryStateResult<Playlists[],any,any>
  
  const selectOnePlaylist = createSelector(
    (res: getPlaylistfromResultArg) => res.data,
    (res: getPlaylistfromResultArg, userId: string) => userId,
    (data, userId) => data?.filter(plist => plist.playlist_id === userId)
  )

  const { singlePlist, isSuccess: psuccess } = useGetPlaylistsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      singlePlist: selectOnePlaylist(result, lastSegment!),
    })
  })

  let truth: boolean = lsuccess && psuccess;

  const exitingSong = useAppSelector(state => state.defaultState.exitingSong);  

  useEffect(() => {               
    if(truth) setLoading(false)     
      if (psuccess){
        lastSegment! === 'likedsongs' 
          ? setTplaylist(liked) 
          : ( singlePlist!.length > 0 ? (sessionStorage.setItem("u_playlist",JSON.stringify(singlePlist!)), setTplaylist(singlePlist![0])) : setTplaylist(JSON.parse(sessionStorage.getItem("u_playlist")!)[0]) )
      }          
  },[lsuccess,liked,pStorm]);    

  return(
    <>        
      {!loading && (
        <>
          <div style={{marginBottom: '150px'}}>                    
            {(lastSegment! === 'likedsongs' ? Spin(is_active,playerState.is_paused,stockImage,null) 
            : (!tplaylist?.images?.length && tplaylist?.tracks?.length > 3) 
              ? Spin(is_active,playerState.is_paused,"",customImage(tplaylist)) 
              : Spin(is_active,playerState.is_paused,returnUrl(tplaylist!),null) )}

            <div>            
              <div style={{marginBottom: '60px', marginTop: '40px'}}>  
                <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{sessionStorage.getItem("playlist_name")}</h2>

                <div className="desc2" style={{display: 'flex', marginRight: '10px', alignItems: 'center'}}>
                  <h5 style={{marginRight: '5px',color: 'rgb(90, 210, 216)'}}>playlist &#8226;</h5>

                  <h5 style={{color: 'rgb(90, 210, 216)'}}>
                    {tplaylist!.tracks.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).length
                      + " Song(s) • "
                      + msToReadable(tplaylist!.tracks.reduce((acc: number, item: any) => {
                          acc += Number(item.duration_ms);
                          
                          return acc;
                        }, 0)
                      )}
                  </h5>

                  {lastSegment !== 'likedsongs' && 
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
                      
                        if (!singlePlist!.length) {           
                          setSnack(true);  

                          setTimeout (() => {
                            spotifyRequest('/users/playlist', "POST", {
                              body: JSON.stringify({id: lastSegment,name: sessionStorage.getItem("playlist_name"), images: JSON.parse(sessionStorage.getItem("fullp_image")!)})
                            });
                          },500);                                                           
                        } else{                                        
                          setSnack(true);

                          setTimeout(() => { deletePlaylist({pID: lastSegment!}) },300);                                                                           
                        }                                        
                      }}
                    >
                      {!singlePlist!.length ? "+" : "✓"}
                    </AddToLibrary>}

                  <div className="dropdown" id="dropdown">
                    <button 
                      className="dropbtn" 
                      style={{marginLeft: '100%'}} 
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

                    <div className="dropdown-content2" id="dropdown-content2">
                      {playlistSort(tplaylist!, setTplaylist)}
                    </div>
                  </div>                                  
                </div>

                {filterTracks(setFilter_val)}                            

                <div className="tdContainer" style={{width: '80vw'}} >
                  <div className="subTdContainer" style={{marginTop: '50px', width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                    <span className="lolP2">Title</span>

                    <span className="lolP">Duration</span>
                  </div>

                  {userPlaylists(tplaylist!, liked_uris, playerState.is_paused,removeSong, lastSegment,setModal,setTrackData,setSnack,filter_val, exitingSong) }
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
