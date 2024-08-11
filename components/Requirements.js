/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import reqs from './reqs'


const Requirements = ({ platform }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [style, setStyle] = useState({
        visibility: 'hidden'
    })

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

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

    if (platform) {
        return (<div className='requirementsDiv'>
        <div className='reqsTitle' onClick={toggleAccordion}>
            <div>
                <h1>2/ Media Requirements</h1>
            </div>
            <div>
                <img src='/arrow.svg' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
            </div>
        </div>
        {isOpen && <div className='reqs-container'>
            <ol>
                <li style={{ fontWeight: 'bold', fontSize: 'large', marginBottom: '5px' }}>Image Requirements.</li>
                <ul>
                    {
                        reqs[platform].image.map((req, i) => 
                            <li key={i}>{req}</li>)
                    }
                </ul>
                <li style={{ fontWeight: 'bold', fontSize: 'large', marginBottom: '5px' }}>Video Requirements.</li>
                <ul>
                    {
                        reqs[platform].video.map((req, i) => 
                            <li key={i}>{req}</li>) 
                    }
                </ul>
            </ol>
        </div>}
    </div>)
    } else {
        return (<div className='requirementsDiv'>
        <div className='reqsTitle' onClick={handleWarning}>
            <div>
                <h1>2/ Media Requirements</h1>
                <div className='reqsTooltip' style={style}>Please select a platform first!</div>
            </div>
            <div>
                <img src='/arrow.svg' style={{ transform: 'rotate(180deg)' }} />
            </div>
        </div>
    </div>)
    }

};

export default Requirements;
