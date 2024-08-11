/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import React, { useState, } from 'react';
import { faEye, faEyeSlash, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Tadpole } from "react-svg-spinners";
import Head from 'next/head';



const SignIn = () => {
  
    const router = useRouter();

    // password change
    const [isPasswordChanged, setIsPasswordChanged] = useState(false)
    const [passwordChangeErrors, setPasswordChangeErrors] = useState(null)
    const [updatePasswordClicked, setUpdatePasswordClicked] = useState(false)
    const [passwordChange, setPsswordChange] = useState({
      pass: ''
    })

    // handling OTP
    const [OTPErrors, setOTPErrors] = useState(null)
    const [verifyOTPClicked, setIsVerifyOTPClicked] = useState(false)
    const [OTPCorrect, setOTPCorrect] = useState(false)
    const [OTP, setOTP] = useState({
      otp: 0
    })

    // Email for password change
    const [sendPassChangeClicked, setPassChangeClicked] = useState(false)
    const [isEmailSentForPassChange, setIsEmailSentForPassChange] = useState(false)
    const [changePassErrors, setChangePassErrors] = useState(null)
    const [passChangeEmail, setPassChangeEmail] = useState({
      email: ""
    })

    // The sign in page
    const [isClicked, setIsClicked] = useState(false)
    const [showEye, setShowEye] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [clickedOnForgot, setClickedOnForgot] = useState(false)
    const [leftErrors, setleftErrors] = useState(null)
    const [validationErrors, setValidationErrors] = useState({
      email: false,
      password: false
    })
    const [formValues, setFormValues] = useState({
      email: '',
      password: ''
    })
    
    // Used by all 3 in case of server error
    const [isServerError, setIsServerError] = useState(false)


    function handleShowEye () {
      return setShowEye(!showEye)
    }

    function handleHover () {
      return setHovered(!hovered)
    }

    function handleChangePass () {
      return setClickedOnForgot(!clickedOnForgot)
    }

    function handleEmailPassChange(e) {
      setChangePassErrors(false)
      return setPassChangeEmail({ email: e.target.value })
    }

    function handleChange (e) {

      setValidationErrors((prev) => {
        return {...prev, [e.target.id]: false}
      })

      setleftErrors('')

      return setFormValues((prev) => {
        return {...prev, [e.target.id]: e.target.value}
      })
    }

    // login the user
    const loginUser = async function authUser () {

      setIsClicked(true)

      const apiUrl = 'http://localhost:4050/server-api/auth' || 'https://sumbroo.com/server-api/auth'

      try {
        const res = await axios.post(apiUrl, formValues,  {
          withCredentials: true
        })
        if (res.status === 201) {
          setIsClicked(false)
          // here save the data in the localStorage
          localStorage.setItem('userData', JSON.stringify(res.data.userData));
          router.push('/dashboard');
        }
        // send the user to the dashboard
      } catch (error) {
        // client error 400 or 401
        console.log('the error', error)
        if (error.response.status === 400) {
          error.response.data.errors.forEach(error => {
            setValidationErrors((prev) => {
              return {
                ...prev, 
                [error.param]: error.msg
              }
            })
          })
          setIsServerError(false)
          setIsClicked(false)
        } else if (error.response.status === 401) {
          // here set up the leftErrors
          setleftErrors('Invalid credentials')
          setIsClicked(false)
        } else {
          setIsServerError(true)
          setIsClicked(false)
        }
      }

    }

    async function handleOTP() {

      setIsVerifyOTPClicked(true)

      const otpCHECKURL = 'https://sumbroo.com/server-api/check-password-otp'

      try {
        const res = await axios.post(otpCHECKURL, OTP, {
          withCredentials: true
        })
        if (res.status === 201) {
          setOTPCorrect(true)
          setOTPErrors(null)
          setIsVerifyOTPClicked(false)
        }
        // send the user to the dashboard
      } catch (error) {
        setIsVerifyOTPClicked(false)
        // client error 400 or 401
        if (error.response.status === 400) {
          setOTPErrors('Invalid OTP')
        } else if (error.response.status === 401) {
          console.log(error)
          // here set up the leftErrors
          setOTPErrors('Expired OTP')
        } else {
          setIsServerError(true)
        }
        
      }
    }

    async function changePassword() {

      setUpdatePasswordClicked(true)
      const changePasswordEnpoint = 'https://sumbroo.com/server-api/change-password'

      try {
        const res = await axios.post(changePasswordEnpoint, passwordChange, {
          withCredentials: true
        })
        if (res.status === 201) {
          setIsPasswordChanged(true)
          setUpdatePasswordClicked(false)
        }
        // send the user to the dashboard
      } catch (error) {
        // client error 400 or 401
        setUpdatePasswordClicked(false)
        if (error.response.status === 400) {
          console.log('400', error)
          setPasswordChangeErrors(error.response.data.errors.map(er => er.msg))
        } else if (error.response.status === 401) {
          console.log('401', error)
          // here set up the leftErrors
          setPasswordChangeErrors(['Expired OTP'])
        } else {
          setIsServerError(true)
        }
        
      }
    }

    async function handleSendForgot () {

      setPassChangeClicked(true)

      const changePassUrl = 'http://localhost:4050/server-api/initiate-password-change' || 'https://sumbroo.com/server-api/initiate-password-change'

      try {
        const resp = await axios.post(changePassUrl, passChangeEmail, {
          withCredentials: true
        })
        if (resp.status === 200) {
          console.log(resp)
          setIsEmailSentForPassChange(true)
          setPassChangeClicked(false)
        }
      } catch (err) {
        setPassChangeClicked(false)
        console.log(err)
        // if not a server error
        if (err.response.status === 400) {
          setChangePassErrors('Please include a valid email')
          setIsServerError(false)
        } else if (err.response.status === 401) {
          setChangePassErrors('Invalid email')
          setIsServerError(false)
        } else {
          // server error
          setIsServerError(true)
        }
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
          <div className='login-container'>
            <Head>
              <title>Sign In - Your Project Name</title>
              <meta name="description" content="Sign in to access your account on SumBroo. Publish new posts, and manage your account and content." />
            </Head>
            {!clickedOnForgot ?
                <form className='loginForm'>
                    <h1 id='loginUpTxt'>Sign In</h1>
                    {
                      leftErrors ? 
                      <p style={{ color: 'red' }}>{leftErrors}</p> : ''
                    }
                    <div className='email-cont'>
                      <label htmlFor="email">Email</label>
                      <div>
                        {validationErrors.email ? <p  
                        style={{ fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>Please enter a valid email.</p> : "" }
                        <input placeholder="Enter your email" type="email" id="email" 
                          onChange={handleChange} 
                          style={{ outline: validationErrors.email ? '2px solid red' : '' }}/>
                      </div>
                    </div>
                    <div className='pass-cont'>
                      <label htmlFor="password">Password</label>
                      {formValues.password.length > 0 ?
                        <FontAwesomeIcon icon={showEye ? faEye : faEyeSlash } 
                          style={{ position: 'absolute', zIndex:'100', width: '15px', right: '6px', top: '6px' , cursor: 'pointer', color: '#1c1c57' }} 
                          onClick={handleShowEye}/>
                      : ""}
                      <div>
                        {validationErrors.password ? <p 
                        style={{ fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>Password required.</p> : "" }
                        <input placeholder="Enter your password" 
                          type={showEye ? "text" : "password"} id="password" value={formValues.password} 
                          onChange={handleChange} 
                          style={{ outline: validationErrors.password ? '2px solid red' : '', position:'relative' }}/>
                      </div>
                    </div>
                    <div style={{ width: '100%', position: 'relative' }}>
                      <button type='button' 
                        onMouseOver={handleHover}
                        onMouseOut={handleHover}
                        onClick={loginUser}
                        className={`button ${isClicked ? 'loading' : ''}`}
                        style={{ paddingRight: hovered ? "70px" : "" }} disabled={isClicked}>{isClicked ? <Tadpole height={15} color='white' /> : 'Sign In'}</button>
                        {
                          isClicked ? 
                          '' :
                          <FontAwesomeIcon icon={faArrowRight} 
                            style={{ position: 'absolute', fontSize:'20px', right: hovered ? '30' : '-30', transition: '0.5s', bottom:'10' , color: 'white' }}/>
                        }
                    </div>
                    <p onClick={handleChangePass} className='forgot-pass'>Forgot Password?</p>
                </form> :
                <div className='forgot-pass-container'>
                  {(() => {
                    if (!isEmailSentForPassChange) {
                      return (
                        <>
                          <div>
                            {changePassErrors && <p style={{ marginTop: '0px' }} className='pass-error'>{changePassErrors}</p>}
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" onInput={handleEmailPassChange} value={passChangeEmail.email} placeholder="Enter your email" />
                          </div>
                          <button onClick={handleSendForgot} disabled={sendPassChangeClicked}>Send OTP</button>
                        </>
                      );
                    }
                  
                    if (isEmailSentForPassChange && !OTPCorrect) {
                      return (
                        <>
                          {OTPErrors && <p style={{ marginTop: '0px' }} className='pass-error'>{OTPErrors}</p>}
                          <label htmlFor="passOTP">Enter OTP sent to your inbox</label>
                          <input type="number" id="passOTP" placeholder="Enter OTP" value={OTP.otp} onChange={(e) => { setOTPErrors(null); setOTP({ ['otp']: e.target.value }) }} />
                          <button onClick={handleOTP} disabled={verifyOTPClicked}>Verify OTP</button>
                        </>
                      );
                    }
                  
                    if (OTPCorrect && !isPasswordChanged) {
                      return (
                        <div className='pass-cont' style={{ alignItems: 'flex-start', marginTop: '0px' }}>
                          {passwordChangeErrors && passwordChangeErrors.map((err, i) => {
                            return <p key={i} style={{ marginTop: '0px', fontSize: '.7em' }} className='pass-error'>{err}</p>
                          })}
                          <label htmlFor="password">New Password</label>
                          <div>
                            <input placeholder="Enter your new password" type="password" id="password" value={passwordChange.pass} onChange={(e) => { setPasswordChangeErrors(null); setPsswordChange({ ['pass']: e.target.value }) }} />
                          </div>
                          <button onClick={changePassword} disabled={updatePasswordClicked}>Update Password</button>
                        </div>
                      );
                    }
                  
                    if (isPasswordChanged) {
                      return (
                        <div style={{ fontSize: '1em' }}>
                          Your password has been changed. You can log in now.
                        </div>
                      );
                    }
                  })()}
              </div>
              }
            <Modal
              isOpen={isServerError}
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
};

export default SignIn;


// this is to avoid signing in again after the 
// user have already signed in, we can check 
// if the user has a valid token, then take him/her
// to the dashboard
export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');

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
        props: {
          notProtected: true
        }
      };
    }

    // continue rendering
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };


  } catch (error) {
    return {
      props: {}
    };
  }

}

