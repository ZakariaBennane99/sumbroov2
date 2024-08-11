/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Feedback from '../../../components/Feedback';

const Home = ({ windowWidth, profileNames }) => {

  localStorage.setItem('userProfileNames', JSON.stringify(profileNames))

  return (<div style={{ width: windowWidth > 1215 ? '80%' : '100%', height: windowWidth > 1215 ? 'fit-content' : '100vh' }} className="rightSectionZenContainer">
        <img src="./zenMode.svg" alt="editing"/>
        <Feedback />
    </div>)
};

export default Home;


export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');
  const connectDB = require('../../../utils/connectUserDB');
  const User = require('../../../utils/User').default;
  const mongoSanitize = require('express-mongo-sanitize');
  const he = require('he');

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

    // connect DB
    await connectDB()

    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });

    const profileUserNames = user.socialMediaLinks.map(link => {
      return {
        platform: link.platformName,
        link: link.profileLink,
        userName: he.decode(link.profileLink).match(/\.com\/([^\/]+)/)[1]
      }
    })

    // continue rendering
    return {
      props: {
        signedIn: true,
        dash: true,
        profileNames: JSON.parse(JSON.stringify(profileUserNames))
      }
    };


  } catch (error) {
    console.log('THE ERROR', error)
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

}