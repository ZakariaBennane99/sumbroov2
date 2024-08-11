import Head from 'next/head';

const Meta = ({ title, description, image, url }) => (
  <Head>

    <title>{title}</title>
    <meta name="description" content={description} />

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@MicroInfluPost" />
    <meta name="twitter:creator" content="@MicroInfluPost" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta property="twitter:image" content={image}/>

    <meta property="og:title" content={title}/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content={url}/>
    <meta property="og:image" content={image}/>
    <meta property="fb:app_id" content="1776394392757357"/>
    <meta property="og:description" content={description}/>

    {/* Google / Search */}
    <meta name="robots" content="index, follow" />

  </Head>
);

export default Meta;
