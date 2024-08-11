/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Head from "next/head";


const About = () => {

    return (
        <div className='footerSections'>
            <Head>
              <title>Sumbroo - About</title>
              <meta name="description" content="Learn more about Zakaria Bennane, the founder of Sumbroo, and the story behind the platform." />
            </Head>
            <h1 className="sectionTitle">About</h1>
            <div className="aboutContentSection">
                <div className="textContent">
                  <p style={{ marginTop: '0px' }}>
                  Hey 👋! I&apos;m Zakaria Bennane, I come from the lively city of Casablanca <em>(that&apos;s the Atlantic Ocean behind me)</em>. Life handed me its fair share of challenges growing up, but they made me stronger and shaped who I am today.
                  </p>
  
                  <p>
                  I&apos;ve been exploring social media for a while, and I noticed a big problem. A lot of talented people who make great content are struggling to get noticed. But that&apos;s not all; it&apos;s also super difficult to team up with other creators. The whole process can be slow, risky, and even expensive.
                  </p>
  
                  <p>
                  That got me thinking. Why is it so hard? That&apos;s when the idea for SumBroo popped into my head. No one else seemed to be fixing this, so I rolled up my sleeves and got to work. Sure, it was a lot of effort, but my dream for SumBroo kept me going.
                  </p>
  
                  <p>
                  What&apos;s SumBroo all about? It&apos;s all about bringing creators together. With SumBroo, you can easily share your work on multiple social media platforms without the usual headaches. Plus, we offer useful analytics for each of your posts. This is something you might not get if you&apos;re working with other creators the old-fashioned way.
                  </p>
  
                  <p>
                  Thank you for taking to learn to learn about SumBroo and my journey. I&apos;m glad you&apos;re here.
                  </p>
  
                  <p>
                  Warmly, <br/>
                  Z.B.
                  </p>
                </div>
                <img src="/zakBen.jpeg" alt="Zakaria Bennane from Casablanca" className="aboutImage" />
            </div>
        </div>
    )

};

export default About;

export async function getServerSideProps() {

  return {
    props: {
      notProtected: true
    }
  };

}
