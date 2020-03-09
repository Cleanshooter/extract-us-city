/* eslint-disable no-irregular-whitespace */
const assert = require('assert');
// const https = require('https');
const extractUsCity = require('./index.js');

const testSample001 = `

This is a quote request.
Hey Person:
 
Can you give me a quote on the following:
 
BCO: Company
Pickup: Chatsworth, GA 30705
Delivery: Denver, CO 80223
Commodity: product
Weight: 43,000 lbs.
 
Thank you,
 
 
 
Person Name | Job Title | Company Name
Phone: 800-555-5555 x: 45686 | Cell: 555-555-1234
Email:  user@company.com
 
 





______________________________________________________________

This message had a really long CYA statement... it was deleted.



`;

const testSample002 = `

Customer Name
 
Widget
42000 lbs
 
Toppenish, WA 98948 to Meriden, CT 06450
 
Thank you,
 
Person Name | Job Title
Work: (555) 555-5555 ext. 55555
Cell: (555) 555-5555
Fax: (555) 555-5555
     
 
 





______________________________________________________________

This message had a really long CYA statement... it was deleted.


`;

const testSample003 = `Hey Person:

Can you give me a quote on the following:

BCO: Company Name

Pick #1: 
Zip: 60409 
State: IL 
City: Calumet City

Pick #2: 
Zip: 60440 
State: IL 
City: Bolingbrook

Drop #1: 
Zip: 97402 
State: OR 
City: Eugene

Commodity: 1 Truckload Widgets

Weight: 36500

Thank you,`;

const testSample004 = 'Unified Government of Greeley County, KS 67879';
const testSample005 = "Port O'Brien, AK 99615";
const testSample006 = ' BCO: Company   PICKUP INFO Zip: 97201 State: OR City: PORTLAND   DELIVERY INFO Zip: 11201 State: NY City: BROOKLYN Commodity: Stuff Weight: 42,500 POC: Person ';
const testSample007 = 'A string with a US city in it like Appleton WI, 54911';

