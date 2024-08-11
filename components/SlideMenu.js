import { useState } from 'react';

const SlideMenu = ({ links }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className='slide-menu'>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={isMenuOpen ? 'close' : 'burger'}>
        <img style={{ width: '35px', padding: '0px', margin: '0px' }} src={isMenuOpen ? '/close.svg' : '/burger.svg' } />  
      </button>
      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}
      <div className={isMenuOpen ? 'mobile-menu open' : 'mobile-menu'}>
          {links}
      </div>
    </div>
  );
}

export default SlideMenu;
