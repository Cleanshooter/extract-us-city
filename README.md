# Extract US Cities

## Installation

Extract US Cities is available as an [npm package](https://www.npmjs.org/package/extract-us-cities).

```sh
npm install extract-us-cities
```

## Usage
```javascript
const { extract } = require('extract-us-cities');

const string = 'A string with a US city in it like Appleton WI, 54911';
const result = extract(string);
/* result = [
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
];
*/
```

## Issues
I'm not perfect so when you find bugs please post them on the 
[github issue](https://github.com/Cleanshooter/extract-us-city/issues) tracker.

## Contribute
PRs are welcome, please ensure you've run and possibly added some more test cases.

### Benchmarking 
On my Dell XP 15 it currently takes 49,967 ms to process "Pride and Prejudice" by Jane Austen.  
Which isn't bad (less than a minute) but I'm open to ideas on how to improve processing time.

## License
This project is licensed under the terms of the ISC license
