// pages/sitemap.xml.js

function generateSiteMap(posts) {

    const staticPages = [
      '/',
      '/blog',
      '/pricing',
      '/sign-in',
      '/about',
      '/contact-us',
      '/privacy-policy',
      '/terms-and-conditions',
    ];
  
    const blogPostPages = posts.map(post => `/blog/${post.fields.slug}`);
  
    const allPages = [...staticPages, ...blogPostPages];
  
    // Removed the leading newline before the XML declaration
    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allPages
          .map(url => {
            return `
              <url>
                <loc>${`https://sumbroo.com${url}`}</loc>
              </url>
            `;
          })
          .join('')}
      </urlset>
    `;
}

function SiteMap() {
  // This function will not return any JSX as the response is handled by getServerSideProps
}

export async function getServerSideProps({ res }) {

    const contentful = require('contentful');

    const client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });

    const entries = await client.getEntries({ content_type: 'blogPost' }); 
  
    // Generate the XML sitemap
    const sitemap = generateSiteMap(entries.items);

    console.log('the sitemap', sitemap)
  
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  
    return {
      props: {},
    };

}

export default SiteMap;
