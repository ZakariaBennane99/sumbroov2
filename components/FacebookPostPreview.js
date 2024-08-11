import React from 'react';
import ReactPlayer from "react-player";

const FacebookPostPreview = ({ text, imgUrl, videoUrl }) => {

    const mediaUrls = [...videoUrl, ...imgUrl];
    const firstColumnItems = mediaUrls.slice(0, 2);
    const secondColumnItems = mediaUrls.slice(2, 5);
    const remainingItemCount = Math.max(0, mediaUrls.length - 5);
    // <img src='/next-img-insta.svg' onClick={prevMedia} alt='next-image-' />

    const firstRowItems = mediaUrls.slice(0, 1);
    const secondRowItems = mediaUrls.slice(1, 4);

    function parseText(text) {
        const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/gi;
        const words = text.split(' ');
        return words.map((word, k) => {
          if (word.startsWith('#') || urlRegex.test(word)) {
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

    return (
        <div className="facebookPostPreview">
            <div className='fb-head'>
                <div className='logo'>
                    <img src='/fb-sample.svg' alt='facebook-logo'/>
                    <div>
                        <p>Facebook</p>
                        <p>Just now</p>
                    </div>
                </div>
                <img src='/3dots.svg' alt='3-dots' id='dots'/>
            </div>
            <div className='fb-body'>
                {text && <p>{text.map((line, i) => <p key={i}>{parseText(line)}</p>)}</p>}
                    {mediaUrls.length > 4 ?
                    <div className='media-grid-columns'>
                        <div className='first-column'>
                            {firstColumnItems.map((media, i) => (
                                media.type === 'video' ?
                                <div className="react-player-container" key={i}>
                                    <ReactPlayer className="react-player-wrapper" url={media.url} width='100%' height='100%' controls={true} />
                                </div> :
                                <img key={i} src={media.url} alt="Uploaded content" />
                            ))}
                        </div>
                        <div className='second-column'>
                            {secondColumnItems.map((media, i) => (
                                media.type === 'video' ?
                                <div className="react-player-container" key={i}>
                                    <ReactPlayer className="react-player-wrapper" url={media.url} width='100%' height='100%' controls={true} />
                                </div> :
                                <img key={i} src={media.url} alt="Uploaded content" style={{
                                    filter: mediaUrls.length > 5 && secondColumnItems.length - 1 === i ? 'brightness(50%)' : 'brightness(100%)',
                                }} />
                            ))}
                            {remainingItemCount > 0 && (
                                <span className='more-items'>
                                    +{remainingItemCount}
                                </span>
                            )}
                        </div>
                    </div>
                   : mediaUrls.length < 5 && mediaUrls.length > 1 ?
                    <div className='media-grid-rows'>
                        <div className='first-row'>
                            {firstRowItems.map((media, i) => (
                                media.type === 'video' ?
                                <div className="react-player-container" key={i}>
                                    <ReactPlayer className="react-player-wrapper" url={media.url} width='100%' height='100%' controls={true} />
                                </div> :
                                <img key={i} src={media.url} alt="Uploaded content" />
                            ))}
                        </div>
                        <div className='second-row'>
                            {secondRowItems.map((media, i) => (
                                media.type === 'video' ?
                                <div className="react-player-container" key={i}>
                                    <ReactPlayer className="react-player-wrapper" url={media.url} width='100%' height='100%' controls={true} />
                                </div> :
                                <img key={i} src={media.url} alt="Uploaded content" />
                            ))}
                        </div>
                    </div>
                   : mediaUrls.length === 1 ?
                    (mediaUrls[0].type === 'video' ?
                    <ReactPlayer url={mediaUrls[0].url} controls={true} width='100%' height='fit-content' />
                    :
                    <img src={mediaUrls[0].url} alt="Uploaded content" />) :
                    ''}
            </div>
            <div className='engagement-container'>
                <div>
                    <img src='/fb-like.svg' alt='facebook-like' />
                    <p>Like</p>
                </div>
                <div>
                    <img src='/fb-comment.svg' alt='facebook-comment' />
                    <p>Comment</p>
                </div>
            </div>
        </div>
    );
};

export default FacebookPostPreview;
