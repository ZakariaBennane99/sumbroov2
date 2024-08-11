import Modal from 'react-modal';
import { Tadpole } from "react-svg-spinners";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';


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


// This can be in a separate file for reusability across pages

const SpecialOnboarding = ({ userId, status }) => {

  const [action, setAction] = useState(status)
  const [confirmPassword, setConifrmPassord] = useState('')
  const [tk, setTk] = useState('')

  const [leftErrors, setleftErrors] = useState('')
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    password: false
  })

  // if onboarding step is 2, take the user to the last step which is 
  // to link the accounts in the settings

  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // for the pricing tables
  const [tableClicked, setTableClicked] = useState(false)
  const [lookupKey, setLookupKey] = useState(null)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  

  async function handlePayment() {

    if (!tableClicked) {
      setModalIsOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('https://sumbroo.com/server-api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, tk, paymentPlan: lookupKey })
      });

      const data = await response.json();

      if (data.url) {
        // take the user to the Stripe page
        window.location.href = data.url;
      } else {
        // handle error: maybe show a message to the user
        console.log(data)
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
      console.error('Error creating Stripe checkout session:', error);
    }
  }

  async function handleAccount() {

    console.log(formValues.password === confirmPassword)

    if (formValues.password !== confirmPassword) {
      setValidationErrors((prev) => { 
        return { ...prev, password: 'Passwords do not match' }
      })
      return
    }

    setIsLoading(true)

    try {

      const applicationURL = 'https://sumbroo.com/server-api/complete-account'

      const res = await axios.post(applicationURL, {
        userId, formValues
      })

      if (res.status === 201) {
        setIsLoading(false)
        setTk(res.token)
        setAction('payment')
        return
      }

    } catch (error) {
      setIsLoading(false)
      if (error.response.status === 400) {

        const errorsArray = error.response.data.errors;
    
        // Default error state (assuming no errors to start with)
        let newValidationErrors = {
          name: false,
          email: false,
          password: false
        };
    
        // Process each error and update the state accordingly
        errorsArray.forEach(err => {
          if (err.param === 'formValues.name') {
            newValidationErrors.name = err.msg;
          }
          if (err.param === 'formValues.email') {
            newValidationErrors.email = err.msg;
          }
          if (err.param === 'formValues.password') {
            newValidationErrors.password = err.msg;
          }
        });
    
        console.log('the new states', newValidationErrors)
        // Update the states
        setValidationErrors(newValidationErrors);

      } else {
        // here means it&apos;s error 500
        // show an alert to refresh the page
        alert('Please refresh the page and try again!')
      }
    }

  }


  function handleChange(e) {

    const { id, value } = e.target;

    setValidationErrors((prev) => {
      return { ...prev, [id]: false };
    });

    setleftErrors('');

    // Update other form fields
    setFormValues((prev) => {
      return { ...prev, [id]: value };
    });

  }

  function handleTableClicked(e) {
    setTableClicked(e.currentTarget.name)
    setLookupKey(e.currentTarget.getAttribute("data-lookup-key"))
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

  function useToError404() {
    const router = useRouter();
    
    return () => {
        router.push('/404');
    }
  }

  const redirectTo404 = useToError404();


  return (<div className='onboarding-container'>
        {
          action === 'password' ? 
            <div className='password-container'>
              <h1>Step 1: Create An Account</h1>
              <div className='pass-holder'>
              <div className='emailSCont' style={{ marginTop: '10px' }}>
                <label htmlFor="name">Name</label>
                <div className='inputContainer'>
                  {validationErrors.name ? <p style={{ width: '185px', fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>{validationErrors.name}</p> : "" }
                  <input type="text" id="name" name="name" onChange={handleChange} value={formValues.name} style={{ outline: validationErrors.name ? '2px solid red' : '' }} placeholder="Add a username"/>
                </div>
              </div>
              <div className='emailSCont'>
                <label htmlFor="email">Email</label>
                <div className='inputContainer'>
                  {validationErrors.email ? <p style={{ width: '185px', fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>Please enter a valid email</p> : "" }
                  <input type="email" id="email" name="email" onChange={handleChange} value={formValues.email} style={{ outline: validationErrors.email ? '2px solid red' : '' }} placeholder="Enter your email"/>
                </div>
              </div>
                <div className='emailSCont'>
                  <label htmlFor='pass'>Password</label>
                  <div className='inputContainer'>
                    {validationErrors.password ? <p style={{ width: '185px', fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>{validationErrors.password}</p> : "" }
                    <input type='password' id='password' placeholder='Enter your new password' 
                    onChange={handleChange} value={formValues.password} style={{ outline: validationErrors.password ? '2px solid red' : '' }} />
                  </div>
                </div>
                <div className='emailSCont'>
                  <label htmlFor='confirm-pass'>Confirm</label>
                  <input type='password' id='confirmPassword' placeholder='Confirm your password'
                  onChange={(e) => setConifrmPassord(e.target.value)} value={confirmPassword} style={{ outline: validationErrors.password ? '2px solid red' : '' }} />
                </div>

                <button disabled={isLoading ? true : false} className={`button ${isLoading ? 'loading' : ''}`} onClick={(handleAccount)}>{isLoading ? <Tadpole height={15} color='white' /> : 'Create & Continue To Payment'}</button>
              </div>
            </div>
          : action === 'payment' ?
            <div>
              <h1>Step 2: Let&apos;s Take Care of the Payment</h1>
                <div className="pricingTablesContainer" style={{ marginTop: "80px" }}>
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
                    <p>Reach an engaged audience between <b>300K - 1M</b> each month on the network
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
                    <button onClick={handleTableClicked} data-lookup-key='price_1NgcqKHK22p9cyvXeCZ7P0al' name="table1" className='selectBtnPriceTable'>Select</button>
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
                      <button onClick={handleTableClicked} data-lookup-key='price_1NgcqKHK22p9cyvXDtmXlOEk' name="table2" className='selectBtnPriceTable'>Select</button>
                  </div>
                </div>
                <div className='next-page payment-container'>
                  <button type='button' className={`button ${isLoading ? 'loading' : ''}`} onClick={handlePayment} disabled={isLoading ? true : false}>
                    {isLoading ? <Tadpole width={20} color='white' /> : <>Pay Via Stripe <img src='/pinterest/external-white.svg' /></>}
                  </button>
                </div>
            </div>
          : redirectTo404()
        }
        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          onRequestClose={() => { setModalIsOpen(false) }}
          contentLabel="Example Modal"
            >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Ubuntu', fontSize: '1.3em', color: '#1c1c57' }} >Whoops! Before we get started, please select a plan first. 👈</h2>
          </div>
        </Modal>
      </div>
)

}

export default SpecialOnboarding;


export async function getServerSideProps(context) {

  const connectDB = require('../../../utils/connectUserDB');
  const User = require('../../../utils/User').default;
  const jwt = require('jsonwebtoken');
  const mongoSanitize = require('express-mongo-sanitize');

  try {

    const token = context.query.token;

    const decoded = jwt.verify(token, process.env.JWT_SPECIAL_ONBOARDING_SECRET);

    if (decoded.platform !== 'pinterest') {
      throw new Error('Invalid action');
    }

    const userId = decoded.userId
    await connectDB()
    // assuming onboardingStep is 0
    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });

    if (!user || ![0, 1].includes(user.onboardingStep)) throw new Error('User not found');

    return {
      props: {
        userId, status: user.onboardingStep === 1 ? 'payment' : 'password',
        onboarding: true,
        notProtected: true
      }
    }; 

  } catch (error) {
    return {
      notFound: true
    };
  }

}