import { useState, useEffect } from "react";
import Track from "../components/Track/Track";
import Card from "../components/Card/Card";
import Loading from '../components/Loading/Loading.jsx';

export default function Artist() {
  var parts = window.location.href.split('/');
  var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  
  const [loading, setLoading] = useState(false)
  const [artists, setArtists] = useState([])
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
      setLoading(false)
      setArtists(tempArtists)

    }
    assignArtists()
    
  }, []);
  var count = 1
  const listTTracks = artists.tracks?.tracks.map(t =>
    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
    <p style={{marginRight: '20px'}}>{count}</p> 
    <img src={t.album?.images.filter(t => t.height == 64).map(s => s.url)} />
    <Track 
      uri={t.uri}
      name={t.name}
      number={t.track_number}
      duration={t.duration_ms}
    />
    <p hidden>{count++}</p>
    </div>
  )
  const listItems = artists.albums?.items.map(a => 
    <Card
      // key={a.id}
      id={a.album_id}
      uri={a.uri}
      image={a.images.filter(t=>t.height == 300).map(s => s.url)}
      name={a.name}
      artist={a.artists.map(t => t.name)}
      a_id={a.artists.map(t => t.id)}
    />
  )
  

  return (
    <div style={{marginBottom: '80px'}}>
        {loading ? <Loading yes={true} /> : (
          <>
        <h1>{artists.artists?.name}</h1>
        <img src={artists.artists?.images.filter(t=>t.height == 320).map(s => s.url)} />
        <h4>{artists.artists?.followers.total} followers</h4>
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
        
        
        {/* {console.log(artists)} */}
        </>
      )}
    </div>
  )
}
