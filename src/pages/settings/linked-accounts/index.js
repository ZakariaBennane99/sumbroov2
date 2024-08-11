import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useRouter } from "next/router";
import { PinterestAuth } from '../../../../components/auth/PinterestAuth';
import Feedback from "../../../../components/Feedback";


function capitalize(wd) {
    const capitalizeWord = wd.charAt(0).toUpperCase() + wd.slice(1).toLowerCase();
    return capitalizeWord
}

const LinkedAccounts = ({ AllAccounts, isServerErr }) => {

  const router = useRouter();
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    console.log('The account result', router.query.result)
    if (router.query.result === 'success') {
      setIsLinked('Yes');
    } else if (router.query.result === 'failure') {
      setIsLinked('No');
    } else if (router.query.result === 'account-failure') {
      // 'acc' means account failure
      setIsLinked('Acc')
    }
  }, [router.query]);

  const [componentServerErr, setComponentServerErr] = useState(false)

  

  function handleAccountClick(e) {

    const status = e.target.innerText;
    const media = e.target.dataset.platform;

    if (status === 'Subscribe To Link') {
      // here you have to send the user to the billing page
      router.push('/settings/billing');
    } else if (status === 'Link Account' || 'Renew Connection') {
      // here you have to connect to the target platform
      // and authenticate the user, get the token and store it in the DB
      if (media === 'pinterest') {
        PinterestAuth().initiateAuth();
      }
    } else if (status === 'Apply To Link') {
      // here you connect to a route that will add a new application 
      // to the Admin DB and update this account to inReview, 
      // then show an alert 
      // @TODO after adding a new platform
      
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
              
  return (<>
            {
                AllAccounts.map((acc, i) => {
                    return (
                    <div key={i} className="smAccountsContainer">
                        <div className="linkedAccountsWrapper"> 
                              {
                                acc.status === 'authExpired' ? 
                                <div className="refreshWarning"> 
                                    <img src="/infotip.svg" />
                                    <span>It looks like your connection has expired. To continue posting, please renew your connection.</span> 
                                </div>
                                : ''
                              }
                              {
                                isLinked === 'No' ? 
                                <div className="refreshWarning"> 
                                  <img src="/infotip.svg" />
                                  <span>There was an error authenticating your account. You can try again.</span> 
                                </div> 
                                : isLinked === 'Acc' ? 
                                <div className="refreshWarning"> 
                                  <img src="/infotip.svg" />
                                  <span>Please link the account for which you have been approved.</span> 
                                </div> 
                                : isLinked === 'Yes' ?
                                <div className="refreshWarning"> 
                                  <span><b>Success!</b> Your account has been linked.</span> 
                                </div> : ''
                              }
                            <div className="linkedAccounts">
                                <div className="account">
                                  <span id="sm"><img id="smlg" src={`/sm/${acc.name}.svg`} /> {capitalize(acc.name)}</span>
                                  {
                                    acc.status === 'active' ? <img id="check" src="/check.svg" /> : ''
                                  }
                                </div>
                                {(() => {
                                  let msg;
                                  if (acc.status === 'active') {
                                    msg = 'Linked'
                                  } else if (acc.status === 'pendingPay') {
                                    msg = 'Subscribe To Link'
                                  } else if (acc.status === 'pendingAuth') {
                                    msg = 'Link Account'
                                  } else if (acc.status === 'inReview') {
                                    msg = 'In Review'
                                  } else if (acc.status === 'authExpired') {
                                    msg = 'Renew Connection'
                                  } else {
                                    msg = 'Apply To Link'; 
                                  }
                                  return <button data-platform={acc.name} style={{ backgroundColor: ( msg === 'In Review' || msg === 'Linked') ? 'grey' : '',
                                   cursor: ( msg === 'In Review' || msg === 'Linked') ? 'auto' : ''  }}
                                   onClick={handleAccountClick} disabled={msg === 'In Review' || msg === 'Linked'}>{msg}</button>
                                  })
                                ()}
                            </div>
                        </div>
                    </div>
                    )
                })
            }
          <Modal
            isOpen={isServerErr || componentServerErr}
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

export default LinkedAccounts;

export async function getServerSideProps(context) {

  const connectDB = require('../../../../utils/connectUserDB');
  const jwt = require('jsonwebtoken');
  const User = require('../../../../utils/User').default;
  const AvAc = require('../../../../utils/AvailableAccounts').default;
  const mongoSanitize = require('express-mongo-sanitize');
  const axios = require('axios');

  function getStatus(accountName, accountsArray) {
    // Find the account in the array
    const account = accountsArray.find(acc => acc.name === accountName);
  
    // If the account is found, return its status; otherwise, return false
    return account ? account.status : false;
  }


  async function refreshTokenForUser(refToken) {

      const authorization = `Basic ${Buffer.from(`1484362:${process.env.PINTEREST_APP_SECRET}`).toString('base64')}`;
  
      try {
          const response = await axios.post('https://api.pinterest.com/v5/oauth/token', null, {
              headers: {
                  'Authorization': authorization,
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              params: {
                  grant_type: 'refresh_token',
                  refresh_token: refToken
              }
          });
  
          const data = response.data;
          const now = new Date();
          const currentUTCDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  
          const tokenExpiryDate = new Date(currentUTCDate.getTime() + (data.expires_in * 1000));
          const theNewToken = data.access_token;
  
          return {
            isError: false,
            newToken: theNewToken,
            expiryUTCDate: tokenExpiryDate
          }
  
      } catch (error) {
          console.error('Error refreshing Pinterest token:', error.message);
          return {
            isError: true,
          }
      }
  }
  
  let decoded;

  try {

    try {
      // Get cookies from the request headers
      const cookies = context.req.headers.cookie;
  
      // Parse the cookies to retrieve the otpTOKEN
      const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
  
      let tokenValue;
      if (tokenCookie) {
        tokenValue = tokenCookie.split('=')[1];
      }
  
      decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);
  
      if (decoded.type !== 'sessionToken') {
        return {
          redirect: {
            destination: '/sign-in',
            permanent: false,
          },
        };
      }
    } catch (err) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    const userId = decoded.userId
    await connectDB();
    // assuming onboardingStep is 2
    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });
    const activeProfilesPromises = user.socialMediaLinks
    
        .map(link => {

          const now = new Date();
          const currentUTCDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

          if (link.accesstokenExpirationDate <= currentUTCDate) {
            // Token has expired or is about to expire
            if (link.refreshTokenExpirationDate > currentUTCDate) {

              const refreshTokenAndUpdate = async (link) => {
                const newToken = await refreshTokenForUser(link.refreshToken);
                if (newToken.isError) {
                    return {
                        name: link.platformName,
                        status: 'authExpired'
                    };
                } 
                link.accessToken = newToken.newToken;
                link.accesstokenExpirationDate = newToken.expiryUTCDate;
                return {
                  name: link.platformName,
                  status: link.profileStatus
                };
              }

              return refreshTokenAndUpdate(link); 

            } else {
              // Both token and refresh token have expired, prompt user to re-authenticate
              return {
                name: link.platformName,
                status: 'authExpired'
              }
            }
          }

          // otherwise return the typical name, status pairs
          return {
            name: link.platformName,
            status: link.profileStatus
          }

        });

    await user.save();    

    const activeProfiles = await Promise.all(activeProfilesPromises);
        
    let AvAccounts = await AvAc.findOne({ _id: '64dff175f982d9f8a4304100' });

    let AvAcc = AvAccounts.accounts.map(ac => {
      if (ac.status === 'available') {
        const stats = getStatus(ac.ac, activeProfiles)
        return {
          name: ac.ac,
          status: stats ? stats : 'new'
        }
      }
    }).filter(el => el !== undefined)


    return {
      props: {
        AllAccounts: AvAcc,
        isServerErr: false,
        userId: userId,
        signedIn: true,
        isSettings: true
      }
    };
  } catch (error) {
    return {
      props: {
        AllAccounts: false,
        isServerErr: true,
        userId: false,
        signedIn: true,
        isSettings: true
      }
    };
  }

}