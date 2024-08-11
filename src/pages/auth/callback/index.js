// pages/404.js
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

function Custom404() {
    return (<div className='Er404-parent-section'>
        <Header />
            <div className='Error-container'>
              <h1 style={{ fontSize: '2.5em' }}>Page Not Found</h1>
              <img src="/404.svg" />
              <button style={{ width: 'fit-content', 
                padding: '15px 25px 15px 25px', 
                fontSize: '1.5em',
                marginBottom: '70px' }}>Go Back To The Homepage</button>
            </div>
        <Footer />
      </div>
    );
}
  
export default Custom404;
  