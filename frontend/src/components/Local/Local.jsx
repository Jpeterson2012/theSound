import ori from '../../local/34-LumaPools.mp3'

export default function Local() {
  let audio = new Audio(ori)

  const start = () => {
    audio.play()
  }
  const stop = () => {
    audio.pause()
  }


  return (
    < div >
      <button onClick={start}>Play</button>
      <button onClick={stop}>Pause</button>
    </div >
  );
}

