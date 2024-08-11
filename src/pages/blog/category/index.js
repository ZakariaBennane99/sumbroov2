
function Custom404() {

  return (<div className='Error-container'>
            <h1 style={{ fontSize: '2.5em' }}>Page Not Found</h1>
            <img src="/404.svg" />
            <button style={{ width: 'fit-content', 
              padding: '15px 25px 15px 25px', 
              fontSize: '1.5em',
              marginBottom: '70px' }}>Go Back To The Homepage</button>
  </div>
  );
}
  
export default Custom404;

export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');

  let signedIn = false;
      
  try {

    const cookies = context.req.headers.cookie;

    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
    
    let tokenValue;
    if (tokenCookie) {
      tokenValue = tokenCookie.split('=')[1];
    }
    
    const decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);
    
    if (decoded.type !== 'sessionToken') {
        signedIn = false
    }

    signedIn = true;

  } catch (err) {
    signedIn = false
  }

  return {
    props: {
      notProtected: true,
      isErr404: true,
      signedIn: signedIn
    }
  };

}
  