assert.deepEqual(extractUsCity.extract(testSample001), [
  {
    city: 'Chatsworth',
    state_code: 'GA',
    state_name: 'Georgia',
    county_name: 'Murray',
    lat: 34.7808,
    lng: -84.7835,
    incorporated: true,
    timezone: 'America/New_York',
    foundState: true,
    end: 126,
    foundZip: true,
    zip: '30705',
    start: 106,
  },
  {
    city: 'Denver',
    state_code: 'CO',
    state_name: 'Colorado',
    county_name: 'Denver',
    lat: 39.7621,
    lng: -104.8759,
    incorporated: true,
    timezone: 'America/Denver',
    foundState: true,
    end: 153,
    foundZip: true,
    zip: '80223',
    start: 137,
  },
]);
assert.deepEqual(extractUsCity.extract(testSample002), [
  {
    city: 'Toppenish',
    state_code: 'WA',
    state_name: 'Washington',
    county_name: 'Yakima',
    lat: 46.3807,
    lng: -120.3124,
    incorporated: true,
    timezone: 'America/Los_Angeles',
    foundState: true,
    end: 56,
    foundZip: true,
    zip: '98948',
    start: 37,
  },
  {
    city: 'Meriden',
    state_code: 'CT',
    state_name: 'Connecticut',
    county_name: 'New Haven',
    lat: 41.5367,
    lng: -72.7943,
    incorporated: true,
    timezone: 'America/New_York',
    foundState: true,
    end: 77,
    foundZip: true,
    zip: '06450',
    start: 60,
  },
]);
assert.deepEqual(extractUsCity.extract(testSample003), [
  {
    city: 'Calumet City',
    state_code: 'IL',
    state_name: 'Illinois',
    county_name: 'Cook',
    lat: 41.6133,
    lng: -87.5502,
    incorporated: true,
    timezone: 'America/Chicago',
    foundState: true,
    start: 90,
    foundZip: true,
    zip: '60409',
    end: 126,
  },
  {
    city: 'Bolingbrook',
    state_code: 'IL',
    state_name: 'Illinois',
    county_name: 'Will',
    lat: 41.6903,
    lng: -88.102,
    incorporated: true,
    timezone: 'America/Chicago',
    foundState: true,
    start: 143,
    foundZip: true,
    zip: '60440',
    end: 178,
  },
  {
    city: 'Eugene',
    state_code: 'OR',
    state_name: 'Oregon',
    county_name: 'Lane',
    lat: 44.0563,
    lng: -123.1173,
    incorporated: true,
    timezone: 'America/Los_Angeles',
    foundState: true,
    start: 195,
    foundZip: true,
    zip: '97402',
    end: 225,
  },
]);
assert.deepEqual(extractUsCity.extract(testSample004), [
  {
    city: 'Unified Government of Greeley County',
    state_code: 'KS',
    state_name: 'Kansas',
    county_name: 'Greeley',
    lat: 38.4806,
    lng: -101.8061,
    incorporated: true,
    timezone: 'America/Denver',
    foundState: true,
    end: 46,
    foundZip: true,
    zip: '67879',
    start: 0,
  },
]);
assert.deepEqual(extractUsCity.extract(testSample005), [
  {
    city: "Port O'Brien",
    state_code: 'AK',
    state_name: 'Alaska',
    county_name: 'Kodiak Island',
    lat: 57.7319,
    lng: -153.3167,
    incorporated: false,
    timezone: 'America/Anchorage',
    foundState: true,
    end: 22,
    foundZip: true,
    zip: '99615',
    start: 0,
  },
]);
assert.deepEqual(extractUsCity.extract(testSample006), [
  {
    city: 'Portland',
    state_code: 'OR',
    state_name: 'Oregon',
    county_name: 'Multnomah',
    lat: 45.5372,
    lng: -122.65,
    incorporated: true,
    timezone: 'America/Los_Angeles',
    foundState: true,
    start: 33,
    foundZip: true,
    zip: '97201',
    end: 63,
  },
  {
    city: 'Brooklyn',
    state_code: 'NY',
    state_name: 'New York',
    county_name: 'Kings',
    lat: 40.6501,
    lng: -73.9496,
    incorporated: true,
    timezone: 'America/New_York',
    foundState: true,
    start: 85,
    foundZip: true,
    zip: '11201',
    end: 115,
  },
]);
assert.deepEqual(extractUsCity.extract(testSample007), [
  {
    city: 'Appleton',
    state_code: 'WI',
    state_name: 'Wisconsin',
    county_name: 'Outagamie',
    lat: 44.2774,
    lng: -88.3894,
    incorporated: true,
    timezone: 'America/Chicago',
    foundState: true,
    end: 53,
    foundZip: true,
    zip: '54911',
    start: 35,
  },
]);

// Let's parse Pride and Prejudiced for funsies
// two days latter... let's not do it everytime...
/*
https
  .get('https://www.gutenberg.org/files/1342/1342-0.txt', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      const parseStart = new Date();
      // console.log(data);
      assert.deepEqual(extractUsCity.extract(data), [
        {
          city: 'Fairbanks',
          state_code: 'AK',
          state_name: 'Alaska',
          county_name: 'Fairbanks North Star',
          lat: 64.8353,
          lng: -147.6533,
          incorporated: true,
          timezone: 'America/Anchorage',
          zips: '99701 99703 99707',
          foundState: true,
          end: 714370,
          foundZip: false,
          start: 714357,
        },
        {
          city: 'Salt Lake City',
          state_code: 'UT',
          state_name: 'Utah',
          county_name: 'Salt Lake',
          lat: 40.7774,
          lng: -111.9301,
          incorporated: true,
          timezone: 'America/Denver',
          foundState: true,
          end: 714540,
          foundZip: true,
          zip: '84116',
          start: 714516,
        },
      ]);
      const parseEnd = new Date();
      console.log(
        `Total time to process Pride and Prejudice by Jane Austen: ${parseEnd.getTime()
          - parseStart.getTime()} ms`,
      );
    });
  })
  .on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
  */
