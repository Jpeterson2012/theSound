import { useState, useEffect } from "react";
import Track from "../components/Track/Track";
import Card from "../components/Card/Card";
import Loading from '../components/Loading/Loading.jsx';
import './Artist.css'

export default function Artist() {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  
  const [loading, setLoading] = useState(false)
  const [artists, setArtists] = useState([])
  const [artists2, setArtists2] = useState([])
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
      setLoading(true)
      const tempArtists = await fetchArtist()
      setArtists(tempArtists)
      setLoading(false)

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
    // setLoading(false)
    setArtists2(tempArtists2)

  }
  assignArtists2()
    
  }, [lastSegment]);
  var count = 1
  const listTTracks = artists2.tracks?.tracks.map(t =>
    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
    <p style={{marginRight: '20px'}}>{count < 10 ? '0' + count : count}</p> 
    <img src={t.album?.images.filter(t => t.height == 64).map(s => s.url)} />
    <Track 
      uri={t.album.uri}
      name={t.name}
      number={t.track_number}
      duration={t.duration_ms}
      album_name={t.album?.name}
      artist={t.artists}
    />
    <p hidden>{count++}</p>
    </div>
  )
  const listItems = artists2.albums?.items.map(a => 
    <Card
      // key={a.id}
      id={a.id}
      uri={a.uri}
      image={a.images.filter(t=>t.height == 300).map(s => s.url)}
      name={a.name}
      artist={a.artists.map(t => t.name)}
      a_id={a.artists.map(t => t.id)}
    />
  )
  

  return (
    <>
    { loading ? <Loading yes={true} /> :
    <div style={{marginTop: '140px',marginBottom: '80px'}}>
      <h1>{artists.artists?.name}</h1>
        {/* <img src={artists.artists?.images.filter(t=>t.height == 320).map(s => s.url)} /> */}
        <img className="fade-in-image" src={artists.artists?.images.length == 0 ? 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' : artists.artists?.images[1]?.url} alt={artists.artists?.name} style={{height: '320px', width: '320px'}} />
        <h4>{artists.artists?.followers.total.toLocaleString()} followers</h4>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <p>Genres:</p>
            {artists.artists?.genres.map(s => <p>{s}</p>)}
        </div>
        
            <p>Top Tracks</p>
            {listTTracks}
            <p>Albums:</p>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '40px'}}>
                {listItems}
            </div>
          
        
    </div>
    }
    </>
  )
}
