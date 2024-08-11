/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import Modal from 'react-modal';
import Feedback from '../../../../components/Feedback';
import { useRouter } from 'next/router';


const Archive = ({ data, isServerError }) => {

  const router = useRouter();

  if (data && data.length === 0) {
    return (
      <div className="postStatusContainer">
        <div className='emptyContainer'>
          <p>
            Nothing&apos;s here 🤷‍♂️. Get started by publishing some posts <span onClick={() => router.push('/dashboard/publish-a-post')}> here.</span>
          </p>
        </div> 
        <Feedback />   
    </div>
    )
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

  return (
        <div className="archiveSection">
          {
            data.map((el, i) =>
              <div key={i} className='body'>
                <p>{_.startCase(el.title)}</p>
                <div>
                  <span className='platform'><img id='smlg' src={`/sm/${el.platform}.svg`} /> <span>{_.startCase(el.platform)}</span> <img id='link' src='/linkToPost.svg' /></span>
                  <span className='date'>{el.date}</span>
                </div>
              </div>
            )
          }
          <Modal
              isOpen={isServerError}
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
    </div>)

};

export default Archive;


export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');
  const connectDB = require('../../../../utils/connectUserDB');
  const mongoSanitize = require('express-mongo-sanitize');
  const User = require('../../../../utils/User').default;
  const mongoose = require('mongoose');

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

    await connectDB();

    const sanitizedUserId = mongoSanitize.sanitize(userId);

    const archived = [
      { $match: { _id: new mongoose.Types.ObjectId(sanitizedUserId) } },
      { $unwind: '$socialMediaLinks' },
      { $match: { 'socialMediaLinks.platformName': 'pinterest' } },
      { $unwind: '$socialMediaLinks.posts' },
      { $match: { 'socialMediaLinks.posts.postStatus': 'published' } },
      { $sort: { 'socialMediaLinks.posts.publishingDate': -1 } }, // sort by publishing date in descending order
      { $skip: 7 }, // skip the last seven posts
      {
        $project: {
          _id: 0,
          pinTitle: '$socialMediaLinks.posts.postTitle',
          date: '$socialMediaLinks.posts.publishingDate',
          postLink: '$socialMediaLinks.posts.postLink',
        }
      }
    ]

    const archivedPosts = await User.aggregate(archived)

    // continue rendering
    return {
      props: {
        signedIn: true,
        dash: true,
        data: archivedPosts
      }
    };


  } catch (error) {
    return {
      props: {
        isServerError: true,
        signedIn: true,
        dash: true
      }
    };
  }

}