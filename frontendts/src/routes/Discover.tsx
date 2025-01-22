//session storage c_icon, c_name variable created here; use for categories playlist click

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card/Card";
import './Discover.css'

function customRender(name: any, item: any){
    return (
        <>
            <h2 style={{marginLeft: 'auto', marginRight: 'auto'}} >{name}</h2>
            <div className={name} style={{
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
    const navigate = useNavigate()

    const [releases, setReleases] = useState<any>([])
    const [categories, setCategories] = useState([])
    const [fplaylists, setFplaylists] = useState<any>([])

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

    const listCategories = categories?.map((a: any) =>
        <a onClick={function handleClick() {
            sessionStorage.setItem("c_icon", a.icons.map((s: any) => s.url))
            sessionStorage.setItem("c_name", a.name)
            navigate(`/app/categories/${a.id}`)
        }}>
            <div style={{width: '200px',height: '305px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                <img className="fade-in-image" src={a.icons.map((s: any) => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
                <h4 style={{marginTop: '200px'}} ><b>{a.name}</b></h4>
                
            </div>
        </a>
        
    )

    const listReleases = releases.albums?.items.map((a: any) => 
        <Card
          // key={a.id}
          id={a.id}
          uri={a.uri}
          image={a.images.filter((t: any)=>t.height == 300).map((s: any) => s.url)}
          name={a.name}
          artist={a.artists.map((t: any) => t.name)}
          a_id={a.artists.map((t: any) => t.id)}
        />
      )
    const listPlaylists = fplaylists.playlists?.items.map((a: any) =>
        <a onClick={function handleClick() {
            sessionStorage.setItem("p_image", a.images.map((s: any) => s.url))
            sessionStorage.setItem("playlist_name", a.name)
            navigate(`/app/playlist/${a.id}`)
        }}>
            <div className="card" style={{width: '200px',height: '285px', marginBottom: '50px', background: a.primary_color}}>

                <img src={a.images.map((s: any) => s.url)} alt="Avatar" style={{width:'80%',height:'190px'}}/>
                <div className="container">
                    <h4><b>{a.name}</b></h4>
                    <p><b>{a.description}</b></p>
                </div>

            </div>
        </a>
    )


    return (
        <div style={{width: '90vw', position: 'absolute', left: '5vw', top: '9vw'}}>    
            {customRender("Categories", listCategories)}
            {customRender("New Releases", listReleases)}
            {customRender("Popular Playlists", listPlaylists)}        
        </div>        
    )
}