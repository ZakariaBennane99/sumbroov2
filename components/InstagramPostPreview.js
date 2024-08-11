import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';


const InstagramPostPreview = ({ text, imgUrl, videoUrl }) => {

    const mediaList = [...videoUrl, ...imgUrl];

    const [mediaIndex, setMediaIndex] = useState(0);

    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(false);

    const playerRef = useRef();

    const nextMedia = () => setMediaIndex((mediaIndex + 1) % mediaList.length);
    const prevMedia = () => setMediaIndex((mediaIndex - 1 + mediaList.length) % mediaList.length);

    function parseText(text) {
        const words = text.split(' ');
        return words.map((word, k) => {
          if (word.startsWith('#')) {
            return <span className="hashtag" key={k}>{word}</span>
          } else {
            return word;
          }
        }).reduce((prev, curr, i) => {
          if (i === 0) {
            return [curr];
          } else {
            return [...prev, ' ', curr];
          }
        }, []);
    }

    const togglePlay = () => {
      setPlaying(!playing);
    }

    const toggleMute = (e) => {
      e.stopPropagation();
      setMuted(!muted);
    }

    return (
        <div className="instagramPostPreview">
            <div className='insta-head'>
                <div className='logo'>
                    <img src='/insta-sample.svg' alt='instagram-logo'/>
                    <div>
                        <p>Instagram <img src='/insta-checkmark.svg' alt='instagram-checkmark' /> <span>• 1s</span></p>
                        <p>Planet Earth</p>
                    </div>
                </div>
                <img src='/3dots.svg' alt='3-dots' id='dots'/>
            </div>
            <div className='insta-body'>
                <div className='insta-body-media-wrapper'>
                    <div className="media-slider" style={{ transform: `translateX(-${mediaIndex * 100}%)`, transition: 'transform 0.5s' }}>
                          {mediaList.map((media, index) => (
                            <div className="media-item" key={index}>
                              {media.type === 'video' ? (
                                <div className='video-wrapper' onClick={togglePlay}>
                                  {!playing ? <span className='play-icon-wrapper'><img src='/play.svg' alt='play icon' /></span> : '' }
                                  <ReactPlayer
                                      ref={playerRef}
                                      url={media.url}
                                      muted={muted}
                                      width='330px'
                                      height='220px'
                                      playing={playing && index === mediaIndex} // Only play the video if it&apos;s the current media and the playing state is true
                                      config={{ file: { attributes: { preload: 'auto' } } }}
                                  />
                                  <div className="audio-controller" onClick={toggleMute} >
                                      <img src={muted ? '/sound-off.svg' : '/sound-on.svg'} alt='sound icon' />
                                  </div>
                                </div>
                              ) : (
                                <img src={media.url} alt="Uploaded image" className={`main-imgs ${mediaList.length > 1 ? 'multiple' : ''}`} />
                              )}
                            </div>
                          ))}
                        </div>
                        {mediaList.length > 1 && <img src='/next-img-insta.svg' onClick={prevMedia} alt='next-image' className='next-img-insta-left'/>}
                        {mediaList.length > 1 &&
                          <div className='carousel-dot-wrapper'>
                            {mediaList.map((media, index) => (
                              <span className={`carousel-dot ${index === mediaIndex ? 'active' : ''}`} key={index} />
                            ))}
                          </div>
                        }
                        {mediaList.length > 1 && <img src='/next-img-insta.svg' onClick={nextMedia} alt='next-image' className='next-img-insta-right'/>}
                </div>
                <div className='icons-container'>
                    <div>
                        <img src='/heart.svg' alt='heart' />
                        <img src='/insta-comment.svg' alt='comment' />
                        <img src='/insta-send.svg' alt='send message' />
                    </div>
                    <img src='/insta-save.svg' alt='save post' id='heart' />
                </div>
                {text && <div id='text-wrapper'>{text.map((line, i) => <p key={i} style={{ height: line ? 'auto' : '1em' }}>{i === 0 ? <span id='instagram'>instagram</span> : ''} {parseText(line)}</p>)}</div>}
            </div>
        </div>
    );
};

export default InstagramPostPreview;
