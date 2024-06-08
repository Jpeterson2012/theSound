import { useState, useEffect } from "react";
import Card from "../components/Card/Card";

function customRender(name, item){
    return (
        <>
            <h2>{name}</h2>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingTop: '15px',                                                                                                                                                                                          
            }}>
                {item}
            </div>
        </>
        
    )
}

export default function Discover() {

    const [releases, setReleases] = useState([])
    const [categories, setCategories] = useState([])
    const [fplaylists, setFplaylists] = useState([])

    useEffect (() => {
        const rel = sessionStorage.getItem("releases")
        const cat = sessionStorage.getItem("categories")
        const fplay = sessionStorage.getItem("fplaylists")
        if (rel && cat && fplay){
            setReleases(JSON.parse(rel));
            setCategories(JSON.parse(cat))
            setFplaylists(JSON.parse(fplay))
        }

        else {
            const fetchCategories = async () => {
                const resp = await fetch('http://localhost:8888/auth/categories')
                const data = await resp.json()
                setCategories(data)
                sessionStorage.setItem("categories", JSON.stringify(data))
            }
            fetchCategories()

            const fetchDiscover = async () => {
                try {
                    var temp = await fetch('http://localhost:8888/auth/discover')
                .then((res) => {
                    return res.json();
                }).then((data) => {return data})
                    return temp
                }
                catch (err) {}
            }
            const assignDiscover = async () => {
            const tempDiscover = await fetchDiscover()
            setReleases(tempDiscover.releases)
            setFplaylists(tempDiscover.fplaylists)
                
            sessionStorage.setItem("releases", JSON.stringify(tempDiscover.releases))
            sessionStorage.setItem("fplaylists", JSON.stringify(tempDiscover.fplaylists))
            
            }
            assignDiscover()
        }

    }, []);

    const listCategories = categories?.map(a =>
        <div style={{width: '200px',height: '305px', marginBottom: '50px'}}>

            <img src={a.icons.map(s => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
            <h4><b>{a.name}</b></h4>
                 
        </div>
    )

    const listReleases = releases.albums?.items.map(a => 
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
    const listPlaylists = fplaylists.playlists?.items.map(a =>
        <div className="card" style={{width: '200px',height: '305px', marginBottom: '50px', background: a.primary_color}}>

            <img src={a.images.map(s => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
            <div className="container">
                 <h4><b>{a.name}</b></h4>
                 <p><b>{a.description}</b></p>
            </div>
            
        </div>
    )


    return (
        <>
        {customRender("Categories", listCategories)}
        {customRender("New Releases", listReleases)}
        {customRender("Popular Playlists", listPlaylists)}
        </>
    )
}