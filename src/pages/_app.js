import React, { useState } from 'react';
import Router from 'next/router';
import '@/styles/globals.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HomeMenu from '../../components/HomeMenu';
import { useRouter } from 'next/router';
import SettingsMenu from '../../components/SettingsMenu';
import { OneEightyRing } from 'react-svg-spinners';
import GoogleAnalytics from '../../components/GoogleAnalytics';

export default function MyApp({ Component, pageProps }) {

  const signed = pageProps.signedIn;
  const set = pageProps.isSettings;
  const proct = pageProps.notProtected;
  const is404 = pageProps.isErr404;
  const onboard = pageProps.onboarding;
  const blog = pageProps.isBlog;
  const dashboard = pageProps.dash;

  const isSettings = set || false;
  const signedIn = signed || false;
  const notProtected = proct || false;
  const isErr404 = is404 || false;
  const onboarding = onboard || false;
  const isBlog = blog || false;
  const dash = dashboard || false;

  const all = !isErr404 && !onboarding && !isBlog && !notProtected && !isSettings;

  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const [mountedLoading, setMountedLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(router.pathname);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    setMountedLoading(false)
    // Update the window width when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  React.useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  React.useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  if (mountedLoading) {
    return <div style={{ width: '100%', minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <OneEightyRing width={70} height={70} color='rgb(28, 28, 87)' />
    </div> 
  }
  
  return (
    <div id={( (isErr404 || onboarding || isBlog) || (all) ) 
      ? 'Er404-parent-section' 
    : 'parentWrapper' }>
      <Header key={router.pathname} signedIn={signedIn} width={windowWidth} currentPath={router.pathname} />
      <GoogleAnalytics />
      {
        (notProtected || all) && !dash ? 
        <>
          {loading ? (
            <div style={{ width: '100%', minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <OneEightyRing width={70} height={70} color='rgb(28, 28, 87)' />
            </div> 
          ) : (
            <Component {...pageProps} windowWidth={windowWidth} />
          )}
        </>
        :
        <div className="resultsSection">
          <div className='homeContainer'>
            {
              (windowWidth > 1215 && signedIn) ? (
                isSettings ? 
                  <SettingsMenu pathname={currentPath} />
                :
                  <HomeMenu pathname={currentPath} />
              ) : ''
            }
            {loading ? (
            <div style={{ width: '76%', minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <OneEightyRing width={70} height={70} color='rgb(28, 28, 87)' />
            </div> 
          ) : (
              <Component {...pageProps} windowWidth={windowWidth} />
            )}
          </div>  
        </div>  
      }
      <Footer />
    </div>
  );
}