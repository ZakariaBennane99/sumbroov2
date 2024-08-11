/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import Link from 'next/link';


const Header = () => {

  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
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

  return (
        windowWidth <= 865 ? 
        <footer id='footer'>
          <nav>
            <Link href='/about'><p>About</p></Link>
            <Link href='/contact-us'><p>Contact Us</p></Link>
            <Link href='/privacy-policy'><p>Privacy Policy</p></Link>
            <Link href='/terms-and-conditions'><p>Terms & Conditions</p></Link>
          </nav>
          <p id='company'>© 2023 <a href='https://drivendynamics.co.uk' rel="noopener noreferrer" target="_blank" style={{ color: '#003ea1', cursor: 'pointer' }}>Driven Dynamics Limited</a>. All rights reserved.</p>
        </footer>
         :
        <footer id='footer'>
          <p id='company'>© 2023 <a href='https://drivendynamics.co.uk' rel="noopener noreferrer" target="_blank" style={{ color: '#003ea1', cursor: 'pointer' }}>Driven Dynamics Limited</a>. All rights reserved.</p>
          <nav>
            <Link href='/about'><p>About</p></Link>
            <Link href='/contact-us'><p>Contact Us</p></Link>
            <Link href='/privacy-policy'><p>Privacy Policy</p></Link>
            <Link href='/terms-and-conditions'><p>Terms & Conditions</p></Link>
          </nav>
        </footer>
  )
};

export default Header;
