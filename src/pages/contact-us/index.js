
import Head from "next/head";

const ContactUs = () => {
  return (
    <div className='footerSections' style={{ marginBottom: '200px' }}>
      <Head>
        <title>Sumbroo - Contact Us</title>
        <meta name="description" content="Have a question for Sumbroo? Get in touch with us through our contact page." />
      </Head>

      <h1 className="sectionTitle">Contact Us</h1>
      <p style={{ fontFamily: 'IBM Plex Sans', width: '100%' }}>
        Have a question, drop us an email at &#160;
        <address style={{ display: 'inline-block' }}>
          <a href="mailto:hey@sumbroo.com" style={{ fontWeight: 'bold' }}>hey@sumbroo.com</a>
        </address>, 
        and we will respond as soon as possible.
      </p>
    </div>
  );
};

export default ContactUs;

export async function getServerSideProps() {

  return {
    props: {
      notProtected: true
    }
  };

}