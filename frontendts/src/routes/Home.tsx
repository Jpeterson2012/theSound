//sessionstorage items created: cusername, albums, playlist_name, sortVal, psortVal
import './Home.css'
import 'react-responsive-modal/styles.css';
import { useState, useEffect, useContext } from "react";
import { UsePlayerContext } from '../hooks/PlayerContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { imageRender } from "../components/ImageRender/ImageRender.tsx";
import { useGetAlbumsQuery, useGetPlaylistsQuery, useGetAudiobooksQuery, useGetPodcastsQuery, useDeleteAlbumMutation,useDeletePlaylistMutation } from "../App/ApiSlice.ts";
import Card from "../components/Card/Card.tsx";
import escape from '../images/escape.jpg'
import MySnackbar from "../components/MySnackBar.tsx";
import dots from '../images/dots.png'
import ButtonScroll from "../components/ButtonScroll/ButtonScroll.tsx";
import Loading from '../components/Loading/Loading.tsx';
import Loading3 from '../components/Loading3/Loading3.tsx'

function generatePassword() {
  var length = 22,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function Albums(listRecent:any,listItems: any){
  return(
    <div style={{marginTop: '100px'}}>
      <p style={{fontWeight: 'bolder', fontSize: '25px'}} >{JSON.parse(localStorage.getItem("recent")!) && "Jump Back In"}</p>
      <div style={{maxWidth: '95vw', overflowX: 'auto', marginBottom: '50px'}}>        
        {listRecent}
      </div>
      <div className="albumContainer">      
        {listItems}
      </div>
    </div>
  )
}
function albumSort(setSorted: any){
  let temp = document.getElementById('dropdown-content')!
  return(
    <>
      <button className="theme" onClick={function handleClick(){
        temp.style.display = 'none';
        setSorted(1)
        sessionStorage.setItem('sortVal','1')
      }}>A-Z</button>

      <button className="theme" onClick={function handleClick(){      
        temp.style.display = 'none';
        setSorted(2)
        sessionStorage.setItem('sortVal','2')
      }}>Z-A</button>

      <button className="theme" onClick={function handleClick(){    
        temp.style.display = 'none';  
        setSorted(3)
        sessionStorage.setItem('sortVal','3')
      }}>Artist A-Z</button>

      <button className="theme" onClick={function handleClick(){   
        temp.style.display = 'none';   
        setSorted(4)
        sessionStorage.setItem('sortVal','4')
      }}>Artist Z-A</button>
    </>
  )
}
function Playlists(navigate: any, listPlaylists: any){
  return(
    <div className="playlistContainer">
      <a onClick={function handleClick() {
        sessionStorage.setItem("playlist_name", "Liked Songs")
        sessionStorage.setItem("uplist", "true")
        navigate('/app/playlist/likedsongs')
      }}>
        <div style={{display: 'flex', alignItems: 'center', animation: 'fadeIn 0.5s', marginLeft: '40px'}}>
          <img className="likedSongImg" src="https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg" alt="Liked Songs"/>
          <h2>Liked Songs</h2>
        </div>
      </a>
      {listPlaylists}
    </div>
  )
}
function playlistSort(setPSorted: any){
  let temp = document.getElementById('dropdown-content')!
  return(
    <>
      <button className="theme" onClick={function handleClick(){      
        temp.style.display = 'none';
        setPSorted(1)
        sessionStorage.setItem('psortVal','1')
      }}>A-Z</button>

      <button className="theme" onClick={function handleClick(){      
        temp.style.display = 'none';
        setPSorted(2)
        sessionStorage.setItem('psortVal','2')
      }}>Z-A</button>
    </>
  )
}
function Podcasts(podcasts:any){
  const listItems = podcasts?.items.map((a:any, i:any) =>
    <a key={i} onClick={function handleClick(){
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
      <div className="audioPodcast">
        <img className="fade-in-image2" src={a.show.images.length === 1 
            ? a.show.images.map((s: any) => s.url) 
            : a.show.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} alt={a.show.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>

        <h2>{a.show.name}</h2>
      </div>
    </a>
  )
  
  return(
    <div style={{marginTop: '10vw', paddingBottom: '100px'}}>
      {listItems}
    </div>    
  )
}
function Audiobooks(audiobooks:any){
  const listItems = audiobooks?.items.map((a:any,i:any) =>
    <a key={i} onClick={function handleClick(){        

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
      <div className="audioPodcast">
        <img className="fade-in-image2" src={a.images.length === 1 
            ? a.images.map((s: any) => s.url) 
            : a.images.filter((s: any) => s.height == 300).map((s: any) => s.url)} alt={a.name} style={{height: '300px', width: '300px', marginRight: '50px'}}/>

        <h2>{a.name}</h2>
      </div>
    </a>
  )
  
  return(
    <div style={{marginTop: '10vw', paddingBottom: '100px'}}>      
      {listItems}
    </div>
    
  )
}

export default function Home({setIsLoading2}: any) {
  const navigate = useNavigate()
  const [html, setHtml] = useState<any>(null)
  const [sorted, setSorted] = useState(+sessionStorage.getItem('sortVal')!)
  const [psorted, setPSorted] = useState(+sessionStorage.getItem('psortVal')!)
  const [filter_val, setFilter_val] = useState<string>('')        
    
  const {data: albums = [],isSuccess: albumSuccess} = useGetAlbumsQuery()    
  const {data: podcasts, isSuccess: podSuccess} = useGetPodcastsQuery()
  const {data: audiobooks, isSuccess: audSuccess} = useGetAudiobooksQuery()    

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const [deleteAlbum, {isSuccess: delsuccess}] = useDeleteAlbumMutation()
  const [deletePlaylist] = useDeletePlaylistMutation()

  const[opensnack, setOpensnack] = useState(false)
  const {playerState} = useContext(UsePlayerContext);

  const onOpenModal = () => {setOpen(true)}
  const onCloseModal = () => {
    setOpen(false)
    let pform = document.getElementById('formPlaylist')
    pform?.addEventListener("submit", (e) => {
      e.preventDefault()
      let name = (document.getElementById('first') as HTMLInputElement)
      let desc = (document.getElementById('second') as HTMLInputElement)
      let opt1 = (document.getElementById('option1') as HTMLInputElement)
      // let opt2 = (document.getElementById('option2') as HTMLInputElement)
      if (name!.value == "") console.error("Error")
      else{
        let pID = generatePassword()
        // console.log(name.value)
        // console.log(desc.value)
        // console.log(opt1.checked)
        // console.log(opt2.checked)
        fetch(import.meta.env.VITE_URL + `/users/playlist`, {
          method: 'POST',
          headers: {"Content-Type":"application/json"},
          credentials: "include",
          body: JSON.stringify({id: pID, name: name.value, description: desc.value === "" ? "null" : desc.value, public: opt1.checked})                                        
        }).then(() => {refetch()})
      }
    })
  }

  const closeIcon = (
    <img src={escape} style={{height: '44px', width: '44px'}}/>
  )
  
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

  const {data: playlists = [], isSuccess: playSuccess, isFetching, refetch} = useGetPlaylistsQuery()
  
  let ready = albumSuccess && podSuccess && audSuccess && playSuccess

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

    (ready && !loading) && setIsLoading2(false)            
    switch(sessionStorage.getItem('home')){
      case 'album':
        setHtml(Albums(listRecent(),window.innerWidth < 500 ? listItems2() : listItems ))
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
      default:
        setHtml(Albums(listRecent(),window.innerWidth < 500 ? listItems2() : listItems ))
    }
    setLoading(false)                  
    
  }, [ready,isFetching, sorted,psorted,delsuccess,filter_val,localStorage.getItem("recent")!,playerState.is_paused]);
    
  const listItems = sortedAlbums()
    ?.filter((album:any)=> album.name.toLowerCase().includes(filter_val.toLowerCase()) || album.artists[0].name.toLowerCase().includes(filter_val.toLowerCase()) )
    .map((album: any, index:any) =>
      <div key={index}>

        <div className="removeContainer" style={{width: '20px'}}>

          <button className="removeAlbum" id={"removeAlbum" +  index} onClick={function handleClick(){
            setOpensnack(true)        
            document.getElementById('removeAlbum' + index)!.style.display = 'none'
            setTimeout(() => { deleteAlbum({aID: album.album_id}) },300)
          }}>Remove</button>

          <img src={dots} className="removeImg" onClick={function handleClick(){
            let temp = document.getElementById('removeAlbum' + index)!
            if (temp.style.display === 'block') temp.style.display = 'none'
            else {
              temp.style.display = 'block'
            }
          }} style={{marginBottom: '20px', transform: 'rotate(90deg)', height: '30px', width: '30px', margin: '0px', cursor: 'pointer'}} />      
        </div>

        <Card      
          id={album.album_id}
          uri={album.uri}
          image={album.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
          name={album.name}
          artist={album.artists.map((t: any) => t.name)}
          a_id={album.artists.map((t: any) => t.id)}
          key={album.album_id}
          paused={playerState.is_paused}
        />
      </div>
  )

  function chunkArray(array: any, size: any) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }
  
  function listItems2(){
    let rowtemp = sortedAlbums()?.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase()) || a.artists[0].name.toLowerCase().includes(filter_val.toLowerCase()) )
    let rows = chunkArray(rowtemp, 10)
    return (
      <>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((item: any, itemIndex: any) => (
              <div key={itemIndex} className="item">
                
                <div className="removeContainer" style={{width: '20px'}}>
                  <button className="removeAlbum" id={"removeAlbum" +  (rowIndex * 10) + itemIndex} onClick={function handleClick(){
                    setOpensnack(true)        
                    document.getElementById('removeAlbum' + rowIndex * itemIndex + itemIndex)!.style.display = 'none'
                    setTimeout(() => { deleteAlbum({aID: item.album_id}) },300)
                  }}>Remove</button>
                  <img src={dots} className="removeImg" onClick={function handleClick(){                    
                    let temp = document.getElementById('removeAlbum' + (rowIndex * 10) + itemIndex)!
                    if (temp.style.display === 'block') temp.style.display = 'none'
                    else {
                      temp.style.display = 'block'
                    }
                  }} style={{marginBottom: '20px', transform: 'rotate(90deg)', height: '30px', width: '30px', margin: '0px', cursor: 'pointer'}} />      
                  </div>

                  <Card      
                    id={item.album_id}
                    uri={item.uri}
                    image={item.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
                    name={item.name}
                    artist={item.artists.map((t: any) => t.name)}
                    a_id={item.artists.map((t: any) => t.id)}
                    key={item.album_id}
                    paused={playerState.is_paused}
                  />                  

              </div>
            ))}
          </div>
        ))}
      </>
    )
  }
    
  const listPlaylists = sortedPlaylists()?.filter((a:any)=> a.name.toLowerCase().includes(filter_val.toLowerCase())).map((a: any,i:any) =>
    <div style={{display: 'flex', gap: '20px', alignItems: 'center'}} key={i}>

      <div className="removePContainer" style={{width: '20px'}}>
        <button className="removePlay" id={"removePlay" + i} onClick={function handleClick(){
          setOpensnack(true)     
          document.getElementById('removePlay' + i)!.style.display = 'none'   
          setTimeout(() => { deletePlaylist({pID: a.playlist_id}) },300)
          setTimeout(()=>{refetch() },400)
        }}>Remove From Library</button>
        <img src={dots} className="removeImg" onClick={function handleClick(){
          let temp = document.getElementById('removePlay' + i)!
          if (temp.style.display === 'block') temp.style.display = 'none'
          else temp.style.display = 'block'
        }}/>      
      </div>

      <a onClick={function handleClick() {
        
        sessionStorage.setItem("uplist", "true")
        sessionStorage.setItem("playlist_name", a.name)
        navigate(`/app/playlist/${a.playlist_id}`)
      }}>

        <div style={{display: 'flex', alignItems: 'center', animation: 'fadeIn 0.5s'}}>
        {imageRender(a,300,300,50)}        
        <h2>{a.name}</h2>
        </div>
              
        <br></br>      
      </a>
      
    </div>
  )
  function listRecent(){
    let temp: any = []
    let temp2 = JSON.parse(localStorage.getItem("recent")!)        

    if (temp2){          
      Object.keys(temp2).forEach((val:any) => temp.push( {"id": temp2[val].id,"name": temp2[val].name,"artists": temp2[val].artists,"img": temp2[val].images.filter((t: any)=>t.height == 640)[0]} ))    
      return (
        <div style={{display: 'flex'}} >
          {temp.map((val:any,i: number) => 
            <div key={i}>        
              <a onClick={function handleClick(){
              // console.log(val)
              // console.log(sessionStorage.getItem("name"))

                let found = (albums?.find((e: any) => e?.album_id === val.id) || (albums?.find((e: any) => e?.name === val.name)))            
                found === undefined ? sessionStorage.setItem("albumStatus", "notuser") : (sessionStorage.setItem("albumStatus","user"),val.id === found?.album_id ? null : val.id = found?.album_id)
                sessionStorage.setItem("image", val.img.url)
                sessionStorage.setItem("artist", JSON.stringify(val.artists.map((t: any) => t.name)))
                sessionStorage.setItem("artist_id", JSON.stringify(val.artists.map((t: any) => t.uri.split(':').pop())))
                navigate(`/app/album/${val.id}`)
              }}>
                <div style={{display: 'flex', flexDirection: 'column'}} >
                  {(!playerState.is_paused && sessionStorage.getItem('name') === val.name) && <Loading3 />}
                  <img key={i} src={val.img.url} style={{width: '150px', height: '190px', borderRadius: '10px'}} /> 
                </div>           
              </a>          
            </div>
          )}
        </div>
      )
    }
    else{
      return (
        <>
        </>
      )
    }
  }

  return (
    <>
      {!ready && !loading ? <Loading /> : (
        <>      
          <div className="homeContainer">
            <div className="filterHome" style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
                {/* Working on filter function */}
              <input 
                type='text' 
                className='filterTrack' 
                id='filterTrack' 
                placeholder='Looking for something?' 
                style={{borderRadius: '13px',width: '170px', height: '40px', marginLeft: '100px', backgroundColor: 'rgb(90, 210, 216)', color: 'black', fontWeight: 'bolder'}}  
                onChange={function handleChange(e){
                  let temp = e.target.value
                  setFilter_val(temp)
                }} 
              />
              <button style={{backgroundColor: '#7a19e9', color: 'rgb(90, 210, 216)', width: '60px', height: '40px', padding: '0px 5px'}} onClick={function handleClick(){
                setFilter_val('');          
                (document.getElementById('filterTrack') as HTMLInputElement)!.value = ''
              }}>Clear</button>                                    
            </div>
            <div className="buttonContainer">                        
              <button className="homeButtons" onClick={() => {setHtml(Albums(listRecent(),window.innerWidth < 500 ? listItems2() : listItems )),sessionStorage.setItem('home','album')}}>Albums</button>
              <button className="homeButtons" onClick={() => {setHtml(Playlists(navigate, listPlaylists)), sessionStorage.setItem('home','playlist')}}>Playlists</button>
              <button className="homeButtons" onClick={() => {setHtml(Podcasts(podcasts)), sessionStorage.setItem('home', 'podcast') }}>Podcasts</button>
              <button className="homeButtons" onClick={() => {setHtml(Audiobooks(audiobooks)), sessionStorage.setItem('home', 'audiobook')}}>AudioBooks</button>
          
              {/* <button className="homeButtons" onClick={() => {setHtml(localSong()), sessionStorage.setItem('home', 'local') }}>Local</button> */}
              <p style={sessionStorage.getItem('home') === "playlist" ? {display: "inline"} : {display: "none"}} className="addPlaylist" onClick={function handleClick(){
                onOpenModal()                            
              }}>+</p>

              <div className="dropdown" id="dropdown">              
                <Modal modalId='modal4' open={open} onClose={onCloseModal} center closeIcon={closeIcon}>
                  <div style={{color: 'white', marginLeft: '35%',fontWeight: 'bolder',fontSize: '20px'}} >New Playlist</div>
                  <form action=""  id="formPlaylist">
                    <label htmlFor="first">
                      Name:
                    </label>
                    <input type="text" id="first" name="first" placeholder="Enter your Playlist Name" required />
                        
                    <label htmlFor="second">
                        Description:
                    </label>
                    <input type="text" id="second" name="second" 
                        placeholder="Optional"/>
                    
                    <div style={{color: 'white', fontWeight: 'bolder',fontSize: '20px'}} >Public</div>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <div>
                        <label htmlFor="option1">True</label>
                        <input type="radio" id="option1" name="third" value="True" defaultChecked style={{width: '18px',height: '18px'}} />
                      </div>  

                      <div>
                        <label htmlFor="option2">False</label>
                        <input type="radio" id="option2" name="third" value="False" style={{width: '18px',height: '18px'}} />
                      </div>  
                    </div>                   

                    <div className="wrap2">
                      <button type="submit" onClick={(() => onCloseModal())}>
                        Submit
                      </button>
                    </div>
                  </form>

                </Modal>

                <button className="dropbtn" onClick={function handleClick(){
                  let temp = document.getElementById('dropdown-content')!
                  // console.log(temp.style.display)
                  if (temp.style.display === 'flex') temp.style.display = 'none'
                  else {
                    temp.style.display = 'flex'
                    temp.style.flexDirection = 'column'
                  }
                }}>Sort</button>
                <div className="dropdown-content" id="dropdown-content">
                  {(!sessionStorage.getItem('home') || sessionStorage.getItem('home') === 'album') && albumSort(setSorted)}
                  {sessionStorage.getItem('home') === 'playlist' && playlistSort(setPSorted)}
                </div>
              </div>
                
            </div>
            
          </div>
            
          {html}      
      
        </>
      )}
      <ButtonScroll />
      {opensnack && <MySnackbar state={opensnack} setstate={setOpensnack} message="Removed From Library"/>}
    </>
  )
}