# Extract US Cities

This project uses Natural Language Processing techniques to identify US cities in a body of text.  

Overall we use basic tokenization to create an array of Pronouns (including all-caps ones because human beings are special) to break down the input text.  Then we compare those pronouns against a US City dictionary to perform the named entity extraction.  Once a city has been identified we refine the potential candidates down to a single match based on other information near to the found entity, like the State and Zip Code.   

The goal of this project is high precision identification vs. loose identification (a.k.a Micro Understanding).  So you won't get matches for Cities that don't have any refining context surrounding them.  

### Examples of what this will NOT do:

"Brandon went to the park." 
This won't return results because even though there are several cities names Brandon there no context indicating it is a place.

"Some interesting things happened in Charlotte today."
This also won't return results even though we know Charlotte is a place (unless interesting things are happening inside of a person named Charlotte which would be strange BUT possible I guess).  This is because we don't have enough context to know which Charlotte it is.  Is it Charlotte, MI or Charlotte, TX or... (this list goes on).

Ultimately we need enough local context to narrow the it down to one match.  For actual examples see the test.js file in hte project or test it out on the [demo](https://cleanshooter.github.io/extract-us-city/#demo).

## Installation

Extract US Cities is available as an [npm package](https://www.npmjs.com/package/extract-us-city).

```sh
npm install extract-us-city
```

## [Getting Started](#get-started)
### Node JS
```javascript
const { extract } = require('extract-us-city');

const string = 'A string with a US city in it like Appleton WI, 54911. I hope it finds it.';
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

### Browser
```html
<textarea id="myTextArea"></textarea>
<button id="myButton" type="button">Extract</button>
<script src="./node_modules/extract-us-city/dist/extract-us-city.js"></script>
<script src="./mode_modules/jquery/dist/jquery.min.js"></script>
<script>
$('#myButton').click(() => {
  var text = $('#myTextArea').val();
  var data = extractUsCity.extract(text);
  console.log(data);
});
</script>
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
