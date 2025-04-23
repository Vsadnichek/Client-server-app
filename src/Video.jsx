function Video(props) {
    
    const { title, channelName, img } = props;

    return (
    <div className='video'>
        <img className='video-img' src={img} alt="Video image" />
        <p>{title}</p>
        <p>{channelName}</p>
        <div className='video-footer'>
        <p>Лайки: 0</p>
        <button>Лайк</button>
        </div>
    </div>
  )
}

export default Video