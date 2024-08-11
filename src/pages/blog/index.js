import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import Image from 'next/image';
import Head from 'next/head';



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
  

function Blog({ posts }) {


    return (<>
        <Head>
                <title>SumBroo - Blog</title>
                <meta name="description" content="Explore the latest posts from SumBroo, diving deep into topics like social media guest posting, insights for micro-influencers, strategies for social media creators, and more. Stay updated with the evolving world of content creation and collaboration." />
        </Head>
        <article className='post-infos-container'>
                <header>
                    <h1>SumBroo Blog</h1>
                    <p>Discover insights on social media guest posting, tips and strategies tailored for modern-day content creators.</p>
                </header>
                <hr />
                <main style={{ height: 'auto' }} className='main-info-container'>
                    {posts.map(post => (
                        <section key={post.sys.id} className='post-info-container'>
                            <nav className='category'>
                                <a href={`/blog/category/${slugTag(post.metadata.tags[0].sys.id)}`} rel='tag'>
                                    {camelToWords(post.metadata.tags[0].sys.id).join(' ').toUpperCase()}</a>
                            </nav>
                            
                            <h2>
                                <a href={`/blog/${post.fields.slug}`} title={post.fields.title}>{post.fields.title}</a>
                            </h2>

                            <a href={`/blog/${post.fields.slug}`} title={post.fields.title} className='featured-image'>
                                <Image width={300} height={300} src={`/api/contentfulAsset?path=${encodeURIComponent(post.fields.featuredImage.fields.file.url)}`} alt={post.fields.featuredImage.fields.title} />
                            </a>

                            <p className='excerpt'>
                                {post.fields.excerpt}
                            </p>

                            <footer className='post-meta-info'>
                                <span className='author'>
                                    <img src={`/api/contentfulAsset?path=${encodeURIComponent(post.fields.author.fields.photo.fields.file.url)}`} alt={post.fields.author.fields.photo.fields.title} />
                                    <span>{post.fields.author.fields.name}</span>
                                </span>
                                <time className='date' dateTime={new Date(post.fields.publishedDate).toISOString()}>{formatDate(post.fields.publishedDate)}</time>
                                <span className='reading-time'>{readingTime(documentToPlainTextString(post.fields.body))}</span>
                            </footer>
                        </section>
                    ))}
            </main>
        </article>
    </>)
}


export default Blog;

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

    const contentful = require('contentful');

    const client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });

    const entries = await client.getEntries({ content_type: 'blogPost' }); 

    return {
      props: {
        posts: entries.items,
        isBlog: true,
        notProtected: true,
        signedIn: signedIn
      }
    };
}
