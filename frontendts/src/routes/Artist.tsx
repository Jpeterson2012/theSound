import { useState, useEffect } from "react";
import Track from "../components/Track/Track";
import Card from "../components/Card/Card";
import './Artist.css'
import { Spin3 } from "../components/Spin/Spin.tsx";
import musicBar from "../components/musicBar/musicBar.tsx";

export default function Artist({paused}: any) {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  
  const [loading, setLoading] = useState(true)
  const [artists, setArtists] = useState<any>([])
  const [artists2, setArtists2] = useState<any>([])
  useEffect (() => {
    
    const fetchArtist = async () => {
        try {
            var temp = await fetch(`http://localhost:8888/auth/artists/${lastSegment}`)
          .then((res) => {
            // console.log(res.json())
            return res.json();
          }).then((data) => {return data})
            return temp
          }
          catch (err) {}
    }
    const assignArtists = async () => {      
      const tempArtists = await fetchArtist()
      setArtists(tempArtists)      

    }
    assignArtists()

    const fetchArtist2 = async () => {
      try {
          var temp = await fetch(`http://localhost:8888/auth/artists2/${lastSegment}`)
        .then((res) => {
          // console.log(res.json())
          return res.json();
        }).then((data) => {return data})
          return temp
        }
        catch (err) {}
  }
  const assignArtists2 = async () => {
    // setLoading(true)
    const tempArtists2 = await fetchArtist2()
    setLoading(false)
    // setLoading(false)
    setArtists2(tempArtists2)

  }
  assignArtists2()
    
  }, [lastSegment]);
  var count: number = 1
  const listTTracks = artists2.tracks?.tracks.map((t: any) =>

    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',width: '100%'}}>
      
    {!paused ? <span style={{position: 'absolute', left: '7.5vw'}}>{(sessionStorage.getItem('current') === t.uri || (t.artists?.name === t.name && t.artists?.artists[0].name === t.artist[0].name)) ? musicBar() : null}</span> : null}
    <p style={{marginLeft: '16px',overflow: 'visible'}}>{count < 10 ? '0' + count : count}</p> 
    <img src={t.album?.images.filter((t: any) => t.height == 64).map((s: any) => s.url)} style={{marginLeft: '20px'}} />
    <Track 
      uri={t.album.uri}
      name={t.name}
      number={t.track_number}
      duration={t.duration_ms}
      album_name={t.album?.name}
      artist={t.artists}
      t_uri={t.uri}   
      customWidth={80}   
    />
    <p hidden>{count++}</p>
    </div>
  )
  const listItems = artists2.albums?.items.filter((a: any) => a.album_type === 'album').map((a: any) =>
    <div> 
      <h5>{a.release_date}</h5>
    <Card
      // key={a.id}
      id={a.id}
      uri={a.uri}
      image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
      name={a.name}
      artist={a.artists.map((t: any) => t.name)}
      a_id={a.artists.map((t: any) => t.id)}
    />
    </div>
  )
  
  const listItems2 = artists2.albums?.items.filter((a: any) => a.album_type === 'single').map((a: any) =>
    <div>
      <h5>{a.release_date}</h5>
    <Card
      // key={a.id}
      id={a.id}
      uri={a.uri}
      image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
      name={a.name}
      artist={a.artists.map((t: any) => t.name)}
      a_id={a.artists.map((t: any) => t.id)}
    />
    </div>
  )

  const listItems3 = artists2.albums?.items.filter((a: any) => a.album_type === 'compilation').map((a: any) =>
    <div>
      <h5>{a.release_date}</h5> 
    <Card
      // key={a.id}
      id={a.id}
      uri={a.uri}
      image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
      name={a.name}
      artist={a.artists.map((t: any) => t.name)}
      a_id={a.artists.map((t: any) => t.id)}
    />
    </div>
  )
  

  return (
    <div style={{width: '95vw'}}>
    { loading ? Spin3() :
    <div style={{marginTop: '40px',marginBottom: '80px'}}>
      <h1>{artists.artists?.name}</h1>
        {/* <img src={artists.artists?.images.filter(t=>t.height == 320).map(s => s.url)} /> */}
        <img className="fade-in-image" src={artists.artists?.images.length == 0 ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' : artists.artists?.images[1]?.url} alt={artists.artists?.name} style={{height: '320px', width: '320px'}} />
        <p style={{margin: '20px auto'}} >{artists.artists?.followers.total.toLocaleString()} followers</p>
        <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <p className="headers">Genre(s):</p>
            {artists?.artists?.genres.length > 0 ? artists.artists?.genres.map((s: any) => <p>{s}</p>) : <p>Music I guess. Idk</p>}
        </div>
        
            <p className="headers">Top Tracks</p>
            <div>
            {listTTracks}
            </div>
            

            <div>
            <p className="headers">Albums</p>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '40px'}}>
                {listItems}
            </div>
            </div>
            

            <div >
            {listItems2?.length !== 0 ? <p className="headers" >Singles</p> : null}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center'}}>
                {listItems2}
            </div>
            </div>
            
            {listItems3?.length !== 0 ? <p className="headers">Compilations</p> : null}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '40px'}}>
                {listItems3}
            </div>
            
          
        
    </div>
    }
    </div>
  )
}
