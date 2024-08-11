/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import Select from 'react-select';
import Modal from 'react-modal';
import GroupedBarChart from '../../../../components/viz/GroupedBarChart';
import StackedBarChart from '../../../../components/viz/StackedBarChart';
import MultiLineChart from '../../../../components/viz/MultiLineChart';
import StatsSummary from '../../../../components/viz/StatsSummary';
import _ from 'lodash';
import Feedback from "../../../../components/Feedback";

const Analytics = ({ dataa, options, isServerError }) => {

  const data = JSON.parse(dataa)

  const [targetPost, setTargetPost] = useState(null);
  // this is for react-select
  const [targetPostKey, setTargetPostKey] = useState(null);
  
  const [engagementsData, setEngagementsData] = useState(null);
  
  function engagementsDataChange(selectedMetrics) {
    const formatedEngData = targetPost.metrics.map(post => {
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        day: formattedDate,
        'pin enlargement clicks': post.metrics.PIN_CLICK,
        'destination link clicks': post.metrics.OUTBOUND_CLICK,
        'video start clicks': post.metrics.VIDEO_START,
        saves: post.metrics.SAVE,
        reactions: post.metrics.REACTIONS,
        'unengaged impressions': post.metrics.IMPRESSION - (post.metrics.PIN_CLICK + post.metrics.OUTBOUND_CLICK + post.metrics.VIDEO_START + post.metrics.SAVE + post.metrics.REACTIONS),
        impressions: post.metrics.IMPRESSION
      }
    })
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = formatedEngData.map(dayData => {
        let updatedDayData = { ...dayData };
        let totalSelectedMetrics = 0;
        for (let key in updatedDayData) {
          if (selectedMetricsValues.includes(key)) {
            totalSelectedMetrics += updatedDayData[key];
          } else if (key !=='day' && key !=='impressions') {
            delete updatedDayData[key];
          }
        }
        updatedDayData['other'] = updatedDayData['impressions'] - totalSelectedMetrics;
        return updatedDayData;
      });
      setEngagementsData(updatedData);
    } else {
      setEngagementsData(formatedEngData);
    }
  }
  

  const [summaryData, setSummaryData] = useState(null)
  
  const [conversionData, setConversionData] = useState(null)
  
  function conversionDataChange(selectedMetrics) {
    const formatedConversionData = targetPost.metrics.map(post => {
      const strippedDate = post.date.split('-');
      return {
        day: new Date(parseInt(strippedDate[0]), parseInt(strippedDate[1]) - 1, parseInt(strippedDate[2])),
        Pinterest: {
          'Impressions (# of times your pin was on-screen)': post.metrics.IMPRESSION,
          'Pin saves': post.metrics.SAVE,
          'Destination link clicks': post.metrics.OUTBOUND_CLICK,
        }
      }
    })
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = formatedConversionData.map(dayData => {
        let updatedDayData = { day: dayData.day, Pinterest: {} };
        for (let key in dayData.Pinterest) {
          if (selectedMetricsValues.includes(key)) {
            updatedDayData.Pinterest[key] = dayData.Pinterest[key];
          }
        }
        return updatedDayData;
      });
      setConversionData(updatedData);
    } else {
      setConversionData(formatedConversionData);
    }
  }  


  const [videoData, setVideoData] = useState(null)

  function videoDataChange(selectedMetrics) {
    const formattedVideoData = targetPost.metrics.map(post => {
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        day: formattedDate,
        metrics: [
          { name: '# of people who viewed 95% of the video', value: post.metrics.QUARTILE_95_PERCENT_VIEW },
          { name: '# of video starts', value: post.metrics.VIDEO_START },
          { name: '# of people who viewed at least 10% of the video', value: post.metrics.VIDEO_10S_VIEW },
          { name: 'Total play time (in minutes)', value: post.metrics.VIDEO_V50_WATCH_TIME },
        ]
      }
    });
  
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricNames = selectedMetrics.map(metric => metric.value); // Assuming the label property holds the name of the metric
      const updatedData = formattedVideoData.map(dayData => {
        const updatedMetrics = dayData.metrics.filter(metric => selectedMetricNames.includes(metric.name));
        return { ...dayData, metrics: updatedMetrics };
      });
      setVideoData(updatedData);
    } else {
      setVideoData(formattedVideoData);
    }
  }
  

  // when selecting 
  function handlePostSelection(selectedOption) {
    const targetPost = data.filter(el => el.date === selectedOption.value);
    setTargetPostKey(selectedOption);
    setTargetPost(targetPost[0]);
  }

  
  useEffect(() => {


    /****  here where you construct data based on the post requested  ****/

    const vid = [
      "VIDEO_10S_VIEW",
      "QUARTILE_95_PERCENT_VIEW",
      "VIDEO_V50_WATCH_TIME",
      "VIDEO_START",
    ]

    if (targetPostKey) {

      const formatedEngData = targetPost.metrics.map(post => {
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          day: formattedDate,
          'pin enlargement clicks': post.metrics.PIN_CLICK,
          'destination link clicks': post.metrics.OUTBOUND_CLICK,
          'video start clicks': post.metrics.VIDEO_START,
          saves: post.metrics.SAVE,
          reactions: post.metrics.REACTIONS,
          'unengaged impressions': post.metrics.IMPRESSION - (post.metrics.PIN_CLICK + post.metrics.OUTBOUND_CLICK + post.metrics.VIDEO_START + post.metrics.SAVE + post.metrics.REACTIONS),
          impressions: post.metrics.IMPRESSION
        }
      })

      const formatedSummaryData = targetPost.metrics.map(post => {
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          day: formattedDate,
          'Impressions': post.metrics.IMPRESSION,
          'Destination Link Clicks': post.metrics.OUTBOUND_CLICK,
          'Saves': post.metrics.SAVE
        }
      })

      const formatedConversionData = targetPost.metrics.map(post => {
        const strippedDate = post.date.split('-');
        return {
          day: new Date(parseInt(strippedDate[0]), parseInt(strippedDate[1]) - 1, parseInt(strippedDate[2])),
          Pinterest: {
            'Impressions (# of times your pin was on-screen)': post.metrics.IMPRESSION,
            'Pin saves': post.metrics.SAVE,
            'Destination link clicks': post.metrics.OUTBOUND_CLICK,
          }
        }
      })

      // set the data for all
      setEngagementsData(formatedEngData)
      setSummaryData(formatedSummaryData)
      setConversionData(formatedConversionData)

      // set videoDate only if it is a video Pin
      if (!targetPost.metrics.every(entry => vid.every(key => entry.metrics[key] === 0))) {
        const formatedVideoData = targetPost.metrics.map(post => {
          const date = new Date(post.date);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return {
            day: formattedDate,
            metrics: [
              { name: '# of people who viewed 95% of the video', value: post.metrics.QUARTILE_95_PERCENT_VIEW },
              { name: '# of video starts', value: post.metrics.VIDEO_START },
              { name: '# of people who viewed at least 10% of the video', value: post.metrics.VIDEO_10S_VIEW },
              { name: 'Total play time (in minutes)', value: post.metrics.VIDEO_V50_WATCH_TIME },
            ]
          }
        })
        setVideoData(formatedVideoData)
      }

    }

  }, [targetPost])


  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '95%',
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#1c1c57',
    })
  }

  return (
    <div className="rightSectionAnalytics">
          <div style={{ backgroundColor: '#f5f6f7', 
            color: '#12123b',
            marginBottom: '20px',
            padding: '10px',
            borderRadius: '5px'
          }} className="righSectionAnalytics">
            When you choose a post, the data displayed will range from the <b> date of publication </b> (as indicated in the dropdown) up to the <b> current day.</b>
          </div>
          <div className='postSelectorContainer'>
            <Select
              value={targetPostKey}
                onChange={handlePostSelection}
                options={options}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                styles={ customStyles }
                theme={(theme) => ({
                    ...theme,
                    colors: {
                    ...theme.colors,
                      primary25: '#e8e8ee',  // color of the option when hovering
                      primary: '#1c1c57',  // color of the selected option
                    },
                })}
                placeholder='Select A Post'
            /> 
          </div>
            <div className='analyticsContainer'>

              <div className='analyticsContainer1'>
                {
                  summaryData ? 
                  <StatsSummary 
                    data={summaryData}
                  /> : 
                  <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className='statsSummary'>
                    No data
                  </div>
                }
                {
                  engagementsData ?
                  <StackedBarChart
                    data={engagementsData}
                    setEngagementData={engagementsDataChange}
                  /> : 
                  <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className="stackedBarChart">
                    No data
                  </div>
                }
              </div>
              <div className='analyticsContainer2'>
                {
                  conversionData ? 
                  <MultiLineChart
                    data={conversionData}
                    setConversionData={conversionDataChange}
                  /> : 
                  <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className='multiLineChart'>
                    No Data
                  </div>
                }

                {
                  videoData ? 
                    <GroupedBarChart 
                      data={videoData}
                      setVideoData={videoDataChange}
                    /> : 
                    <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className='groupedBarChart'>
                      No Data
                    </div>
                }
              </div>
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

export default Analytics;


export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');
  const connectDB = require('../../../../utils/connectUserDB');
  const mongoSanitize = require('express-mongo-sanitize');
  const User = require('../../../../utils/User').default;
  const mongoose = require('mongoose');

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getAccessToken(userId) {
    let user = await User.findOne({ _id: userId });
    const { accessToken, accesstokenExpirationDate, refreshToken, refreshTokenExpirationDate } = user.socialMediaLinks.find(link => link.platformName === "pinterest");
    return { accessToken,
      accesstokenExpirationDate, 
      refreshToken, 
      refreshTokenExpirationDate
    }
  }

  function getDateArray(startDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    let endDate = new Date();
    
    // Set the endDate to the end of the current day
    endDate.setHours(23, 59, 59, 999);
  
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().slice(0, 10); // Convert date to 'yyyy-mm-dd' format
      dateArray.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1); // Increment date by 1 day
    }
  
    return dateArray;
  }

  async function refreshTokenForUser(refToken) {

    const authorization = `Basic ${Buffer.from(`1484362:${process.env.PINTEREST_APP_SECRET}`).toString('base64')}`;

    try {
        const response = await axios.post('https://api.pinterest.com/v5/oauth/token', null, {
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                grant_type: 'refresh_token',
                refresh_token: refToken
            }
        });

        const data = response.data;
        const now = new Date();
        const currentUTCDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

        const tokenExpiryDate = new Date(currentUTCDate.getTime() + (data.expires_in * 1000));
        const theNewToken = data.access_token;

        return {
          isError: false,
          newToken: theNewToken,
          expiryUTCDate: tokenExpiryDate
        }

    } catch (error) {
        console.error('Error refreshing Pinterest token:', error.message);
        return {
          isError: true,
        }
    }
  }

  async function getPinAnalytics(token, pinId, startDate, metricTypes, sameDay) {

    const endDate = sameDay ? startDate : new Date().toISOString().split('T')[0];

    const url = `https://api.pinterest.com/v5/pins/${pinId}/analytics?start_date=${startDate}&end_date=${endDate}&metric_types=${encodeURIComponent(metricTypes.join(','))}&app_types=ALL&split_field=NO_SPLIT`;

    try {

      const response = await fetch(url, { 
        method: 'GET', 
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }, 
      });
      
      if (response.ok) {
        const result = await response.json();
        return result
      } else {

        console.error('Error:', response);
        return null
      }
    } catch (error) {
      console.error('Error getting pins', error);
      return null
    }
  }

  async function getAllAnalytics(recentPosts) {

    const metricTypes = [
      "IMPRESSION",
      "OUTBOUND_CLICK",
      "PIN_CLICK",
      "SAVE",
      "VIDEO_10S_VIEW",
      "QUARTILE_95_PERCENT_VIEW",
      "VIDEO_V50_WATCH_TIME",
      "VIDEO_START",
      "TOTAL_COMMENTS",
      "TOTAL_REACTIONS"
    ];

    try {

      const results = await Promise.all(recentPosts.map(async (post) => {

        const date = new Date(post.date);
        const formattedDate = date.toISOString().split('T')[0]; // yy-mm-dd

        // find the number of days
        const currentDate = new Date();
        const arrOfDaysDiff = getDateArray(post.date);

        let isTknExpired = false;

        const accTkn = await getAccessToken(post.hostId)
        // check if the token/refresh token are valid
        if (accTkn.accesstokenExpirationDate <= currentDate) {
          // Token has expired or is about to expire
          if (accTkn.refreshTokenExpirationDate > currentDate) {
            for (let i = 0; i < 2; i++) {
              newToken = await refreshTokenForUser(accTkn.refreshToken);
              if (!newToken.isError) {
                break; // Exit the loop if there&apos;s no error
              }
              if (i === 1) {
                isTknExpired = true;
              }
            }
            if (isTknExpired === false) {
              let hostUser = await User.findOne({ _id: post.hostId });
              let sm = hostUser.socialMediaLinks.find(link => link.platformName === "pinterest");
              sm.accessToken = newToken.newToken;
              sm.accesstokenExpirationDate = newToken.expiryUTCDate;
              await hostUser.save();
            }
          } else {
            // Both token and refresh token have expired, prompt user to re-authenticate
            // here we need to deal with it a bit differently since the 
            isTknExpired = true;
          }
        }

        if (isTknExpired) {
          return  {
            title: post.pinTitle,
            date: formattedDate,
            metrics: arrOfDaysDiff.map(d => {
              return {
                  date: d,
                  metrics: {
                    VIDEO_V50_WATCH_TIME: 0,
                    OUTBOUND_CLICK: 0,
                    VIDEO_START: 0,
                    QUARTILE_95_PERCENT_VIEW: 0,
                    VIDEO_10S_VIEW: 0,
                    SAVE: 0,
                    IMPRESSION: 0,
                    PIN_CLICK: 0,
                    REACTIONS: 0,
                    COMMENTS: 0
                  }
                }
            })
          }
        }
        
        // before you start each fetch from the API, try to pause for a quarter second
        await delay(150);

        // here the accessToken
        const { accessToken } = await getAccessToken(post.hostId)
        
        // get the metrics for the existing postId
        const analyticsData = await getPinAnalytics(accessToken, post.postId, formattedDate, metricTypes, false);

        const dailyMetrics = analyticsData.all.daily_metrics; 

        let updatedAnalytics = await Promise.all(dailyMetrics.map(async ({ data_status, ...rest }, index) => {
          await delay(100);
          const engAnalytics = await getPinAnalytics(accessToken, post.postId, arrOfDaysDiff[index], [ "TOTAL_COMMENTS", "TOTAL_REACTIONS" ], true);
          console.log(`The dailyMetric`, dailyMetrics)
          console.log('The arrofDays', arrOfDaysDiff)
          let a = { TOTAL_COMMENTS: 0, TOTAL_REACTIONS: 0 }
          if (analyticsData && analyticsData.all) {
            a = engAnalytics.all.lifetime_metrics;
          }
          return {
            ...rest,
            metrics: {
              ...rest.metrics,
              reactions: a.TOTAL_REACTIONS, 
              comments: a.TOTAL_COMMENTS 
            }
          };
        }));

        // this is for each post
        return {
          title: post.pinTitle,
          date: formattedDate,
          metrics: updatedAnalytics
        };

      }));
  
      return results;

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  function serializeApiResponse(response) {
    // Process each article in the response
    const serializedResponse = response.map(article => {
      return {
        title: article.title,
        date: new Date(article.date).toISOString().split('T')[0], // Normalize date to ISO format
        metrics: article.metrics.map(metric => {
          return {
            date: new Date(metric.date).toISOString().split('T')[0], // Normalize date to ISO format
            metrics: metric.metrics // Assume metrics are already in correct format
          };
        })
      };
    });
  
    // Finally, serialize the whole response array
    return JSON.stringify(serializedResponse);
  }
  

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

    // your token has already the userId
    const userId = decoded.userId;

    // here we are going to retrieve all the posts of the user 
    // just to calibrate the data, then we swtich it with the 
    // posts published in the last 7 days.

    await connectDB();

    // we will need the following to update the DB later on
    const sanitizedUserId = mongoSanitize.sanitize(userId);

    // here are going to pull all the recent 7 days posts, 
    // get their pinTitle, date, and id

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(sanitizedUserId) } },
      { $unwind: '$socialMediaLinks' },
      { $match: { 'socialMediaLinks.platformName': 'pinterest' } },
      { $unwind: '$socialMediaLinks.posts' },
      { $match: { 'socialMediaLinks.posts.postStatus': 'published' } },
      { $sort: { 'socialMediaLinks.posts.publishingDate': -1 } }, // sort by publishing date in descending order
      { $limit: 7 }, // limit to the last seven posts
      {
        $project: {
          _id: 0,
          pinTitle: '$socialMediaLinks.posts.postTitle',
          date: '$socialMediaLinks.posts.publishingDate',
          postId: '$socialMediaLinks.posts.postId',
          hostId: '$socialMediaLinks.posts.hostUserId',
          analytics: '$socialMediaLinks.posts.analytics'
        }
      }
    ];
    
    const recentPosts = await User.aggregate(pipeline);

    const finalAnalyticsPosts = await getAllAnalytics(recentPosts)
    const toParse = serializeApiResponse(finalAnalyticsPosts)

    // to be removed
    const fakeConstant = [
        {
            "title": "The best ways to learn computer knoweldge",
            "date": "2023-10-19"
        },
        {
            "title": "10 ways to make money online",
            "date": "2023-10-20"
        },
        {
            "title": "creating the best knowledge graphs",
            "date": "2023-10-21"
        },
        {
            "title": "best ways to cook lentils",
            "date": "2023-10-22"
        },
        {
            "title": "cooking lentils without onions and other ingredients",
            "date": "2023-10-23"
        },
        {
            "title": "My moms recipe for potato chips",
            "date": "2023-10-24"
        },
        {
            "title": "the best cooking tray to grill salmon",
            "date": "2023-10-25"
        }
    ]  

    const allPsts = [
      {
        title: 'The best ways to learn computer knoweldge',
        date: '2023-10-19',
        metrics: [
          {
            date: '2023-10-19',
            metrics: {
              VIDEO_V50_WATCH_TIME: 100,
              OUTBOUND_CLICK: 50,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 200,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 10
            }
          },
          {
            date: '2023-10-20',
            metrics: {
              VIDEO_V50_WATCH_TIME: 150,
              OUTBOUND_CLICK: 70,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 15,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-21',
            metrics: {
              VIDEO_V50_WATCH_TIME: 80,
              OUTBOUND_CLICK: 40,
              VIDEO_START: 15,
              QUARTILE_95_PERCENT_VIEW: 8,
              VIDEO_10S_VIEW: 25,
              SAVE: 3,
              IMPRESSION: 180,
              PIN_CLICK: 12,
              REACTIONS: 45,
              COMMENTS: 8
            }
          },
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 120,
              OUTBOUND_CLICK: 60,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 12,
              VIDEO_10S_VIEW: 35,
              SAVE: 8,
              IMPRESSION: 220,
              PIN_CLICK: 18,
              REACTIONS: 60,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 90,
              OUTBOUND_CLICK: 45,
              VIDEO_START: 18,
              QUARTILE_95_PERCENT_VIEW: 9,
              VIDEO_10S_VIEW: 28,
              SAVE: 4,
              IMPRESSION: 190,
              PIN_CLICK: 14,
              REACTIONS: 55,
              COMMENTS: 12
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 110,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 22,
              QUARTILE_95_PERCENT_VIEW: 11,
              VIDEO_10S_VIEW: 32,
              SAVE: 6,
              IMPRESSION: 210,
              PIN_CLICK: 16,
              REACTIONS: 65,
              COMMENTS: 18
            }
          },
        ]
      },
      {
        title: '10 ways to make money online',
        date: '2023-10-20',
        metrics: [
          {
            date: '2023-10-20',
            metrics: {
              VIDEO_V50_WATCH_TIME: 100,
              OUTBOUND_CLICK: 50,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 200,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 10
            }
          },
          {
            date: '2023-10-21',
            metrics: {
              VIDEO_V50_WATCH_TIME: 150,
              OUTBOUND_CLICK: 70,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 15,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 80,
              OUTBOUND_CLICK: 40,
              VIDEO_START: 15,
              QUARTILE_95_PERCENT_VIEW: 8,
              VIDEO_10S_VIEW: 25,
              SAVE: 3,
              IMPRESSION: 180,
              PIN_CLICK: 12,
              REACTIONS: 45,
              COMMENTS: 8
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 120,
              OUTBOUND_CLICK: 60,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 12,
              VIDEO_10S_VIEW: 35,
              SAVE: 8,
              IMPRESSION: 220,
              PIN_CLICK: 18,
              REACTIONS: 60,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 90,
              OUTBOUND_CLICK: 45,
              VIDEO_START: 18,
              QUARTILE_95_PERCENT_VIEW: 9,
              VIDEO_10S_VIEW: 28,
              SAVE: 4,
              IMPRESSION: 190,
              PIN_CLICK: 14,
              REACTIONS: 55,
              COMMENTS: 12
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
        ]
      },
      {
        title: 'creating the best knowledge graphs',
        date: '2023-10-21',
        metrics: [
          {
            date: '2023-10-21',
            metrics: {
              VIDEO_V50_WATCH_TIME: 110,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 22,
              QUARTILE_95_PERCENT_VIEW: 11,
              VIDEO_10S_VIEW: 32,
              SAVE: 6,
              IMPRESSION: 210,
              PIN_CLICK: 16,
              REACTIONS: 65,
              COMMENTS: 18
            }
          },
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 140,
              OUTBOUND_CLICK: 75,
              VIDEO_START: 35,
              QUARTILE_95_PERCENT_VIEW: 16,
              VIDEO_10S_VIEW: 45,
              SAVE: 9,
              IMPRESSION: 230,
              PIN_CLICK: 25,
              REACTIONS: 80,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 95,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 190,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 125,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 95,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 190,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
        ]
      },
      {
        title: 'best ways to cook lentils',
        date: '2023-10-22',
        metrics: [
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 115,
              OUTBOUND_CLICK: 50,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 35,
              SAVE: 7,
              IMPRESSION: 200,
              PIN_CLICK: 15,
              REACTIONS: 55,
              COMMENTS: 12
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 85,
              OUTBOUND_CLICK: 35,
              VIDEO_START: 12,
              QUARTILE_95_PERCENT_VIEW: 6,
              VIDEO_10S_VIEW: 20,
              SAVE: 2,
              IMPRESSION: 160,
              PIN_CLICK: 10,
              REACTIONS: 40,
              COMMENTS: 5
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 125,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 95,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 190,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 15
            }
          },
        ]
      },
      {
        title: 'cooking lentils without onions and other ingredients',
        date: '2023-10-23',
        metrics: [
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 140,
              OUTBOUND_CLICK: 75,
              VIDEO_START: 35,
              QUARTILE_95_PERCENT_VIEW: 16,
              VIDEO_10S_VIEW: 45,
              SAVE: 9,
              IMPRESSION: 230,
              PIN_CLICK: 25,
              REACTIONS: 80,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 110,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 22,
              QUARTILE_95_PERCENT_VIEW: 11,
              VIDEO_10S_VIEW: 32,
              SAVE: 6,
              IMPRESSION: 210,
              PIN_CLICK: 16,
              REACTIONS: 65,
              COMMENTS: 18
            }
          },
        ]
      },
      {
        title: 'My moms recipe for potato chips',
        date: '2023-10-24',
        metrics: [
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 120,
              OUTBOUND_CLICK: 60,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 12,
              VIDEO_10S_VIEW: 35,
              SAVE: 8,
              IMPRESSION: 220,
              PIN_CLICK: 18,
              REACTIONS: 60,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 80,
              OUTBOUND_CLICK: 40,
              VIDEO_START: 15,
              QUARTILE_95_PERCENT_VIEW: 8,
              VIDEO_10S_VIEW: 25,
              SAVE: 3,
              IMPRESSION: 180,
              PIN_CLICK: 12,
              REACTIONS: 45,
              COMMENTS: 8
            }
          },
        ]
      },
      {
        title: 'the best cooking tray to grill salmon',
        date: '2023-10-25',
        metrics: [
          {
            date: '2023-10-25',
            metrics: {
              OUTBOUND_CLICK: 70,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 15,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 20
            }
          }
        ]
      }
    ]
    
    const options = recentPosts.map(el => {
      const dateStr = el.date.toISOString();
      const date = new Date(dateStr);
      const yyyyMMdd = date.toISOString().split('T')[0];
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        value: yyyyMMdd,
        label: _.startCase(el.pinTitle) + ' - ' + formattedDate
      }
    })


    return {
      props: {
        signedIn: true,
        dash: true,
        // return all the posts
        dataa: toParse,
        options
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