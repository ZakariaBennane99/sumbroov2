import Link from "next/link";
import { useState } from "react";
import Modal from 'react-modal';
import axios from 'axios';
import { useRouter } from 'next/router';


const SettingsMenu = ({ pathname }) => {

  const router = useRouter();

  const [isServerErr, setIsServerErr] = useState(false)

  async function signOutUser() {

    const url = 'https://sumbroo.com/server-api/sign-out-user';
  
    try {
      const res = await axios.post(url, {}, {  
        withCredentials: true
      });
  
      if (res.status === 200) {
        localStorage.clear();
        router.push('/sign-in');
      } else {
        console.error(`Unexpected status code: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      setIsServerErr(true);
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

  return (<div className="leftSectionHome" style={{ width: '15%' }}>
      <Link href='/settings/linked-accounts' className={ pathname === '/settings/linked-accounts' ? 'activeLinks' : ''} >
        Linked Accounts
      </Link>
      <Link href='/settings/account-settings' className={ pathname === '/settings/account-settings' ? 'activeLinks' : ''} >
        Account Settings
      </Link>
      <Link href='/settings/billing' className={ pathname === '/settings/billing' ? 'activeLinks' : ''} >
        Billing
      </Link>
      <span onClick={signOutUser} className="sign-out">
        Sign Out
      </span>
      <Modal
          ariaHideApp={false} 
          isOpen={isServerErr}
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
  </div>)
};

export default SettingsMenu;
