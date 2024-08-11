import Modal from 'react-modal';
import { Tadpole } from "react-svg-spinners";
import { useState } from 'react';



// This can be in a separate file for reusability across pages


const Onboarding = ({ userId, status }) => {

  const [action, setAction] = useState(status)
  const [tk, setTk] = useState('')

  const [pass, setPass] = useState('')
  const [confirPass, setConfirmPass] = useState('')
  const [passErrors, setPassErrors] = useState(null)

  // if onboarding step is 2, take the user to the last step which is 
  // to link the accounts in the settings

  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  

  async function handlePayment() {
    setIsLoading(true)
    try {
      const response = await fetch('https://sumbroo.com/server-api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, tk })
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

  async function handlePassword() {
    if (pass != confirPass) {
      setPassErrors(['Passwords do not match'])
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('https://sumbroo.com/server-api/set-up-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, pass })
      });

      const data = await response.json();
      if (data.errors) {
        setPassErrors(data.errors.map(er => er.msg))
        setIsLoading(false)
      } else if (data.success) {
        setIsLoading(false)
        setTk(data.token)
        setAction('payment')
      }

    } catch (error) {
      setIsError(true)
      console.error('Server Error');
    }
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


  return (<div className='onboarding-container'>
        {
          action === 'password' ? 
            <div className='password-container'>
              <h1>Step 1: Set Up a Password</h1>
              <div className='pass-holder'>
                {
                  passErrors ? passErrors.map((err, i) => <p key={i} style={{ width: '100%', textAlign: 'center', marginBottom: '15px',
                  marginTop: '0px', color: "red", fontSize: '.85em' }}>{err}</p>)  : ''
                }
                <div className='pass'>
                  <label htmlFor='pass'>Password</label>
                  <input type='password' id='pass' placeholder='Enter your new password' 
                  onChange={(e) => { setPassErrors(null); setPass(e.target.value)}} />
                </div>
                <div className='confirm-pass'>
                  <label htmlFor='confirm-pass'>Confirm Password</label>
                  <input type='password' id='confirm-pass' placeholder='Confirm your password'
                  onChange={(e) => { setPassErrors(null); setConfirmPass(e.target.value) }}/>
                </div>

                <button disabled={isLoading ? true : false} className={`button ${isLoading ? 'loading' : ''}`} onClick={(handlePassword)}>{isLoading ? <Tadpole height={15} color='white' /> : 'Confirm'}</button>
              </div>
            </div>
          : action === 'payment' ?
            <div className='payment-container'>
              <h1>Step 2: Let&apos;s Take Care of the Payment</h1>
              <div style={{ width: '100%', position: 'relative' }}>
                <button type='button' className={`button ${isLoading ? 'loading' : ''}`} onClick={handlePayment} disabled={isLoading ? true : false}>
                  {isLoading ? <Tadpole width={20} color='white' /> : <>Pay Via Stripe <img src='/pinterest/external-white.svg' /></>}</button>
              </div>
            </div> 
          : 
          <div>
            Generic page 
          </div>
        }
        <Modal
          isOpen={isError}
          style={customStyles}
          contentLabel="Example Modal"
            >
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
)

}

export default Onboarding;



export async function getServerSideProps(context) {

  const connectDB = require('../../../utils/connectUserDB');
  const User = require('../../../utils/User').default;
  const jwt = require('jsonwebtoken');
  const mongoSanitize = require('express-mongo-sanitize');

  try {

    const token = context.query.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.action !== 'onboarding') {
      throw new Error('Invalid action');
    }

    const userId = decoded.userId
    await connectDB()
    // assuming onboardingStep is 0
    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });

    if (!user || user.onboardingStep !== 0) throw new Error('User not found');
    return {
      props: {
        userId, status: 'password',
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