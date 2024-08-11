import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SlideMenu from './SlideMenu';
import axios from 'axios';
import Image from 'next/image';

const Header = ({ signedIn, width, currentPath }) => {

  const [isSubMenuOpen1, setIsSubMenuOpen1] = useState(false);
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState(false);
  const [isSignOutClicked, setIsSignOutClicked] = useState(false);
  const router = useRouter();
  const { asPath } = useRouter();

  const [localPath, setLocalPath] = useState(currentPath);

  useEffect(() => {
    setLocalPath(currentPath);
  }, [asPath]);

  async function signOutUser() {
    setIsSignOutClicked(true)
    const url = 'https://sumbroo.com/server-api/sign-out-user';
    try {
      const res = await axios.post(url, {}, { withCredentials: true });
      if (res.status === 200) {
        router.push('/sign-in');
      } else {
        console.error(`Unexpected status code: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error, please referesh the page and try again')
    }
  }

  const renderLinks = (isMobile) => {
    return signedIn ? renderSignedInLinks(isMobile) : renderSignedOutLinks();
  };

  const renderSignedInLinks = (isMobile) => {
    return isMobile ? renderMobileSignedInLinks() : renderDesktopSignedInLinks();
  };
  

  const renderMobileSignedInLinks = () => {
    return (
      <div id='mobile-sub-menu-wrapper'>
        <Link href='/blog' id='blog-big-menu'>Blog</Link>
        {renderSubMenu('Dashboard', 'dashboard', isSubMenuOpen1, setIsSubMenuOpen1)}
        {renderSubMenu('Settings', 'settings', isSubMenuOpen2, setIsSubMenuOpen2)}
      </div>
    );
  };
  
  
  

  const renderDesktopSignedInLinks = () => {
    return (
      <>
        <Link href='/blog'>
          <p style={{ 
            color: localPath.includes('blog') ? '#1c1c57' : ''
          }}>Blog</p>
        </Link>
        <Link href='/dashboard'>
          <p style={{ 
            color: localPath.includes('dashboard') ? '#1c1c57' : ''
          }}>Dashboard</p>
        </Link>
        <Link href='/settings'>
          <p style={{ 
            color: localPath.includes('settings') ? '#1c1c57' : ''
          }}>Settings</p>
        </Link>
      </>
    );
  };


  const renderSubMenu = (title, path, isOpen, setOpen) => {

    return (
      <>
        <div role="button" tabIndex="0" onClick={() => {
            setOpen(!isOpen);
          }} className='big-menu-items'>
          <span style={{ color: (isOpen && path === 'dashboard') || (isOpen && path === 'settings') ? '#36366e' : '#78749c' }}>
           {title}
          </span> 
          <img alt={`${title} icon`} style={{ 
            width: isOpen ? '20px' : '25px', 
            height: isOpen ? '25px' : '20px',
            transition: 'transform 0.6s ease'
            }} src={localPath.includes(`/${path}`) || isOpen ? '/menu-dropper-active.svg' : '/menu-dropper.svg'} />
        </div>
        {(isOpen || localPath.includes(`/${path}`)) && (
          <div id='mobile-sub-menu'>
            { path === 'dashboard' && 
              <>
                 <Link href={`/${path}/publish-a-post`}>Publish Post</Link>
                 <Link href={`/${path}/analytics`}>Analytics</Link>
                 <Link href={`/${path}/posts-status`}>Posts Status</Link>
                 <Link href={`/${path}/archived-posts`}>Archive</Link>
                 {/* Add other Dashboard specific links here */}
              </>
            }
            { path === 'settings' &&
              <>
                 <Link href={`/${path}/linked-accounts`}>Linked Accounts</Link>
                 <Link href={`/${path}/account-settings`}>Account Settings</Link>
                 <Link href={`/${path}/billing`}>Billing</Link>
                 <button id='sign-out-user' onClick={signOutUser} disabled={isSignOutClicked}>Sign Out</button>
              </>
            }
          </div>
        )}
      </>
    );
};


  const renderSignedOutLinks = () => {

    // the 'Sign In' 
    return (
      <>
        <Link href='/blog'><p style={{ 
          color: localPath.includes('blog') ? '#1c1c57' : ''
         }}>Blog</p></Link>
        <Link href='/pricing'><p style={{ 
          color: localPath.includes('pricing') ? '#1c1c57' : ''
         }}>Pricing</p></Link>
        <Link href='/sign-in'><p style={{ 
          color: localPath.includes('sign-in') ? '#1c1c57' : ''
         }}>Sign In</p></Link> 
      </>
    );
  };

  const isMobile = () => width < 1100;

  const shouldRenderMobileLinks = () => {
    return (localPath.includes('dashboard') || localPath.includes('settings')) && width < 1215 || isMobile();
  };

  // the style for desktop-menu to be changed back to 21% instead of 30%
  return (
    <header id='header'>
      <span className='logo' onClick={() => router.push('/')}>
        <Image src='/logo.svg' alt='SumBroo logo' width={50} height={50} />
        <span className='logo-text'>
          <span style={{ fontWeight: 'bold' }}>{width < 500 ? 'S' : 'Sum'}</span>
          <span style={{ fontWeight: 'regular' }}>{width < 500 ? 'B' : 'Broo'}</span>
        </span>
      </span>

      { shouldRenderMobileLinks() ? 
        <SlideMenu links={renderLinks(true)} /> :
        <div className='desktop-menu' style={{ width: signedIn ? '24%' : '25%' }}>
          { renderLinks(false) }
        </div>
      }
    </header>
  );
};

export default Header;