import { useState } from "react";
import Modal from 'react-modal';
import { Tadpole } from "react-svg-spinners";
import Feedback from "../../../../components/Feedback";


const Billing = ({ stripeCustomer }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    async function handleBilling() {
      setIsLoading(true)
      try {
        const response = await fetch('https://sumbroo.com/server-api/create-customer-portal-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stripeCustomer })
        });
  
        const data = await response.json();

        console.log('this is the date', data)
  
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
        console.error('Server error', error);
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

    return (
          <>
              <div className="paymentContainer">
                  <div>
                      <p>When clicking on the button below, you&apos;ll be redirected to a secure Stripe page to manage your billing details.</p>
                      <button className={`button ${isLoading ? 'loading' : ''}`} onClick={handleBilling} style={{ paddingLeft: '15px', paddingRight: '15px' }} disabled={isLoading ? true : false}>
                      {isLoading ? <Tadpole width={20} color='white' /> : <>Manage Billing <img src="/pinterest/external-white.svg" /></>}</button>
                  </div>
              </div>
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
            <Feedback />  
          </>)
};

export default Billing;


export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');
  const User = require('../../../../utils/User').default;
  const connectDB = require('../../../../utils/connectUserDB');
  const mongoSanitize = require('express-mongo-sanitize');


  try {

    // Get cookies from the request headers
    const cookies = context.req.headers.cookie;

    // Parse the cookies to retrieve the otpTOKEN
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));

    let tokenValue;
    if (tokenCookie) {
      tokenValue = tokenCookie.split('=')[1];
    }

    const decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);

    if (decoded.type !== 'sessionToken') {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    const userId = decoded.userId;
      
    const sanitizedUserId = mongoSanitize.sanitize(userId);
    
    await connectDB();
    let user = await User.findOne({ _id: sanitizedUserId });

    // continue rendering
    return {
      props: {
        signedIn: true,
        isSettings: true,
        stripeCustomer: user.stripeId
      }
    };


  } catch (error) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

}