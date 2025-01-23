import './AddLiked.css'
import { useGetLikedQuery, useGetPlaylistsQuery, useAddNewLikedMutation, useDeleteNewLikedMutation, useAddPTrackMutation, useDeletePTrackMutation } from '../../ApiSlice'
import { useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import escape from '../../images/escape.jpg'

export default function AddLiked({active,trackUri: currentTrack,duration}: any){
    const {data: liked, isSuccess: lsuccess} = useGetLikedQuery()
    const {data: playlists} = useGetPlaylistsQuery()
    
    const [removeSong] = useDeleteNewLikedMutation()
    const [addNewsong] = useAddNewLikedMutation()
    const [addpTrack] = useAddPTrackMutation()
    const [removePTrack] = useDeletePTrackMutation()

    let found = liked?.tracks.find((e:any)=>e.uri === currentTrack.uri)
    let found2 = liked?.tracks?.find((e:any)=>e.name === currentTrack?.name && e.artists[0].name === currentTrack?.artists[0].name)
    var submit1: boolean[] = []
    var submit2: boolean[] = []

    const [open, setOpen] = useState(false);

    const onOpenModal = () => {setOpen(true); submit1 = [], submit2 = []}
    const onCloseModal = () => {
        //Potential idea for delaying backend requests
        // let num = 500
        setOpen(false);
        // console.log(submit1)
        let temp = (document.getElementById('checkbox') as HTMLInputElement).checked

        if (submit1[0] !== temp) removeSong({name: currentTrack.name})          

        submit2.push(temp)
        for (let i = 0; i < playlists!.length; i++){
            submit2.push((document.getElementById(`checkbox${i}`) as HTMLInputElement).checked)
            // if (submit1[i+1] !== (document.getElementById(`checkbox${i}`) as HTMLInputElement).checked){
                if (submit1[i+1] !== submit2[i+1]){
                submit1[i+1] === false ? 
                setTimeout(() => {
                    let p_id = playlists![i].playlist_id
                    let ptrackData = {images: currentTrack.album.images, uri: currentTrack.uri, name: currentTrack.name, track_number: 0, duration_ms: duration, artists: currentTrack.artists}
                    addpTrack({pID: p_id, initialP: ptrackData})
                },(sessionStorage.getItem("currentContext") === null || sessionStorage.getItem("currentContext") === "null") ? 500 : 250) :
                setTimeout(() => {
                    let p_id = playlists![i].playlist_id
                    removePTrack({pID: p_id, name: currentTrack.name})
                },(sessionStorage.getItem("currentContext") === null || sessionStorage.getItem("currentContext") === "null") ? 500 : 250)
                
                // num += 500
            }
        }
        // console.log(submit2)
        
    }
    const closeIcon = (
        <img src={escape} style={{height: '44px', width: '44px'}}/>
    )

    return(
        <>
            {!active ? null : (
                <>
                    <div id="snackbar">Added to Liked Songs   <button style={{border: 'none'}} onClick={function handleClick(){
                        onOpenModal()
                    }}>Change</button></div>
                    

                    <div>             
                        <Modal modalId='modal2' open={open} onClose={onCloseModal} center closeIcon={closeIcon}>                            
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '80px', width: '80px', marginRight: '20px'}}/>
                                <h3 style={{fontSize: '18px',color: 'white'}} >Liked Songs</h3>
                                 {/* <button>{found === undefined ? "Add" : "Remove"}</button> */}
                                <input id='checkbox' type='checkbox' />
                                <p hidden>
                                {open ? (
                                    setTimeout(()=>{
                                        (document.getElementById('checkbox') as HTMLInputElement ).checked = true
                                        submit1.push((document.getElementById('checkbox') as HTMLInputElement).checked)
                                    },300)                                    
                                ) : null}
                                </p>
                                </div>
                            {playlists!.map((a: any,i: any) =>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                <img className="fade-in-image" src={a.images.length == 0 ? "https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" : a.images.length == 1 ? a.images.map((s:any) => s.url) : a.images.filter((s:any) => s.height == 300).map((s:any) => s.url)} alt={a.name} style={{height: '80px', width: '80px', marginRight: '20px'}}/>
                                <h3 style={{maxWidth: '500px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '18px',color: 'white'}} >{a.name}</h3>
                                <input id={"checkbox" + i} type='checkbox'/>
                                <p hidden>
                                {open ? (()=>
                                    setTimeout(()=>{
                                        // some track uris are from their single version which is diff from the album version so this checks track uri && (name and artist) together
                                        (a.tracks?.find((e: any)=>e.uri === currentTrack?.uri) === undefined && (a.tracks?.find((e:any)=>e.name === currentTrack?.name && e.artists[0].name === currentTrack?.artists[0].name) === undefined)) ? null : (document.getElementById(`checkbox${i}`) as HTMLInputElement ).checked = true
                                        submit1.push((document.getElementById(`checkbox${i}`) as HTMLInputElement).checked)
                                    },300)
                                    
                                )() : null}
                                </p>
                        
                                </div>    
                            )}                                                          
                        </Modal>
                    </div> 


                    <p id='addSong' onClick={function handleClick(){
                                    
                        const handleSubmit = async () => {
                            var parts = currentTrack.album.uri.split(':');
                            var lastSegment = parts.pop() || parts.pop();

                            try{
                                await addNewsong({ album_id: lastSegment, images: currentTrack.album.images, artists: currentTrack.artists, duration_ms: duration.toString(), uri: `spotify:track:${currentTrack.id}`, name: currentTrack.name }).unwrap()
                            }
                            catch(err){
                                console.error('Failed to save the post: ', err)
                            }
                        }
                        if (found === undefined && found2 === undefined){
                            handleSubmit()
                            let temp = document.getElementById('addSong')!
                            temp.style.animation = 'hithere 1s ease'
                            setTimeout(()=>{
                                temp.style.removeProperty('animation')
                            }, 750)
                            var x = document.getElementById("snackbar");
                            x!.className = "show";
                            setTimeout(function(){ x!.className = x!.className.replace("show", ""); }, 4000);
                        }
                        else{
                            onOpenModal()
                        }

                        
                    }}>{found === undefined && found2 === undefined ? "+" : "✓"}</p>
                </>
            )}
        </>
    )
}

// const [open, setOpen] = useState(false);

    // const onOpenModal = () => {setOpen(true); submit1 = [], submit2 = []}
    // const onCloseModal = () => {
    //     setOpen(false);
    //     // console.log(submit1)
    //     let temp = (document.getElementById('checkbox') as HTMLInputElement).checked
        // if (submit1[0] !== temp){
        //     // var parts = current_track.album.uri.split(':');
        //     // var lastSegment = parts.pop() || parts.pop();

        //     setLiked_songs({tracks: liked_songs?.tracks?.filter(a => a.uri !== current_track.uri)})
        //     fetch(`http://localhost:8888/auth/update`, {
        //         method: 'DELETE',
        //         headers: {"Content-Type":"application/json"},
        //         body: JSON.stringify({track_id: current_track.id})
        //     })
        // }
        // submit2.push(temp)
        // for (let i = 0; i < playlists.length; i++){
        //     submit2.push(document.getElementById(`checkbox${i}`).checked)
        //     if (submit1[i+1] !== document.getElementById(`checkbox${i}`).checked){
        //         setTimeout(()=>{
        //         passPlaylist(i,{images: current_track.album.images, uri: current_track.uri, name: current_track.name, track_number: 0, duration_ms: duration, artists: current_track.artists})
        //         // console.log(playlists[i].tracks)
        //         fetch(`http://localhost:8888/auth/update/${playlists[i].playlist_id}`, {
        //                  method: 'POST',
        //                  headers: {"Content-Type":"application/json"},
        //                  body: JSON.stringify({code: 'hi'})
        //              })
        //         },1000)
        //     }
        // }
        // console.log(submit2)
        // setLiked_songs({tracks: [{album_id: current_track.album.uri, images: current_track.album.images, artists: current_track.artists, duration_ms: duration, uri: current_track.uri, name: current_track.name}, ...liked_songs.tracks]})
        // var parts = current_track.album.uri.split(':');
        // var lastSegment = parts.pop() || parts.pop();
        // fetch(`http://localhost:8888/auth/update`, {
        //     method: 'POST',
        //     headers: {"Content-Type":"application/json"},
        //     body: JSON.stringify({album_id: lastSegment, images: JSON.stringify(current_track.album.images), artists: JSON.stringify(current_track.artists), duration: duration, track_id: current_track.id, name: current_track.name})
        // })
    //}
    // const closeIcon = (
    //     <img src={escape} style={{height: '44px', width: '44px'}}/>
    // )

{/* <div id="snackbar">Added to Liked Songs <button style={{border: 'none'}} onClick={function handleClick(){
                        onOpenModal()
                    }}>Change</button></div>
                    <div>             */}
                        {/* <Modal open={open} onClose={onCloseModal} center classNames={{overlay: 'customOverlay', modal: 'customModal'}} closeIcon={closeIcon}>
                            <div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"  style={{height: '100px', width: '100px', marginRight: '50px'}}/>
                                <h3>Liked Songs</h3>
                                {/* <button>{(liked_songs?.tracks?.find((e)=>e.uri === current_track.uri) === undefined ? "Add" : "Remove")}</button> */}
                                {/* <input id='checkbox' type='checkbox' ></input>
                                {open ? (()=> 
                                    setTimeout(()=>{
                                        (document.getElementById('checkbox') as HTMLInputElement ).checked = true
                                        submit1.push((document.getElementById('checkbox') as HTMLInputElement).checked)
                                    },300)
                                    
                                )() : null}
                                
                            </div> */}
                            {/* {playlists.map((a: any,i: any) =>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                <img className="fade-in-image" src={a.images.length == 1 ? a.images.map((s:any) => s.url) : a.images.filter((s:any) => s.height == 300).map((s:any) => s.url)} alt={a.name} style={{height: '100px', width: '100px', marginRight: '50px'}}/>
                                <h3>{a.name}</h3>
                                <input id={"checkbox" + i} type='checkbox'></input>
                                {open ? (()=>
                                    setTimeout(()=>{
                                        a.tracks?.find((e: any)=>e.uri === current_track?.uri) === undefined ? null : (document.getElementById(`checkbox${i}`) as HTMLInputElement ).checked = true
                                        submit1.push((document.getElementById(`checkbox${i}`) as HTMLInputElement).checked)
                                    },300)
                                    
                                )() : null}
                                </div>    
                            )} */}
                            {/* </div>                               
                        </Modal>
                    </div>  */}