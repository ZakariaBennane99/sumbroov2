import React from "react";
import Modal from 'react-modal';
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import validator from 'validator';


export default function PinterestPostInput({ setDataForm, 
  noTargetingErrs,
  platform, nicheAndTags, 
  nicheAndTagsErrors,
  publishPost,
  setPublishPost,
  targetErrors,
  dataForm,
  setSuccess }) {

  const [titleChars, setTitleChars] = useState(0)  
  const [descChars, setDescChars] = useState(0)
  const [isServerError, setIsServerError] = useState(false)

  const [postTitle, setPostTitle] = useState(dataForm.postTitle)
  const [pinTitle, setPinTitle] = useState(dataForm.pinTitle)
  const [text, setText] = useState(dataForm.text)
  const [pinLink, setPinLink] = useState(dataForm.pinLink)
  const [imgUrl, setImgUrl] = useState(dataForm.imgUrl);
  const [videoUrl, setVideoUrl] = useState(dataForm.videoUrl);

  // for the inputs errors
  const [pinterestPostErrors, setPinterestPostErrors] = useState({
    postTitle: null,
    pinTitle: null, 
    text: null,
    pinLink: null,
    mediaLink: null
  })

  useEffect(() => {
    if (Object.values(pinterestPostErrors).some(value => Boolean(value)) || 
    Object.values(pinterestPostErrors).every(value => value === null)) {
      setIsOpen(true)
    }
  }, [targetErrors, pinterestPostErrors])

  async function getBlob(blobUrl) {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error fetching the blob:', error);
      throw error;
    }
  }
  
  async function handlePublishRequest() {

    setPublishPost(true)

    const apiUrl = 'https://sumbroo.com/server-api/handle-post-submit/pinterest';

    try {
      const formData = new FormData();
      formData.append('postTitle', postTitle);
      formData.append('pinTitle', pinTitle);
      formData.append('text', text);
      formData.append('pinLink', pinLink);
      if (imgUrl) formData.append('image', await getBlob(imgUrl));
      if (videoUrl) formData.append('video', await getBlob(videoUrl));
      formData.append('niche', nicheAndTags.niche.value);
      formData.append('tags', JSON.stringify(nicheAndTags.tags));
      
      const res = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (res) {
        setPublishPost(false);
        setSuccess(true)
        console.log('The results', res);
      }
  

    } catch (error) {
      setPublishPost(false);
      console.error('Server error', error);
    }

  }
  

  useEffect(() => {

    if (publishPost) {

      const errors = {
        postTitle: null,
        pinTitle: null, 
        text: null,
        pinLink: null,
        mediaLink: null
      };
  
      // Validate postTitle
      if (postTitle.length === 0) {
        errors.postTitle = "Post title is required.";
      }
  
      // Validate pinTitle
      if (pinTitle.length === 0) {
        errors.pinTitle = "Pin title is required.";
      } else if (pinTitle.length < 40) {
        errors.pinTitle = "Pin title should be at least 40 characters.";
      }
  
      // Validate text
      if (text.length === 0) {
        errors.text = "Text is required.";
      } else if (text.length < 100) {
        errors.text = "Text should be at least 100 characters.";
      }
  
      // Validate pinLink
      if (pinLink.length === 0) {
        errors.pinLink = "Pin link is required.";
      } else if (!validator.isURL(pinLink, { require_protocol: false })) {
        errors.pinLink = "Please provide a valid link.";
      }

      if (!imgUrl && !videoUrl) {
        errors.mediaLink = "Please upload a valid image or a video."
      }
  
      // Update pinterestPostErrors state
      setPinterestPostErrors(errors);

      // if there are any errors, set the pusblishPost value to false
      if (Object.values(errors).some(error => error)) {
        setPublishPost(false)
      }

      if (!Object.values(errors).some(error => error) && noTargetingErrs) {
        // here we will send the request to the backend
        handlePublishRequest()
      }

    }

  }, [publishPost])


  useEffect(() => {
    setDataForm({
      postTitle: postTitle,
      pinTitle: pinTitle,
      text: text,
      pinLink: pinLink,
      imgUrl: imgUrl,
      videoUrl: videoUrl
    });
  }, [postTitle , pinTitle, text, pinLink, imgUrl, videoUrl]);


  // for the tooltip
  const [style, setStyle] = useState({
    visibility: 'hidden'
  })
  function handleWarning() {
    setStyle({
        visibility: 'visible'
    })
    setTimeout(() => {
        setStyle({
            visibility: 'hidden'
        })
    }, 1000)
  }

  const [isOpen, setIsOpen] = useState(false);

  const [fileInfo, setFileInfo] = useState({ fileName: '', errors: [] });
  const fileInput = useRef();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = async (e) => {

    setPinterestPostErrors(prev => {
      return {
        ...prev,
        mediaLink: null
      }
    })
    
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    if (files.length > 1) {
      alert('Please select only one file.');
      e.target.value = '';
      return;
    }

    const file = files[0]

    const url = URL.createObjectURL(file);

    let errors;
    if (file.type.startsWith('image/')) {
      // here you start the process to validating
      const err = await imageValidation(file);
      errors = err;
      if (err.length === 0) {
        setVideoUrl(null)
        setImgUrl(url)
      }
    } else if (file.type.startsWith('video/')) {
      const err = await videoValidation(file);
      errors = err;
      if (err.length === 0) {
        setImgUrl(null)
        setVideoUrl(url)
      }
    }

    const fileInfo = { fileName: file.name, errors: errors };

    if (fileInfo.errors.length > 0) {
      setPublishPost(false);
    }
    
    setFileInfo(fileInfo);

  }


  const handleFileClick = () => {
    fileInput.current.click();
  }

  function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  }

  function imageValidation(file) {

    return new Promise((resolve, reject) => {

      let errors = []

      const img = new Image();

      img.onload = function() {
        const aspectRatio = this.naturalWidth / this.naturalHeight;

        const divisor = gcd(this.naturalWidth, this.naturalHeight);

        const simplifiedWidth = this.naturalWidth / divisor;
        const simplifiedHeight = this.naturalHeight/ divisor;

        if ((file.size / 1048576) > 20) {
          errors.push(`Image size must not exceed 20MB. This image&apos;s size is ${file.size / 1048576}MB.`)
        }
        if (!['jpeg', 'jpg', 'bmp', 'png', 'tiff', 'webp'].includes(file.type.split('/')[1])) {
          errors.push(`Image type must be of a BMP/JPEG/PNG/TIFF/WEBP format. This is a ${file.type.split('/')[1].toUpperCase()} image.`)
        }
        if (Math.abs(2/3 - aspectRatio) > 0.2 || Math.abs(9/16 - aspectRatio) > 0.2) {
          errors.push(`Image aspect ratio must be 2:3 or 9:16. This image is ${simplifiedWidth}:${simplifiedHeight}.`);
        }
        if (this.naturalWidth < 1000 || this.naturalHeight < 1500) {
          errors.push(`Image resolution must be at least 1000px by 1500px. This image is ${this.naturalWidth}px by ${this.naturalHeight}px.`);
        }
        resolve(errors)
      };

      img.onerror = function(errorEvent) {
        console.error("Image loading error: ", errorEvent); // Log the error event
        reject('An error occurred while loading the image.');
        alert('An error occurred while loading the image.')
      };

      img.src = URL.createObjectURL(file);

    }

  )}


  function videoValidation(file) {

    return new Promise((resolve, reject) => {

      let errors = [];

      // Validate the file type
      if (file.type !== 'video/mp4' && file.type !== 'video/x-m4v') {
        errors.push(`Video must be in MP4 or M4V format. This is a ${file.type.split('/')[1].toUpperCase()} video.`);
      }

      // Validate the file size
      if (file.size > 2e9) {
        errors.push(`Video size must be less than 2GB. This video&apos;s is ${file.size / 1e9}GB`);
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        URL.revokeObjectURL(video.src);

        // Validate the video dimensions
        const width = video.videoWidth;
        const height = video.videoHeight;
        const aspectRatio = width / height;

        const divisor = gcd(width, height);

        if (Math.abs(2/3 - aspectRatio) > 0.2 || Math.abs(9/16 - aspectRatio) > 0.2) {
          errors.push(`Video aspect ratio must be 9:16 or 2:3. This video has ${width/divisor}:${height/divisor} ratio.`);
        }

        if (width < 540 || height < 960) {
          errors.push(`Video resolution must be at least 540px by 960px. This video is ${width}px by ${height}px`);
        }

        // Validate the duration
        const duration = video.duration;

        if (duration > 300 || duration < 4) {
          errors.push(`Video duration must be at least 4 seconds or at most 5 minutes. This video is ${duration} seconds long.`);
        }
        resolve(errors);
      };

      video.onerror = function() {
        reject('An error occurred while loading the image.')
        alert('An error occurred while loading the video.')
      };

      video.src = URL.createObjectURL(file);

    });
  }


  const customStyles = {
    content: {
      width: '20%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: 'Ubuntu',
    },
  };

  if (platform) {
    return (
      <div className='requirementsDiv'>
        <div className='reqsTitle' onClick={toggleAccordion}>
          <div>
            <h1>3/ Post Details</h1>
          </div>
          <div>
            <img src='/arrow.svg' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </div>
        </div>
        {isOpen && <div className="publishBodyContainer">
          <ul>
            <li>You can easily copy/paste any emoji/emojis you want into the text box.</li>
            <li>You can select multiple files at once by using the <b>Shift + Click</b> command on Windows, or the <b>Command + Click</b> command on Mac.</li>
            <li>If all your files are not visible, on the file selection dialog box switch from <b>Custom Files</b> to <b>All Files</b>.</li>
            <li>The preview on the right provides a rough estimation of how your content will be displayed.</li>
          </ul>
          <form className='publishForm'>
            <div className="inputElements">
              <label>Post Title</label>
              <p><em>This helps you to easily identify and locate your post within Sumbroo, but it will not be published.</em></p>
              <input type="text" placeholder="Enter post title" value={postTitle}
                onChange={(e) => { setPostTitle(e.target.value); setPinterestPostErrors(prev => {
                  return {
                    ...prev,
                    postTitle: null
                  }
                }); setPublishPost(false); }}
                style={{ outline: pinterestPostErrors.postTitle ? '2px solid red' : '' }} />
              {pinterestPostErrors.postTitle ? <p style={{ fontSize: '.8em', marginBottom: '0px', marginTop: '10px', color: 'red' }}>{pinterestPostErrors.postTitle}</p> : '' }  
            </div>
            <div className="inputElements" style={{ position: 'relative' }}>
              <label>Pin Title</label>
              <p>Title should be <b>40-100 characters</b>. Keep it concise and clear, ensuring it&apos;s relevant to your content.</p>
              <input type="text" maxLength='100' placeholder="Add your pin title" value={pinTitle}
                onChange={(e) => { setPinTitle(e.target.value); setTitleChars(e.target.value.length); setPinterestPostErrors(prev => {
                  return {
                    ...prev,
                    pinTitle: null
                  }
                }); setPublishPost(false); }}
                style={{ outline: pinterestPostErrors.pinTitle ? '2px solid red' : '' }} />
              { titleChars > 0 && !pinterestPostErrors.pinTitle ? 
              <span className="charsCounter" style={{ 
                position: 'absolute',
                fontFamily: 'Arial, Helvetica, sans-serif',
                bottom: '6px',
                right: '6px',
                width: '26px',
                height: '26px',
                backgroundColor: titleChars < 40 ? 'red' : '#1c1c57',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center', // Center the content vertically
                justifyContent: 'center', // Center the content horizontally
                fontSize: '12px', // You may need to adjust this value
                color: 'white'
                 }}>{100 - titleChars}</span> : ''
              }   
              {pinterestPostErrors.pinTitle ? <p style={{ fontSize: '.8em', marginBottom: '0px', marginTop: '10px', color: 'red' }}>{pinterestPostErrors.pinTitle}</p> : '' }
            </div>
            <div className="inputElements" style={{ position: 'relative' }}>
              <label>Pin Description</label>
              <p>Include a description of <b>100-500 characters</b> for your Pin, along with relevant hashtags. A detailed description helps Pinterest match your content with the right audience, amplifying its visibility and significance beyond just your host&apos;s current followers.</p>
              <textarea
                name="text"
                maxLength="500"
                placeholder="What your Pin is about"
                value={text}
                onChange={(e) => { setText(e.target.value); setDescChars(e.target.value.length); setPinterestPostErrors(prev => {
                  return {
                    ...prev,
                    text: null
                  }
                }); setPublishPost(false); }}
                style={{ outline: pinterestPostErrors.text ? '2px solid red' : '' }}
              />
              { descChars > 0 && !pinterestPostErrors.text ?
              <span className="charsCounter" style={{ 
                position: 'absolute',
                fontFamily: 'Arial, Helvetica, sans-serif',
                bottom: '10px',
                right: '10px',
                width: '26px',
                height: '26px',
                backgroundColor: descChars < 100 ? 'red' : '#1c1c57',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center', // Center the content vertically
                justifyContent: 'center', // Center the content horizontally
                fontSize: '12px', // You may need to adjust this value
                color: 'white'
                 }}>{500 - descChars}</span> : ''
              }   
              {pinterestPostErrors.text ? <p style={{ fontSize: '.8em', marginBottom: '0px', marginTop: '10px', color: 'red' }}>{pinterestPostErrors.text}</p> : '' }
            </div>
            <div className="inputElements">
              <label>Destination Link</label>
              <input type="text" placeholder="Your link here" value={pinLink}
                onChange={(e) => { setPinLink(e.target.value); setPinterestPostErrors(prev => {
                  return {
                    ...prev,
                    pinLink: null
                  }
                }); setPublishPost(false); }} 
                style={{ outline: pinterestPostErrors.pinLink ? '2px solid red' : '' }} />
              {pinterestPostErrors.pinLink ? <p style={{ fontSize: '.8em', marginBottom: '0px', marginTop: '10px', color: 'red' }}>{pinterestPostErrors.pinLink}</p> : '' }
            </div>
            <div className="file-input-wrapper inputElements">
              <label>Media File</label>
              {pinterestPostErrors.mediaLink ? <p style={{ fontSize: '.8em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>{pinterestPostErrors.mediaLink}</p> : '' }
              <button type="button" className={`btn-file-input`} onClick={handleFileClick}>
              <><img src="/upload.svg" alt="upload-icon" /> Upload File </>
              </button>
              <input
                type="file"
                name="media"
                ref={fileInput}
                style={{display: 'none'}}
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
              {fileInfo.fileName.length > 0 ? (
                <>
                  {
                    // Check if there&apos;s any error to display from fileInfo.errors
                    fileInfo.errors.length > 0 && (
                      fileInfo.errors.map((err, e) => 
                        <span className="file-upload-errors" key={e}>{err}</span>
                      )
                    )
                  }
              
                  <div 
                    className="file-name-wrapper" 
                    style={{ backgroundColor: fileInfo.errors.length > 0 ? '#e00520' : '#00d605', marginTop: '7px' }}
                  >
                    <p>{fileInfo.fileName}</p>
                    <img 
                      style={{ maxWidth: fileInfo.errors.length > 0 ? '3.5%' : '5%' }} 
                      src={fileInfo.errors.length > 0 ? '/wrong.svg' : '/correct.svg'} 
                      alt={fileInfo.errors.length > 0 ? 'wrong icon' : 'correct icon'} 
                    />
                  </div>
                </>
              ) : 'No file chosen' } 
            </div>
          </form>
        </div>}
        <Modal
            isOpen={isServerError}
            style={customStyles}
            contentLabel="Example Modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Ubuntu', fontSize: '1.3em', color: '#1c1c57' }} >Server Error</h2>
              <span onClick={() => location.reload()}
                style={{ backgroundColor: '#1465e7', 
                color: "white",
                padding: '10px', 
                cursor: 'pointer',
                fontFamily: 'Ubuntu',
                borderRadius: '3px',
                fontSize: '1.1em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                 }}>Try again</span>
            </div>
        </Modal>
      </div>
    );
  } else {
    return (<div className='requirementsDiv'>
      <div className='reqsTitle' onClick={handleWarning}>
          <div>
              <h1>3/ Post Details</h1>
              <div className='reqsTooltip' style={style}>Please select a platform first!</div>
          </div>
          <div>
              <img src='/arrow.svg' style={{ transform: 'rotate(180deg)' }} />
          </div>
      </div>
    </div>)
  }

}
