import { useEffect, useState } from 'react';
import Meta from '../../../components/Meta';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon
  } from 'next-share';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import Image from 'next/image';


function slugTag(tag) {
  return tag
  .replace(/([a-zA-Z])([A-Z])/g, '$1-$2')
  .toLowerCase();
}

function camelToWords(str) {
  return str
      // Insert a space before all capital letters
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' '); // Split the string into an array of words
}

function readingTime(st) {
  const wordCount = st.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200)
  const readingTimeInMin = readTime + ' Min Read'
  return readingTimeInMin
}

function formatDate(inputDate) {

  const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
  ];
  
  const date = new Date(inputDate);
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;

}

function extractHeadings(content) {
  const headings = [];
  content.content.forEach(item => {

    if (item.nodeType.includes('heading') && item.content[0].nodeType === 'text') {
      const value = item.content[0].value;
      const id = "heading-" + value.toLowerCase().replace(/\W/g, '-');
      headings.push({ id, value });
    }
  });
  return headings;
}

const Content = ({ bd, hash, setHash, under }) => {

  const headings = extractHeadings(bd);

  const handleTOCClick = (hashValue) => {
    setHash(hashValue);
  } 

  return (<>
    {
      under ? <hr style={{ marginBottom: '20px' }} /> : ''
    }
    <div id="table-of-contents" style={{ 
      position: under ? 'relative' : 'sticky', 
      width: under ? '100%' : '',
      top: under ? '0px' : ''
    }}>
    <h4>Table of Contents</h4>
    <div>
      {headings.map((heading, index) => (
        <span key={index}>
          <a onClick={() => handleTOCClick(`${heading.id}`)} href={`#${heading.id}`} style={{ color: hash === heading.id ? '#1465e7' : '' }}>{heading.value}</a>
        </span>
      ))}
    </div>
  </div>
  {
    under ? <hr style={{ marginTop: '20px' }} /> : ''
  }
  </>)
}

const SocialSharing = ({ slug, under }) => {

  const style = {
    width: 'fit-content',
    position: 'relative',
    top: '0px',
    display: 'flex',
    justifyContent: 'space-between'
  }

  return (<>
   {
    under ? <hr style={{ marginTop: '30px', marginBottom: '30px' }} /> : ''
   }
  <div className="social-sharing" style={ under ? style : {} }>

      <h4 style={{ marginRight: under ? '20px' : '' }}>Share This Post</h4>
  
      <div>
       <TwitterShareButton style={{ width: '32px', height:'32px' }}
         url={`https://sumbroo.com/blog/${slug}`} >
         <TwitterIcon style={{ width: '100%', height: '100%' }} rectangle={true} borderRadius={7} />
       </TwitterShareButton>
       <LinkedinShareButton style={{ width: '32px', height:'32px' }}
         url={`https://sumbroo.com/blog/${slug}`} >
         <LinkedinIcon style={{ width: '100%', height: '100%' }} rectangle={true} borderRadius={7} />
       </LinkedinShareButton>
       <FacebookShareButton style={{ width: '32px', height:'32px' }}
         url={`https://sumbroo.com/blog/${slug}`} >
         <FacebookIcon style={{ width: '100%', height: '100%' }} rectangle={true} borderRadius={7} />
       </FacebookShareButton>
      </div>
    </div>
  </>)
}

