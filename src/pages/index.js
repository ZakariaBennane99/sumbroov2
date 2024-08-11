/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordionItem">
      <div className="accordionTitle" onClick={toggleAccordion}>
        {title}
      </div>
      {isOpen && (
        <div
          className="accordionContent"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
    </div>
  );
};

const Accordion = () => {
  const items = [
    {
      title: "What is SumBroo?",
      content:
        "SumBroo is a unique platform that facilitates connections between social media creators, allowing for collaborative growth and reach.",
    },
    {
      title: "Why should I join SumBroo?",
      content: "If you&apos;re a social media creator looking to expand your influence, acquire daily high-quality content, and grow in a cost-effective manner, SumBroo is for you. With an opportunity to reach up to 1M engaged followers per month per platform, detailed analytics, and a vetted community, you&apos;re set for success.",
    },
    {
      title: "How do I join the network?",
      content:
        "Joining is simple. Apply, get approved, select your preferred plan, make your payment, connect your social media accounts and start guest posting!",
    },
    {
      title: "How do I connect my social media accounts?",
      content:
        "Once you&apos;re approved, you&apos;ll be guided through an easy process to connect your social media accounts to SumBroo.",
    },
    {
      title: "What does the vetting process involve?",
      content:
        "To ensure quality, all creators are carefully vetted before joining our network. This includes reviewing your content quality, consistency, engagement, and followers.",
    },
  ];

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

const Landing = ({ windowWidth }) => {
  const [isPlayed, setIsPlayed] = useState(false);

  const router = useRouter();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "SumBroo",
        "url": "https://www.yourwebsite.com",
        "logo": "https://sumbroo.com/logo.svg",
        "sameAs": [
          "https://www.facebook.com/CreatorGuestPost",
          "https://www.instagram.com/creatorguestpost/",
        ],
      },
      {
        "@type": "WebSite",
        "name": "SumBroo",
        "url": "https://www.sumbroo.com",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.sumbroo.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://www.sumbroo.com/blog",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Pricing",
            "item": "https://www.sumbroo.com/pricing",
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Launching Soon",
            "item": "https://www.sumbroo.com/launching-soon",
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "About",
            "item": "https://www.sumbroo.com/about",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is SumBroo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SumBroo is a unique platform that facilitates connections between social media creators, allowing for collaborative growth and reach.",
            },
          },
          {
            "@type": "Question",
            "name": "Why should I join SumBroo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "If you&apos;re a social media creator looking to expand your influence, acquire daily high-quality content, and grow in a cost-effective manner, SumBroo is for you. With an opportunity to reach up to 1M engaged followers per month per platform, detailed analytics, and a vetted community, you&apos;re set for success.",
            },
          },
          {
            "@type": "Question",
            "name": "How do I join the network?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Joining is simple. Apply, get approved, select your preferred plan, make your payment, connect your social media accounts and start guest posting!",
            },
          },
          {
            "@type": "Question",
            "name": "How do I connect my social media accounts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Once you&apos;re approved, you&apos;ll be guided through an easy process to connect your social media accounts to SumBroo.",
            },
          },
          {
            "@type": "Question",
            "name": "What does the vetting process involve?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To ensure quality, all creators are carefully vetted before joining our network. This includes reviewing your content quality, consistency, engagement, and followers.",
            },
          },
        ],
      },
    ],
  };

  const toggleVideo = () => {
    setIsPlayed(!isPlayed);

    const video = document.getElementById("videoPlayer");
    const button = document.getElementById("toggleButton");

    if (video.paused) {
      video.play();
      button.classList.add("paused");

      // Show the button for 2 seconds then hide it
      button.style.display = "block";
      setTimeout(() => {
        button.style.display = "none";
      }, 200);
    } else {
      video.pause();
      button.classList.remove("paused");
      // Show the button and keep it visible
      button.style.display = "block";
    }
  };

  return (
    <>
      <Head>
        <title>SumBroo - Streamlined Creator Partnerships</title>
        <meta
          name="description"
          content="Experience unprecedented growth with SumBroo&apos;s automated social media guest posting. Join us today and take your influence to the next level."
        />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <header id="heroSection">
        <h1>Effortlessly Reach Thousands of Fans</h1>
        <p>
          Join forces with top creators across all social media platforms and
          watch your audience grow with hassle-free content exchanges.
        </p>
        <button onClick={() => router.push("/pricing")}>
          Get Early Access Now
        </button>
      </header>
      <main>
        <div className="divider-container">
          <Image
            id="divider"
            src="./divider.svg"
            alt=""
            width={290}
            height={50}
          />
        </div>
        <h2 className="sectionTitle">Demo Video</h2>
        <section className="video-section">
          <video
            loading="lazy"
            id="videoPlayer"
            width="100%"
            onClick={toggleVideo}
          >
            <source src="https://general-media-1234.s3.amazonaws.com/SumBroo_Video_Demo.mp4" type="video/mp4" />
          </video>
          <span id="toggleButton" onClick={toggleVideo}>
            <Image
              src={isPlayed ? `/pauseHero.svg` : `/playHero.svg`}
              width={100}
              height={100}
            />
          </span>
        </section>
        <div className="divider-container">
          <Image
            id="divider"
            src="./divider.svg"
            alt=""
            width={290}
            height={50}
          />
        </div>
        <h2 className="sectionTitle">What&apos;s In It For Me?</h2>
        <section id="featuresContainer">
          <div>
            <h3>Targeted Reach, Better Engagement</h3>
            <Image
              src="/feature_targeting.svg"
              width={263}
              height={250}
              alt="Man using a large magnet to attract diverse profiles towards a content board, illustrating SumBroo&apos;s capability to identify and engage the best network members for specific niches and adjacent sub-niches."
            />
            <p>
              Reach the followers who are genuinely interested in what you have
              to share. More relevant eyes on your content means real engagement
              and a growing community around your brand.
            </p>
          </div>
          <div>
            <h3>Build Trust with Quality Content</h3>
            <Image
              src="/feature_content.svg"
              width={324}
              height={250}
              alt="Determined individual highlighting a detailed document next to a laptop displaying multimedia content, surrounded by appreciation icons, representing the rigorous review and quality assurance of posts in the SumBroo network."
            />
            <p>
              Every piece of content you share is handpicked for quality,
              ensuring that what your audience sees is always top-notch. This
              builds trust and keeps them coming back for more.
            </p>
          </div>
          <div>
            <h3>Expand Your Reach to Engaged Audiences</h3>
            <Image
              src="/feather_growth.svg"
              width={292}
              height={250}
              alt="Illustration of a businessman confidently navigating financial growth arrows, symbolizing SumBroo&apos;s strategic selection of network members to amplify posts within and across niches."
            />
            <p>
              Connect with an active community of up to 1 million people every
              month who are eager to see and interact with your content.
            </p>
          </div>
          <div>
            <h3>Maximize Your Content&apos;s Impact</h3>
            <Image
              src="/feature_cheap.svg"
              width={275}
              height={250}
              alt="Professional man with a laptop, seated next to a calendar for January, overlooking a circulating dollar bill, symbolizing the continuous value and returns of a monthly commitment with SumBroo."
            />
            <p id="textBrowsers">
              Every post delivers more than just views - gain deep insights and
              greater engagement to ensure every post adds value to your
              presence.
            </p>
          </div>
          <div>
            <h3>Refine Your Approach with Smart Insights</h3>
            <Image
              src="/featured_analytics.svg"
              width={284}
              height={250}
              alt="An individual engaging with a dynamic digital interface, showcasing graphs, charts, and data breakdowns. This scene highlights the advanced analytics provided by SumBroo, enabling users to understand audience behavior."
            />
            <p>
              Understand what resonates with your audience. Our analytics guide
              you to create content that hits the mark every time.
            </p>
          </div>
          <div>
            <h3>Join a Trusted Network of Creators</h3>
            <Image
              src="/feature_quality.svg"
              width={255}
              height={250}
              alt="Two individuals closely examining digital content, representing SumBroo&apos;s meticulous vetting process to ensure high-quality member contributions and interactions."
            />
            <p>
              Be part of an exclusive community where quality is guaranteed.
              Every interaction is with creators who meet our high standards.
            </p>
          </div>
        </section>
        <div className="divider-container">
          <Image
            id="divider"
            src="./divider.svg"
            alt=""
            width={290}
            height={50}
          />
        </div>
        <h2 className="sectionTitle">How It Works?</h2>
        <section className="howToSection">
          <div>
            <h3>Step 1: Apply for Access</h3>
            <img src="./stepsUnderline.svg" alt="" />
          </div>
          <button onClick={() => router.push("/pricing")}>
            Get Early Access Now
          </button>
          <div>
            <h3>Step 2: Connect Your Profiles</h3>
            <img src="./stepsUnderline.svg" alt="" />
          </div>
          <Image
            width={1057}
            height={504}
            className="steps"
            src={windowWidth < 850 ? "./step2-mobile.svg" : "./step2.svg"}
            alt="SumBroo screenshot illustrating Step 2: Connect Social Media Accounts with arrows pointing to 'Linked Accounts' section and a Pinterest account with 'Unlink Account' button."
          />
          <div>
            <h3>Step 3: Engage and Grow</h3>
            <img src="./stepsUnderline.svg" alt="" />
          </div>
          <Image
            width={1057}
            height={504}
            className="steps"
            src={windowWidth < 850 ? "./step3-mobile.svg" : "./step3.svg"}
            alt="SumBroo dashboard screenshot illustrating Step 3: Guest Posting for Pinterest with platform selection, content addition, and a preview of a summer activities post."
          />
          <div>
            <h3>Step 4: Track Your Success</h3>
            <img src="./stepsUnderline.svg" alt="" />
          </div>
          <Image
            width={1057}
            height={595}
            style={{ marginTop: "0px", marginBottom: "0px" }}
            className="steps"
            src={windowWidth < 850 ? "./step4-mobile.svg" : "./step4.svg"}
            alt="SumBroo dashboard screenshot demonstrating Step 4: Monitoring growth using detailed analytics, showcasing interactive graphs for engagement metrics and the option to select from the 7 most recent posts."
          />
        </section>
        <div className="divider-container">
          <Image
            style={{ marginTop: "0px" }}
            id="divider"
            src="./divider.svg"
            alt=""
            width={290}
            height={50}
          />
        </div>
        <section>
          <h2 className="sectionTitle">Frequently Asked Questions</h2>
          <Accordion />
        </section>
        <section className="landing-last-section">
          <h2>
            Ready to take your influence
            <br /> to the next level?
          </h2>
          <button onClick={() => router.push("/pricing")}>
            Get Early Access Now
          </button>
        </section>
      </main>
    </>
  );
};

export default Landing;

export async function getServerSideProps(context) {
  
  const jwt = require("jsonwebtoken");

  let signedIn = false;

  try {
    const cookies = context.req.headers.cookie;

    const tokenCookie = cookies
      .split(";")
      .find((c) => c.trim().startsWith("token="));

    let tokenValue;
    if (tokenCookie) {
      tokenValue = tokenCookie.split("=")[1];
    }

    const decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);

    if (decoded.type !== "sessionToken") {
      signedIn = false;
    }

    signedIn = true;
  } catch (err) {
    signedIn = false;
  }

  return {
    props: {
      notProtected: true,
      signedIn: signedIn,
    },
  };
}
