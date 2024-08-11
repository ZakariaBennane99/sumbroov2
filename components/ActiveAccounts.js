/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useRouter } from 'next/router';
import { useState } from "react";


function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const ActiveAccounts = ({ setPlatform, platforms }) => {

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState();

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    function handleClick(platform) {
        setSelectedPlatform(platform);
        setPlatform(platform);
    }


    function toLinkedAccounts() {
        // send to the linkedAccounts page
        router.push('/settings/linked-accounts');
    }

    function toBilling() {
        // send to the linkedAccounts page
        router.push('/settings/billing');
    }


    return (<div className='activeAccountsDiv'>
        <div className='targetPlatformsTitle' onClick={toggleAccordion}>
            <div>
                <h1>1/ Select A Platform</h1>
            </div>
            <div>
                <img src='/arrow.svg' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
            </div>
        </div>
        {isOpen && <div className='platformsContainer'>
            {
                platforms.map((platform, i) => {
                    if (platform.status === 'active') {
                        return (
                            <div key={i}>
                                <div className="cell-content" onClick={() => handleClick('pinterest')} style={{ 
                                    backgroundColor: selectedPlatform === 'pinterest' ? '#b9b9c6' : '' }}>
                                    <img id="smicons" src='/sm/pinterest.svg' alt='pinterest-logo' style={{ borderRadius: '50%' }} /><span>Pinterest</span>
                                    {selectedPlatform === platform.name ? <img src='/check.svg' alt='checkmark' id='checkmark' /> : '' }
                                </div>
                            </div>
                        )
                    } else if (platform.status === 'notAvailable') {
                        return (
                        <div key={i}>
                            <div className="cell-content notAvailable">
                                <img id="smicons" src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAvailableImg' /><span>{capitalize(platform.name)}</span>
                                <span className='tooltip'>Coming soon!</span>
                            </div>
                        </div>
                        )
                    } else if (platform.status === 'available') {
                        return (
                            <div key={i}>
                                <div className="cell-content notApplied">
                                    <img id="smicons" src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAppliedImg' /><span>{capitalize(platform.name)}</span>
                                    <span className='tooltip'><span onClick={toLinkedAccounts} className='linkAccount'>Apply</span> to connect your account</span>
                                </div>
                            </div>
                            )  
                    } else if (platform.status === 'pendingAuth') {
                        return (
                            <div key={i}>
                                <div className="cell-content notApplied">
                                    <img id="smicons" src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAppliedImg' /><span>{capitalize(platform.name)}</span>
                                    <span className='tooltip'><span onClick={toLinkedAccounts} className='linkAccount'>Link</span> your account</span>
                                </div>
                            </div>
                            )  
                    } else {
                        // don&apos;t forget to add another if-else for accounts that can&apos;t be chosen due to
                        // the time window set for them which will already be set in the publish a post
                        return (
                            <div key={i}>
                                <div className="cell-content notApplied">
                                    <img id="smicons" src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAppliedImg' /><span>{capitalize(platform.name)}</span>
                                    {
                                        platform.status === 'canceled' ?
                                        <span className='tooltip'>
                                            <span onClick={toBilling} className='linkAccount'>Re-activate</span> your subscription to continue posting
                                        </span>    
                                        :
                                        <span className='tooltip'>
                                        Please <span onClick={toBilling} className='linkAccount'>fix</span> your payment issue
                                        </span>
                                    }
                                </div>
                            </div>
                        )    
                    }
                })
            }
        </div>}
    </div>)

};

export default ActiveAccounts;
