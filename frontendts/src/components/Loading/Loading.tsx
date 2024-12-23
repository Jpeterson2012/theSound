import './Loading.css'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function Loading () {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const dataDone = async () => {
            try {
                var temp = await fetch("http://localhost:8888/auth/callback/emit")
            .then((res) => {
                return res.json();
            })
                return temp
            }
            catch (err) {}
            }
        const fetchBaby = async () => {
            await dataDone()
            setIsLoading(false)
        }
        fetchBaby()
    },[])

    return (
        <>
            {isLoading ? 
            <div className="muzieknootjes">
                <div className="noot-1">
                &#9835; &#9833;
                </div>
                <div className="noot-2">
                &#9833;
                </div>
                <div className="noot-3">
                &#9839; &#9834;
                </div>
                <div className="noot-4">
                &#9834;
                </div>
                <div className="noot-5">
                &#9833; &#9835;
                </div>
                <div className="noot-6">
                &#9835;
                </div>
                <div className="noot-7">
                &#9834; &#9839;
                </div>
                <div className="noot-8">
                &#9839;
                </div>
                <h2>Preparing your experience...</h2>
            </div> : <Navigate to={'/app'} /> }
        </>
    )
}

// https://codepen.io/MaryG/pen/wJMMdw