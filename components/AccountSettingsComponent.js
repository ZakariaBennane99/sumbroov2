import { useState } from "react";
import Modal from 'react-modal';
import axios from 'axios';
import Feedback from "./Feedback";


function updateUserData(newData, currentData) {
  const updatedData = {
    ...currentData,
    ...newData
  };
  localStorage.setItem('userData', JSON.stringify(updatedData))
}  

const AccountSettingsComponent = () => { 

    const userData = JSON.parse(localStorage.getItem('userData'));
  
    const [isErr, setIsErr] = useState(false)
  
    const [name, setName] = useState('')
    const [nameClicked, setNameClicked] = useState(false)
    const [nameErrs, setNameErrs] = useState('')
    const [email, setEmail] = useState('')
    const [emailClicked, setEmailClicked] = useState(false)
    const [emailErrs, setEmailErrs] = useState(null)
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [passClicked, setPassClicked] = useState(false)
    const [passErrs, setPassErrs] = useState([])
  
  
    async function updateName() {

      setNameClicked(true)

      const apiUrl = 'https://sumbroo.com/server-api/update-name'

      try {
        const res = await axios.post(apiUrl, {
          name: name
        }, {
          withCredentials: true
        })
        
        if (res.status === 200) {
          setNameClicked(false)
          // alert user
          setName('')
          alert('Your username has been changed.')
          // update the data
          updateUserData({ name: res.data.name }, userData);
        }
        // send the user to the dashboard
      } catch (error) {
        // set Server error
        console.log(error)
        setNameClicked(false)
        if (error.response.status === 400) {
          setNameErrs('Username must be at least 6 characters long.')
        } else {
          setIsErr(true)
        }
      }
    }
  

    async function updateEmail() {
      setEmailClicked(true)

      const apiUrl = 'https://sumbroo.com/server-api/update-email'

      try {
        const res = await axios.post(apiUrl, {
          email: email
        },  {
          withCredentials: true
        })
        console.log(res)
        if (res.status === 200) {
          setEmailClicked(false)
          setEmail('')
          // alert user
          alert('Your email has been changed.')
          // update the user email
          updateUserData({ email: res.data.email }, userData);
        }
        // send the user to the dashboard
      } catch (error) {
        // set Server error
        setEmailClicked(false)
        if (error.response.status === 400) {
          setEmailErrs('Please include a valid email')
        } else {
          setIsErr(true)
        }
      }
    }
  
    async function updatePassword() {

      // check if password match
      if (newPass !== confirmPass) {
        setPassErrs([{ msg: `Passwords dont&apos;t match` }])
        return
      }

      setPassClicked(true)

      const apiUrl = 'https://sumbroo.com/server-api/update-password'

      try {
        const res = await axios.post(apiUrl, {
          newPass: newPass
        },  {
          withCredentials: true
        })
        if (res.status === 200) {
          setPassClicked(false)
          // alert user
          setNewPass('')
          setConfirmPass('')
          alert('Your password has been changed.');
        }
        // send the user to the dashboard
      } catch (error) {
        // set Server error
        setPassClicked(false)
        if (error.response.status === 400) {
          setPassErrs(error.response.data.errors)
        } else {
          setIsErr(true)
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
  
    return (<>
              <div className="accountSettingsContainer">
                  <div className="accountSetting">
                      <div className="head">
                          Username
                      </div>
                      <div className='body'>
                      {nameErrs ?
                            <p style={{ fontSize: '.9em', color: 'red', marginTop: '10px' }}>{nameErrs}</p>
                           : ''}
                          <div>
                              <span className="titles">Current Username</span>
                              <span className="old">{userData.name}</span>
                          </div>
                          <div>
                              <label className="titles">New Username</label>
                              <input type="text" placeholder="New username" name="username"
                              value={name}
                              style={{ outline: nameErrs ? '1.5px solid red' : '' }} 
                              onChange={(e) => { setNameErrs(null); setName(e.target.value); } } />
                          </div>
                          <button onClick={updateName} disabled={nameClicked}>Update Username</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Email
                      </div>
                      <div className='body'>
                      {emailErrs ?
                            <p style={{ fontSize: '.9em', color: 'red', marginTop: '10px' }}>{emailErrs}</p>
                           : ''}
                          <div>
                              <span className="titles">Current Email</span>
                              <span className="old">{userData.email}</span>
                          </div>
                          <div>
                              <label className="titles">New Email</label>
                              <input type="email" placeholder="New email" name="email" 
                              value={email}
                              style={{ outline: emailErrs ? '1.5px solid red' : '' }} 
                              onChange={(e) => { setEmailErrs(null); setEmail(e.target.value) }} />
                          </div>
                          <button onClick={updateEmail} disabled={emailClicked}>Update Email</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Password
                      </div>
                      <div className='body'>
                        {passErrs.length > 0 ?
                            passErrs.map((elem, index) => {
                              return <p key={index} style={{ fontSize: '.9em', color: 'red', marginTop: '10px' }}>{elem.msg}</p>
                            })
                           : ''}
                          <div>
                              <label className="titles">New password</label>
                              <input style={{ outline: passErrs.length > 0 ? '1.5px solid red' : '' }} 
                              value={newPass}
                              type="password" placeholder="New password" name="newPassword" 
                              onChange={(e) => { setPassErrs([]); setNewPass(e.target.value) } } />
                          </div>
                          <div>
                              <label className="titles">Confirm Password</label>
                              <input style={{ outline: passErrs.length > 0 ? '1.5px solid red' : '' }} 
                              value={confirmPass}
                              type="password" placeholder="Confirm password" name="confirmPassword" 
                              onChange={(e) => { setPassErrs([]); setConfirmPass(e.target.value) } } />
                          </div>
                          <button onClick={updatePassword} disabled={passClicked}>Update Password</button>
                      </div>
                  </div>
              </div>
              <Modal
                isOpen={isErr}
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

export default AccountSettingsComponent