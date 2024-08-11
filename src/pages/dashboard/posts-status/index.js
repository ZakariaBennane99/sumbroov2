/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import Feedback from '../../../../components/Feedback';


const PostsStatus = ({ data, isServerError }) => {

  const router = useRouter();


  if (data && data.length === 0) {
    return (
      <div className="postStatusContainer">
        <div className='emptyContainer'>
          <p>
            Nothing&apos;s here 🤷‍♂️. Get started by publishing some posts <span onClick={() => router.push('/dashboard/publish-a-post')}> here.</span>
          </p>
        </div> 
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
        <div className="postStatusContainer">
          <div className="innerContainer">
            <div className="published">
              <div className="titles">Published</div>
              {
                data && data.publishedPosts.length > 0 ?
                data.publishedPosts.map((el, i) => {
                  const date = new Date(el.date);
                  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                  return <div key={i} className='body'>
                    <p>{_.startCase(el.pinTitle)}</p>
                    <div>
                      <span onClick={() => window.open(el.postLink, '_blank')} className='platform'>
                        <img id='smlg' src={`/sm/pinterest.svg`} /> 
                        <span>Pinterest</span> 
                        <img id='link' src='/linkToPost.svg' />
                      </span>
                      <span className='date'>{formattedDate}</span>
                    </div>
                  </div>
                }) :
                <div className='body'>
                There are no published posts at the moment.
              </div>
              }
            </div>
            <div>
            <div className='titles'>In Review</div>

            {
              data && data.inReviewPosts.length > 0 ? 
              data.inReviewPosts.map((el, i) =>
              <div key={i} className='body'>
                <p>{_.startCase(el.pinTitle)}</p>
                <div>
                  <span className='platform' style={{ cursor: 'default', backgroundColor: '#a4a4bb' }}><img id='smlg' src={`/sm/pinterest.svg`} /><span style={{ marginRight: '5px' }}>Pinterest</span></span>
                </div>
              </div>) : 
              <div className='body'>
                No posts are in review at the moment.
              </div>
            }
            </div>

          </div>  
          <div className="titlesContainer">
              <div className='titles'>Need Revision</div>
              {
                data && data.inReviewPosts.length > 0 ?
                data.rejectedPosts.map((el, i) => 
                  <div key={i} className='body'>
                    <p className='postTitle'>{_.startCase(el.pinTitle)}</p>
                    <div>
                        <span className='platform' style={{ cursor: 'default', backgroundColor: '#a4a4bb' }}><img id='smlg' src={`/sm/pinterest.svg`} /><span style={{ marginRight: '5px' }}>Pinterest</span></span>
                    </div>
                    <div id="feedback-box">
                      {
                        el.comment.split('\n').map((elem, i) => 
                          <div key={i} className='feedback-points part'>{elem}</div>
                        )
                      }
                      <button onClick={ () => { router.push('/dashboard/publish-a-post'); } } className="create-post-button">Create a New Post</button>
                    </div>
                  </div>
                ) : 
                <div className='body'>
                No post needs revision at the moment.
              </div>
              }
            </div>

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

export default PostsStatus;


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
    
    const inReview = [
      { $match: { _id: new mongoose.Types.ObjectId(sanitizedUserId) } },
      { $unwind: '$socialMediaLinks' },
      { $match: { 'socialMediaLinks.platformName': 'pinterest' } },
      { $unwind: '$socialMediaLinks.posts' },
      { $match: { 'socialMediaLinks.posts.postStatus': 'in review' } },
      { $sort: { 'socialMediaLinks.posts.publishingDate': -1 } }, // sort by publishing date in descending order
      { $limit: 7 }, // limit to the last seven posts
      {
        $project: {
          _id: 0,
          pinTitle: '$socialMediaLinks.posts.postTitle',
        }
      }
    ];

    const rejected = [
      { $match: { _id: new mongoose.Types.ObjectId(sanitizedUserId) } },
      { $unwind: '$socialMediaLinks' },
      { $match: { 'socialMediaLinks.platformName': 'pinterest' } },
      { $unwind: '$socialMediaLinks.posts' },
      { $match: { 'socialMediaLinks.posts.postStatus': 'rejected' } },
      { $sort: { 'socialMediaLinks.posts.publishingDate': -1 } }, // sort by publishing date in descending order
      { $limit: 7 },
      {
        $project: {
          _id: 0,
          pinTitle: '$socialMediaLinks.posts.postTitle',
          comment: '$socialMediaLinks.posts.comment'
        }
      }
    ];

    const published = [
      { $match: { _id: new mongoose.Types.ObjectId(sanitizedUserId) } },
      { $unwind: '$socialMediaLinks' },
      { $match: { 'socialMediaLinks.platformName': 'pinterest' } },
      { $unwind: '$socialMediaLinks.posts' },
      { $match: { 'socialMediaLinks.posts.postStatus': 'published' } },
      { $sort: { 'socialMediaLinks.posts.publishingDate': -1 } }, // sort by publishing date in descending order
      { $limit: 7 },
      {
        $project: {
          _id: 0,
          pinTitle: '$socialMediaLinks.posts.postTitle',
          date: '$socialMediaLinks.posts.publishingDate',
          postLink: '$socialMediaLinks.posts.postLink'
        }
      }
    ];

    const publishedPosts = await User.aggregate(published);
    const inReviewPosts = await User.aggregate(inReview);
    const rejectedPosts = await User.aggregate(rejected);

    return {
      props: {
        signedIn: true,
        dash: true,
        data: {
          publishedPosts: JSON.parse(JSON.stringify(publishedPosts)),
          inReviewPosts: JSON.parse(JSON.stringify(inReviewPosts)),
          rejectedPosts: JSON.parse(JSON.stringify(rejectedPosts))
        }
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