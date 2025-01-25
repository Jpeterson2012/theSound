import './Spin.css'
import { useInterval } from '../Seekbar/SeekBar'

function randColor(){
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
}
let color1 = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)'
let color2 = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
let color3 = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")

function Spin(is_active:any, is_paused:any,img:any, found:any){
        
    
        // useInterval(() => {            
        //         document.getElementById('label')!.style.fill = randColor()
        //         document.getElementById('label2')!.style.fill = randColor()
            
        // },120000)
    

    let temp = (() => {
        if (found) return <div className='svgImage' >{found}</div>
        else return <img className='svgImage' src={img} />
    })
    
    return (
        <div className='svgContainer'>
        {temp()}
        <svg id='svg1' viewBox="0 0 400 400">
              <g id="record"  style={!is_active ? {animationPlayState: 'paused'} :  is_paused ? {animationPlayState: 'paused'} : ({animationPlayState: 'running'})}>
              <circle r="200" cx="200" cy="200" />
              <circle className="line1" r="180" cx="200" cy="200" />
              <circle className="line2" r="160" cx="200" cy="200" />
              <circle className="line3" r="140" cx="200" cy="200" />
              <circle id="label" cx="200" cy="200" r="100" style={{fill: color3}}/>
              <text className="writing" y="160" x="165">TheSound </text>  
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" >{sessionStorage.getItem("name") ? (sessionStorage.getItem("name")!.length > 49 ? (sessionStorage.getItem("name")!.substring(0,25) + "...") : sessionStorage.getItem("name")) : null}</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </div>
    )
}
function Spin2(is_active:any, is_paused:any){
    //Spin for footer bar
    return (
        <>
        <svg id='svg2' viewBox="0 0 400 400">
              <g id="record2"  style={!is_active ? {animationPlayState: 'paused'} :  is_paused ? {animationPlayState: 'paused'} : ({animationPlayState: 'running'})}>
              <circle r="200" cx="200" cy="200" />
              <circle className="line1" r="180" cx="200" cy="200" />
              <circle className="line2" r="160" cx="200" cy="200" />
              <circle className="line3" r="140" cx="200" cy="200" />
              <circle id="label2" cx="200" cy="200" r="100" style={{fill: color2}}/>
              <text className="writing" y="160" x="165">TheSound</text>  
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" >TheSound</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </>
    )
}

function Spin3(){
    //Spin for footer bar
    return (
        <>
        <svg id='svg3' viewBox="0 0 400 400">
              <g id="record3" style={{animationPlayState: 'running'}}>
              <circle r="200" cx="200" cy="200" />
              <circle className="line4" r="180" cx="200" cy="200" />
              <circle className="line5" r="160" cx="200" cy="200" />
              <circle className="line6" r="140" cx="200" cy="200" />
              <circle id="label2" cx="200" cy="200" r="100" style={{fill: '#d093e5'}}/>
              <text className="writing" y="160" x="165">TheSound</text>  
              <text className="writing" y="230" x="115" textLength="170" lengthAdjust="spacing" >Loading...</text>    
              <circle id="dot" cx="200" cy="200" r="6" />
              </g>
            </svg>
        </>
    )
}

export{ Spin,Spin2,Spin3 }