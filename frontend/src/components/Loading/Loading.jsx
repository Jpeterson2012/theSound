import './Loading.css'

export default function Loading ({yes}) {
    return (
        <>
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
            </div>
            {yes ? <h2>Preparing your experience...</h2> : null}
        </>
    )
}

// https://codepen.io/MaryG/pen/wJMMdw