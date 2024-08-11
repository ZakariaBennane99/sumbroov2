/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import axios from 'axios'
import { Tadpole } from "react-svg-spinners";
import { useState } from "react";
import _ from "lodash";


function getCurrentUTCDate() {

  const now = new Date();

  const utcFullYear = now.getUTCFullYear();
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0'); 
  const utcDate = String(now.getUTCDate()).padStart(2, '0');
  const utcHours = String(now.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');

  const fullUTCDate = `${utcFullYear}-${utcMonth}-${utcDate} ${utcHours}:${utcMinutes}:${utcSeconds} UTC`;

  return fullUTCDate

}

const SignUp = ({ lookupKey, platforms }) => {

  const [isApplicationSent, setIsApplicationSent] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    profileLinks: platforms.map(platform => {
      return { platformName: platform.value, profileLink: false }
    })
  })

  const [formValues, setFormValues] = useState({
    applicationDate: '',
    name: '',
    email: '',
    initialPlanChosen: lookupKey,
    profileLinks: platforms.map(platform => {
      return { platformName: platform.value, profileLink: '', profileStatus: 'inReview' }
    })
  })

  const [leftErrors, setleftErrors] = useState('')

  function handleChange(e) {

    const { id, name, value } = e.target;

    setValidationErrors((prev) => {
      if (id === 'profile-handle') {
          const updatedProfileLinks = prev.profileLinks.map(link => {
            if (link.platformName === name) {
                return { ...link, profileLink: false };
            }
            return link;
        });
        return { ...prev, profileLinks: updatedProfileLinks };
      } else {
        return { ...prev, [id]: false };
      }
    });

    setleftErrors('');

    if (id === 'profile-handle') {
        // Update profileLinks
        setFormValues((prev) => {
            const updatedProfileLinks = prev.profileLinks.map(link => {
                if (link.platformName === name) {
                    return { ...link, profileLink: value };
                }
                return link;
            });
            return { ...prev, profileLinks: updatedProfileLinks };
        });
    } else {
        // Update other form fields
        setFormValues((prev) => {
            return { ...prev, [id]: value };
        });
    }
  }


  // registering a new user
  const signUpUser = async function registerUser () {

    setIsLoading(true)

    const updatedFormValues = {
      ...formValues,
      applicationDate: getCurrentUTCDate()
    };

    // user registration URL
    const applicationURL = 'https://sumbroo.com/server-api/new-application'
    try {
      const res = await axios.post(applicationURL, updatedFormValues)
      // after registering the User redirect to the checkout page
      if (res.status === 201) {
        setIsApplicationSent(true)
        setIsLoading(false)
      }
    } catch (err) {
      setIsLoading(false)
      // if not a server error
      if (err.response.status === 401) {
        setleftErrors(err.response.data.errors[0].msg)
      } else if (err.response.status === 400) {
          err.response.data.errors.map(el => {
          if (el.param.includes('profileLinks')) {
              const match = el.param.match(/profileLinks\[(\d+)\]\.profileLink/);
              if (match && match[1]) {
                  const index = parseInt(match[1], 10);
                  setValidationErrors(prev => {
                      let updatedProfileLinks = [...prev.profileLinks]; // Clone the current profileLinks array
                      updatedProfileLinks[index] = {
                          ...updatedProfileLinks[index],
                          profileLink: el.msg
                      };
      
                      console.log(updatedProfileLinks)
                      return {
                          ...prev,
                          profileLinks: updatedProfileLinks
                      };
                  });
              }
          } else {
              setValidationErrors(prev => ({
                  ...prev,
                  [el.param]: el.msg
              }));
          }
        });      
        // if server error
      } else {
        setleftErrors('Please refresh the page and try again!')
      }
    }
  }


  return (<>
    {
      isApplicationSent ? 
      <div className="applicationSentMessageContainer">
        <div>
          <img src="/green-check.svg" />
          <p>
            Thank you for submitting your application! We&apos;re thrilled youre interested in joining us.
            We&apos;ll carefully review your details and reach out to you within the next 48 hours.
            We appreciate your patience. In the meantime, you can read how to supercharge your growth 
            in our blog.
          </p>
        </div>
      </div> 
      :     
      <div className='signup-container'>
      <form className='signUpForm'>
        <h1 id='signUpTxt' style={{ marginTop: '10px', marginBottom: '10px' }}>Profile Info</h1>
        {leftErrors ? <h4 style={{ color: 'red', fontWeight: '400', margin: '0px' }}>{leftErrors}</h4> : ''}
        <div className='emailSCont'>
          <label htmlFor="name">Name</label>
          <div>
            {validationErrors.name ? <p style={{ width: '185px', fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>{validationErrors.name}</p> : "" }
            <input type="text" id="name" name="name" onChange={handleChange} style={{ outline: validationErrors.name ? '2px solid red' : '' }} placeholder="Add a username"/>
          </div>
        </div>
        <div className='emailSCont'>
          <label htmlFor="email">Email</label>
          <div>
            {validationErrors.email ? <p style={{ width: '185px', fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>Please enter a valid email</p> : "" }
            <input type="email" id="email" name="email" onChange={handleChange} style={{ outline: validationErrors.email ? '2px solid red' : '' }} placeholder="Enter your email"/>
          </div>
        </div>
        {
          platforms.map((el, i) => {
            return <div key={i} className='platformCont'>
            <label htmlFor={el.value}>{el.label} Link</label>
            <div style={{ width: 'fit-content' }}>
              {validationErrors.profileLinks[i].profileLink ? <p style={{ width: '185px', fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>Please include a valid {el.label} link</p> : "" }
              <input 
                type="text" 
                id="profile-handle" 
                name={el.value} 
                onChange={handleChange} 
                style={{ outline: validationErrors.profileLinks[i].profileLink ? '2px solid red' : '' }} 
                placeholder={`Your ${el.label} profile link`} 
              />
            </div>
          </div>
          })
        }
        <div style={{ width: '100%', position: 'relative' }}>
          <button type='button' className={`button ${isLoading ? 'loading' : ''}`} onClick={signUpUser} disabled={isLoading ? true : false}>
            {isLoading ? <Tadpole width={20} color='white' /> : 'Send'}</button>
        </div>
      </form>
    </div>
    }
    </>)
};

export default SignUp;

export async function getServerSideProps() {

  return {
    props: {
      notProtected: true
    }
  };

}
