import { useState } from 'react'
import './App.css'
import Video from './Video'
import reactLogo from './assets/react.svg'


function App() {
  return (
    <>
      <div className='video-container'>
        <Video title="Видео 1" channelName="Vsadnik" img={reactLogo} />
      </div>
    </>
  )
}

export default App