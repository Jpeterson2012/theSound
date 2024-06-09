import { useState, useEffect } from "react";
import Track from "../components/Track/Track";
import Card from "../components/Card/Card";
import Loading from '../components/Loading/Loading.jsx';

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
    setLoading(true)
    const tempArtists2 = await fetchArtist2()
    setLoading(false)
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
    <div style={{marginTop: '170px',marginBottom: '80px'}}>
      <h1>{artists.artists?.name}</h1>
        <img src={artists.artists?.images.filter(t=>t.height == 320).map(s => s.url)} />
        <h4>{artists.artists?.followers.total} followers</h4>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <p>Genres:</p>
            {artists.artists?.genres.map(s => <p>{s}</p>)}
        </div>
        {loading ? <Loading yes={true} /> : (
          <>
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
