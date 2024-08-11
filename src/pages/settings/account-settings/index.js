import dynamic from 'next/dynamic';

const AccountSettingsNoSSR = dynamic(
  () => import('../../../../components/AccountSettingsComponent'),
  { ssr: false }
);

function AccountSettings() {
  return <AccountSettingsNoSSR />;
}

export default AccountSettings;

export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');
  const User = require('../../../../utils/User').default;
  const connectDB = require('../../../../utils/connectUserDB');
  const mongoSanitize = require('express-mongo-sanitize');

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
          redirect: {
            destination: '/sign-in',
            permanent: false,
          },
        };
      }

      const userId = decoded.userId;
      
      const sanitizedUserId = mongoSanitize.sanitize(userId);
      
      await connectDB();
      let user = await User.findOne({ _id: sanitizedUserId });
    

      // send the data to the front end
      const userData = {
        username: user.name,
        email: user.email
      }
  
      // continue rendering
      return {
        props: {
          userData,
          signedIn: true,
          isSettings: true
        }
      };
  
  
    } catch (error) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }
  
}
  