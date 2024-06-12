import logo from '../../images/logo.png'
import './Logo.css'
import { useNavigate } from 'react-router-dom'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import Track from '../Track/Track';

function userPlaylists(ptracks) {
    var key = 0
    return (
      ptracks?.map(t =>
  
        <div style={{display: 'flex', alignItems: 'center'}}>
            
            <img src={t.album.images.filter(t=>t.height == 64).map(s => s.url)} style={{height: '64px'}}/>
            <Track 
            uri={t.album.uri}
            name={t.name}
            number={t.track_number}
            duration={t.duration_ms}
            album_name={t.album.name}
            />
          <p hidden>{key++}</p>
        </div>
      )
    )
  }

export default function Logo () {
    const navigate = useNavigate()
    const [search, setSearch] = useState([]);
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const closeIcon = (
        <img src='https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg' style={{height: '64px', width: '64px'}}/>
      );
    const lorem = (
        <p>
          Mauris ac arcu sit amet dui interdum bibendum a sed diam. Praesent rhoncus<br></br>
          congue ipsum elementum lobortis. Ut ligula purus, ultrices id condimentum<br></br>
          quis, tincidunt quis purus. Proin quis enim metus. Nunc feugiat odio at<br></br>
          eros porta, ut rhoncus lorem tristique. Nunc et ipsum eu ex vulputate<br></br>
          consectetur vel eu nisi. Donec ultricies rutrum lectus, sit ame feugiat<br></br>
          est semper vitae. Proin varius imperdiet consequat. Proin eu metus nisi.<br></br>
          In hac habitasse platea dictumst. Vestibulum ac ultrices risus.<br></br>
          Pellentesque arcu sapien, aliquet sed orci sit amet, pulvinar interdum<br></br>
          velit. Nunc a rhoncus ipsum, maximus fermentum dolor. Praesent aliquet<br></br>
          justo vitae rutrum volutpat. Ut quis pulvinar est.
        </p>
    )

    return(
        <div style={{display: 'flex', position: 'absolute', right: '140px', top: '30px', alignItems: 'center'}}>
            <h2 style={{marginRight: '900px'}}>{sessionStorage.getItem("username")}</h2>

            <div className="wrap">
                <div className="search">
                    <input type="text" className="searchTerm" id='searchTerm'  placeholder="What are you looking for?" />
                    <button type="button" className="searchButton" onClick={function handleSubmit() {
                        onOpenModal();
                        console.log(document.getElementById("searchTerm").value);
                        const fetchSearch = async () => {
                            const resp = await fetch(`http://localhost:8888/auth/search/${document.getElementById("searchTerm").value}`)
                            // const data = await resp.json()
                            let reader = resp.body.getReader()
                            let result
                            let temp
                            let a = []
                            let decoder = new TextDecoder('utf8')
                            while(!result?.done){
                                result = await reader.read()
                                let chunk = decoder.decode(result.value)
                                console.log(chunk ? JSON.parse(chunk) : {})
                                chunk ? (
                                    temp = JSON.parse(chunk).tracks.items,
                                    a.push(...temp),  
                                    setSearch([...a]) )
                                    : {}
                            }
                            // console.log(data)
                        }
                        fetchSearch()
                         return false
                         }}>
                        <i className="fa fa-search" style={{position: 'absolute', bottom: '9px', right: '14px', color: 'black'}}></i>
                    </button>
                </div>
            </div>
            <a onClick={function handleClick() {navigate('/app/discover')}}>
                <h2>Discover</h2>
            </a>
            <a onClick={function handleClick() {navigate('/app')}}>
                <img style={{width: '80px', height: '80px'}} src={logo} alt="Avatar"/>
            </a>

            <div>
            {/* <button onClick={onOpenModal}>Open modal</button> */}
            <Modal open={open} onClose={onCloseModal} center classNames={{overlay: 'customOverlay', modal: 'customModal'}} closeIcon={closeIcon}>
                {/* <div style={{background: 'black'}}>
                {lorem}
                {lorem}
                {lorem}
                {lorem}     
                </div> */}
                {userPlaylists(search)}
                <br></br>
                {/* <h4 style={{color: 'blue'}}>{search.items?.map(a => a.track?.name)}</h4> */}
                
            </Modal>
            </div>
        </div>
        
    )
}
// location.href='http://localhost:5173/app/'