/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect, useRef } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import SignUp from "../../../components/SignUp";
import Select from "react-select";
import Head from "next/head";


const Tooltip = ({ content, valueTag }) => {

    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null); // Ref for the tooltip&apos;s container

    const handleTooltipClick = () => {
        setIsVisible(true);
    };

    const handleClickOutside = (event) => {
        // Check if the click happened outside the tooltip and its trigger
        if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        // Add a global event listener to check for clicks outside the tooltip
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the global event listener when the component is unmounted
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {
                valueTag.length > 0 ?
                <span className="value-tag">{valueTag}</span>
                 : ''
            }
            <div className="info-tooltip" ref={tooltipRef}>
                <span className="question-mark" onClick={handleTooltipClick}>?</span>
                {isVisible && (
                    <div className="tooltip-content active">
                        <div id="tooltipText" dangerouslySetInnerHTML={{__html: content }} />
                    </div>
                )}
            </div>
        </>
    );
};

function capitalize(wd) {
    return wd.charAt(0).toUpperCase() + wd.slice(1);
}


const Pricing = () => {

    const [windowWidth, setWindowWidth] = useState(null);
    const [loading, setLoading] = useState(true);

    const AllAccounts = [
        "ac": "pinterest"
    ]

    useEffect(() => {
      setWindowWidth(window.innerWidth);
      setLoading(false)
      // Update the window width when the window is resized
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      }
  
      window.addEventListener('resize', handleResize);
  
      // Cleanup: remove the event listener when the component is unmounted
      return () => {
        window.removeEventListener('resize', handleResize);
      }
    }, []);

    const [hovered, setHovered] = useState(false)
    const [tableClicked, setTableClicked] = useState()
    const [lookupKey, setLookupKey] = useState(null)
    const [modalIsOpen, setModalIsOpen] = useState({
        isOpen: false,
        text: ''
    })
    const [signUpClicked, setSignUpClicked] = useState(false)
    const [targetPlatforms, setTargetPlatforms] = useState('');


    function handleTableClicked(e) {
        setTableClicked(e.currentTarget.name)
        setLookupKey(e.currentTarget.getAttribute("data-lookup-key"))
    }

    async function handleSignUpPage() {

        if (!tableClicked) {
            setModalIsOpen({
                isOpen: true,
                text: 'Whoops! Before we get started, please select a plan first. 👈'
            })
            return
        }

        setSignUpClicked(true)

    }

    function handleHover () {
        return setHovered(!hovered)
    }

    /////////// style for the react-modal /////////
    const customStyles = {
      content: {
        width: windowWidth < 750 ? '70%' : '40%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Ubuntu',
      },
    };

    // closing the Modal
    function closeModal() {
        setModalIsOpen({
            isOpen: false,
            text: ''
        })
    }
    
    function handlePlatforms(selectedOptions) {
      setTargetPlatforms(selectedOptions)
    }

    const options = AllAccounts.map(ac => {
        return { value: ac.ac, label: capitalize(ac.ac) }
    });

    const customStyles2= {
        container: (provided) => ({
          ...provided,
          width: '95%',
        }),
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? 'white' : '#1c1c57',
        })
    };


    return (<>
            <Head>
                <title>SumBroo - Pricing and Platforms</title>
                <meta name="description" content="Select your preferred social media platform(s) and choose the best plan for you. Review minimum requirements and get started without providing payment details upfront." />
            </Head>
            {signUpClicked ?
            <SignUp lookupKey={lookupKey} platforms={targetPlatforms} />
            :
            <>
            <div className="pricingParent">
                <div className="pricingTitle">
                    <h1>Select Your Preferred Platform(s) & Choose Your Plan</h1>
                    <p>Before moving forward, kindly review the minimum requirements for your chosen social media network(s) to ensure a successful application. We won&apos;t collect any payment details now. Upon approval, we&apos;ll send you a payment link via email.</p>
                </div>
                <div className="planTypeContainer">
                    <Select
                        value={targetPlatforms}
                        onChange={handlePlatforms}
                        options={options}
                        isMulti
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        styles={ customStyles2 }
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                            ...theme.colors,
                              primary25: '#e8e8ee',  // color of the option when hovering
                              primary: '#1c1c57',  // color of the selected option
                            },
                        })}
                        placeholder='Select Platform/Platforms'
                    /> 
                    {
                        targetPlatforms.length > 0 ?
                        <span id="social-reqs" onClick={() => setModalIsOpen({ isOpen: true, 
                            text: `<h3>Pinterest Requirements:</h3>
                            <ul>
                                <li>Minimum of 9K followers.</li>
                                <li>Posts must be of high quality.</li>
                                <li>Consistent activity in a specific niche.</li>
                            </ul>` })}>Minimum Requirements</span> : ''
                    }
                </div>
                
                {
                    targetPlatforms.length > 0 ? 
                <>
                    <div className="pricingTablesContainer">
                    <div className="table1" style={{
                        outline: tableClicked === 'table1' ? '4px solid #1465e7' : '',
                    }} >
                        <h1 style={{ marginTop: '30px' }}>$41.99</h1>
                        <p>Per Month</p>
                        <p>Receive credits to post daily within our <b>highly vetted</b> network for an entire month
                        <Tooltip 
                            content="Each month you maintain your subscription, you&apos;ll receive 30 credits that renew. This value is based on the average cost of a post from creators, which is typically <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://influencermarketinghub.com/influencer-rates/' target='_blank' rel='noopener noreferrer'>$119/post</a>."
                            valueTag="Valued at $3570"
                        />
                        </p>
                        <p>Reach an engaged audience between <b>300K-1M</b> each month on the network
                        <Tooltip 
                            content="You will be able to get 300K-1M views for your posts per month. As for the value, it is based on the average cost per thousand impressions on all platforms which averages <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://www.adroll.com/blog/ad-cost-breakdown-facebook-instagram-tiktok-and-pinterest' target='_blank' rel='noopener noreferrer'>$9.9.</a>"
                            valueTag="Worth $3000"
                        />
                        </p>
                        <p>Access <b>detailed analytics</b> for your posts to gain deeper insights into your audience
                        <Tooltip 
                            content="You will receive analytics for each of your posts for a duration of 7 days before they are archived. These analytics will be updated every 24 hours."
                            valueTag=""
                        />
                        </p>
                        <p>Receive a <b>high-quality</b> post daily completely for free
                        <Tooltip 
                            content="Creators within our network will also have the opportunity to guest-post on your feed. To ensure the highest quality of content, every post undergoes a human review before being published."
                            valueTag=""
                        />
                        </p>
                        <p>Connect <b>genuinely</b> with fellow creators within a community that shares your passion
                        <Tooltip 
                            content="You will be able to join a community where creators like you connect, share insights, and engage with one another."
                            valueTag=""
                        />
                        </p>
                        <p>Grow <b>faster</b> with Sumbroo
                        <Tooltip 
                            content="We handle everything, from profile vetting to content review, allowing you to concentrate solely on expanding your follower base."
                            valueTag=""
                        />
                        </p>
                        <button onClick={handleTableClicked} data-lookup-key='price_1NduMpHK22p9cyvXL5JiI0mA' name="table1">Select</button>
                    </div>
                    <div className="table2" style={{
                        outline: tableClicked === 'table2' ? '4px solid #1465e7' : ''
                     }}>
                        <div className="saveRibbon">Save $100.9</div>
                        <span className="strikethrough">$503.88</span>
                        <h1 style={{ marginTop: '10px' }}>$402.99</h1>
                        <p>Per Year</p>
                        <p>Receive credits to post daily within our <b>highly vetted</b> network for an entire month
                        <Tooltip 
                            content="Each month you maintain your subscription, you&apos;ll receive 30 credits that renew. This value is based on the average cost of a post from creators, which is typically <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://influencermarketinghub.com/influencer-rates/' target='_blank' rel='noopener noreferrer'>$119/post</a>."
                            valueTag="Valued at $42840"
                        />
                        </p>
                        <p>Reach an engaged audience between <b>300K - 1M</b> each month on the network
                        <Tooltip 
                            content="You will be able to get 300K-1M views for your posts per month. As for the value, it is based on the average cost per thousand impressions on all platforms which averages <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://www.adroll.com/blog/ad-cost-breakdown-facebook-instagram-tiktok-and-pinterest' target='_blank' rel='noopener noreferrer'>$9.9.</a>"
                            valueTag="Worth $36000"
                        />
                        </p>
                        <p>Access <b>detailed analytics</b> for your posts to gain deeper insights into your audience
                        <Tooltip 
                            content="You will receive analytics for each of your posts for a duration of 7 days before they are archived. These analytics will be updated every 24 hours."
                            valueTag=""
                        />
                        </p>
                        <p>Receive a <b>high-quality</b> post daily completely for free
                        <Tooltip 
                            content="Influencers within our network will also have the opportunity to guest-post on your feed. To ensure the highest quality of content, every post undergoes a human review before being published."
                            valueTag=""
                        />
                        </p>
                        <p>Connect <b>genuinely</b> with fellow creators within a community that shares your passion
                        <Tooltip 
                            content="You will be able to join a community where creators like you connect, share insights, and engage with one another."
                            valueTag=""
                        />
                        </p>
                        <p>Grow <b>faster</b> with Sumbroo
                        <Tooltip 
                            content="We handle everything, from profile vetting to content review, allowing you to concentrate solely on expanding your follower base."
                            valueTag=""
                        />
                        </p>
                        <button onClick={handleTableClicked} data-lookup-key='price_1NduMpHK22p9cyvXtZr9KbhJ' name="table2">Select</button>
                    </div>
                    </div>
                    <div className="next-page">
                        <button onClick={handleSignUpPage} onMouseOver={handleHover} onMouseOut={handleHover} style={{ paddingRight: hovered ? "70px" : "" }}>Continue <FontAwesomeIcon icon={faArrowRight} style={{ position: 'absolute', fontSize:'32px', right: hovered ? '30px' : '-45px', transition: '0.5s', bottom:'13px' , color: 'white' }}/></button>
                    </div> 
                </> : ''
                }


            </div>
            <Modal
                isOpen={modalIsOpen.isOpen}
                style={customStyles}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <div 
                    id="pricingModal"
                    dangerouslySetInnerHTML={{__html: modalIsOpen.text}}
                />
            </Modal>
            </>}
        </>
    )
};

export default Pricing;

export async function getServerSideProps(context) {
  
      return {
        props: {
          isBlog: true,
          notProtected: true,
        },
      };
}
  
  