function Post({ post, windowWidth }) {

  const [hash, setHash] = useState(null)

  function renderHeading(level, node, children) {
    const value = node.content[0].value;
    const id = "heading-" + value.toLowerCase().replace(/\W/g, '-');

    const HeadingComponent = `h${level}`; // This will be dynamic: h1, h2, h3, etc.
    return (
        <HeadingComponent id={id} style={{ fontSize: `${2.5 - level * 0.2}em`, fontWeight: 'bold' }}>
            {children}
        </HeadingComponent>
    );
  }

    const options = {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: node => {
            const { title, description, file } = node.data.target.fields;
            const [desc, credit] = description.split(' | ')
            if (!file || !file.url) {
              return null;
            }

            const authorName = description.length > 0 ? credit.split(" (")[0] : '';
            const url = description.length > 0 ? credit.match(/\((.*?)\)/)[1] : ''; 

            const mimeType = file.contentType;
            const mimeGroup = mimeType.split('/')[0];
            // <span>Image credit: <a href={url}>{authorName}</a></span>
            // Construct the proxy URL
            const proxyUrl = `/api/contentfulAsset?path=${encodeURIComponent(file.url)}`;
      
            switch (mimeGroup) {
              case 'image':
                return <span>
                  <Image width={500} height={100} layout='intrinsic' className="responsive-image" title={title ? title['en-US'] : null} alt={desc ? desc['en-US'] : description} src={proxyUrl} />
                  {
                    description.length > 0 ? 
                    <span className='image-credit'>Image credit: <a href={url} target="_blank">{authorName}</a></span> : ''
                  }
                </span>
              case 'application':
                return <a href={proxyUrl}>{title ? title['en-US'] : file.details.fileName}</a>;
              case 'video':
                return (
                    <div className="responsive-video-wrapper">
                        <video controls width="100%">
                            <source src={proxyUrl} type={mimeType} />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );
              default:
                return <span style={{ backgroundColor: 'red', color: 'white' }}> {mimeType} embedded asset </span>;
            }
          },
          [BLOCKS.EMBEDDED_ENTRY]: node => {
            if (node.data.target.sys.contentType.sys.id === 'video') {
                const videoUrl = node.data.target.fields.videoUrl;
                return <div className="responsive-video-wrapper">
                    <iframe src={videoUrl} frameBorder="0" credentialless="true" allowFullScreen></iframe>;
                </div>
            }
            return null;
          },
          [BLOCKS.HEADING_1]: (node, children) => renderHeading(1, node, children),
          [BLOCKS.HEADING_2]: (node, children) => renderHeading(2, node, children),
          [BLOCKS.HEADING_3]: (node, children) => renderHeading(3, node, children),
          [BLOCKS.HEADING_4]: (node, children) => renderHeading(4, node, children),
          [BLOCKS.HEADING_5]: (node, children) => renderHeading(5, node, children),
          [BLOCKS.HEADING_6]: (node, children) => renderHeading(6, node, children),
          [BLOCKS.PARAGRAPH]: (node, children) => (
            <p style={{ fontSize: '1.2em', lineHeight: '1.5', color: '#101043' }}>
                {children}
            </p>
          ),
          [BLOCKS.LIST_ITEM]: (node, children) => (
              <li style={{ marginBottom: '5px' }}>
                  {children}
              </li>
          ),
          [BLOCKS.QUOTE]: (node, children) => (
            <blockquote style={{ 
                borderLeft: '4px solid #efefef;', 
                paddingLeft: '20px',
                fontSize: '18px',
                fontStyle: 'italic',
                margin: '20px 0'
            }}>
                {children}
            </blockquote>
          ),
          [INLINES.HYPERLINK]: (node, children) => {
              const uri = node.data.uri;
              return (
                  <a 
                      href={uri} 
                      style={{ textDecoration: 'none', color: '#1465e7', cursor: 'pointer' }}
                      target="_blank"
                  >
                      {children}
                  </a>
              );
          },          
        }
    };


    function onChange(changes) {
      changes.forEach(change => {
          if (change.isIntersecting) {
            setHash(change.target.id)
            history.pushState(null, null, `#${change.target.id}`);
          }
      });
    }

    useEffect(() => {
      // Refactor the event handler into its own function
      const handleAnchorClick = function (e) {
          e.preventDefault();
  
          const targetElement = document.querySelector(this.getAttribute('href'));
          if (targetElement) {  // Ensure the element exists
              targetElement.scrollIntoView({
                  behavior: 'smooth'
              });
          }
      };
  
      // Add event listeners
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', handleAnchorClick);
      });
      //
      let observer = new IntersectionObserver(onChange, {
          threshold: [0.5] // Adjust to detect when half of the element is visible
      });
  
      let headings = document.querySelectorAll('h2');  // Assuming you&apos;re only targeting h2 for this
  
      headings.forEach(h => {
          observer.observe(h);
      });
  
      // Cleanup function to remove event listeners and observer
      return () => {
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              // Remove the event listener with the refactored function
              anchor.removeEventListener('click', handleAnchorClick);
          });
          if (observer) {
              observer.disconnect();
          }
      };
    }, [hash]);

    console.log('The blog', post.fields.featuredImage.fields.file)

// post.fields.slug
return (
  <article className='post-container' aria-labelledby="blog-post-title">
      <Meta 
          title={post.fields.title}
          description={post.fields.excerpt}
          image={`https:${post.fields.featuredImage.fields.file.url}`}
          url={`https://sumbroo.com/blog/${post.fields.slug}`}
      />
      { windowWidth > 1000 ? <Content bd={post.fields.body} hash={hash} setHash={setHash} under={false} /> : '' }

      <div className='blog-main' style={{ width: windowWidth < 1000 ? '100%' : '50%' }}>

          <header className='blog-main-meta'>
              <p className='category'>
                  <a href={`/blog/category/${slugTag(post.metadata.tags[0].sys.id)}`} rel='tag'>
                      {camelToWords(post.metadata.tags[0].sys.id).join(' ').toUpperCase()}
                  </a>
              </p>
              <h1 id="blog-post-title">{post.fields.title}</h1>

              <div className='date-reading-time'>
                  <address className='author'>
                      <Image width={36} height={36} src={`/api/contentfulAsset?path=${encodeURIComponent(post.fields.author.fields.photo.fields.file.url)}`} alt={post.fields.author.fields.photo.fields.title} />
                      <span style={{ fontStyle: 'normal' }}>{post.fields.author.fields.name}</span>
                  </address>
                  <time className='date' dateTime={new Date(post.fields.publishedDate).toISOString()}>{formatDate(post.fields.publishedDate)}</time>
                  <span className='reading-time'>{readingTime(documentToPlainTextString(post.fields.body))}</span>
              </div>
          </header>

          <div className='blog-main-content'>
              { windowWidth < 1000 ? <Content bd={post.fields.body} hash={hash} setHash={setHash} under={true} /> : '' }
              <div>{documentToReactComponents(post.fields.body, options)}</div>
          </div>

          { windowWidth < 1000 ? <SocialSharing slug={post.fields.slug} under={true} /> : '' }

      </div>

      { windowWidth > 1000 ? <SocialSharing slug={post.fields.slug} under={false} /> : '' }

  </article>
);

}

export default Post;

export async function getServerSideProps(context) {

  const params = context.params;

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

  const contentful = require('contentful');

  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  });

  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': params.slug
  });

  // Check if we have received an entry
  if (entries.items.length > 0) {
    const entry = entries.items[0];
    return {
      props: {
        post: entry,
        isBlog: true,
        notProtected: true,
        signedIn: signedIn
      }
    };
  } else {
    return {
      notFound: true,
    };
  }
}
