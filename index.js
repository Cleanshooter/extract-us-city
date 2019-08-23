/* eslint-disable no-cond-assign */
const fs = require('fs');

let database;
let citiesArray;

const loadDatabase = () => {
  const fileData = fs.readFileSync('./city-db.json');
  if (!database) {
    database = JSON.parse(fileData);
  }
  if (!citiesArray) {
    citiesArray = database.map((data) => {
      if (data.city.indexOf('-') > -1) {
        return data.city.replace('-', ' '); // replace hyphens with space
      }
      if (data.city.indexOf("'") > -1) {
        const noApostrophe = data.city.replace("'", ' ');
        return noApostrophe.replace('  ', ' '); // can add duplicate spaces this converts to single
      }
      if (data.city.indexOf('.') > -1) {
        return data.city.replace('.', ''); // remove periods
      }
      return data.city;
    });
  }
};

const tokenize = (input) => {
  const result = [];
  const wordsRegex = /\w+/g;
  let currentMatch;
  let index = 0;
  while ((currentMatch = wordsRegex.exec(input)) !== null) {
    result.push({
      word: currentMatch[0],
      startCharIndex: currentMatch.index,
      endCharIndex: wordsRegex.lastIndex,
      firstWordIndex: index,
      lastWordIndex: index,
    });
    index++;
  }
  return result;
};

const toTitleCase = (str) => {
  // If the first letter isn't capitalized ignore it (for speed)
  // If the second letter is upper case
  // WE assume it's not title case and fix it
  /*
  console.log('Testing: ', str);
  console.log(
    'Is first letter lower case: ',
    str.charAt(0) === str.charAt(0).toUpperCase(),
  );
  console.log(
    'Is second letter capital: ',
    str.charAt(1) === str.charAt(1).toUpperCase(),
  );
  console.log('Is NOT a number?: ', isNaN(str)); // eslint-disable-line no-restricted-globals
  console.log('\n');
  */
  if (
    str.charAt(0) === str.charAt(0).toUpperCase()
    && str.charAt(1) === str.charAt(1).toUpperCase()
    && isNaN(str) // eslint-disable-line no-restricted-globals
  ) {
    return str.replace(/\w\S*/g, (txt) => {
      if (txt !== 'of' && txt !== 'the' && txt !== 'del') {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
      return txt;
    });
  }
  return str;
};

const identifyFullCity = (tokens, foundToken) => {
  // Progressive matching up to 5 words
  // Identify full city name
  let fullCity;
  if (citiesArray.indexOf(toTitleCase(foundToken.word)) > -1) {
    // We found an exact match, use it
    fullCity = foundToken;
  }
  // But if more words find a match assume it's more accurate.
  for (let i = 1; i < 6; i++) {
    let testName = foundToken.word;
    for (let j = 1; j <= i; j++) {
      if (tokens[foundToken.firstWordIndex + j]) {
        testName += ` ${tokens[foundToken.firstWordIndex + j].word}`;
      }
    }

    if (citiesArray.indexOf(toTitleCase(testName)) > -1) {
      fullCity = {
        word: testName,
        startCharIndex: foundToken.startCharIndex,
        endCharIndex: tokens[foundToken.firstWordIndex + i].endCharIndex,
        firstWordIndex: foundToken.firstWordIndex,
        lastWordIndex: tokens[foundToken.firstWordIndex + i].lastWordIndex,
      };
    }
  }
  return fullCity;
};

const findStateMatches = (token, matches) => {
  const results = [];
  matches.forEach((match, index) => {
    if (token.word === match.state_code || token.word === match.state_name) {
      // console.log('Found State: ', token.word);
      results.push({
        matchIndex: index,
        ...token,
      });
    }
  });
  return results;
};

const findZipMatches = (token, matches) => {
  const results = [];
  matches.forEach((match, index) => {
    const zips = match.zips.split(' ');
    zips.forEach((zip) => {
      if (token.word === zip) {
        // console.log('Found Zip: ', token.word);
        results.push({
          matchIndex: index,
          zip,
          ...token,
        });
      }
    });
  });
  return results;
};

const identifyNearByData = (tokens, fullCity) => {
  // Create an array of potential matches from teh database
  const matches = [];
  const titleCase = toTitleCase(fullCity.word);
  citiesArray.forEach((city, index) => {
    if (city === titleCase) {
      matches.push(database[index]);
    }
  });
  // Determine direction...
  // Find next word that matches either state or zip in the matches array
  // Look up to 5 words away from the city
  let direction;
  for (let i = 1; i < 6; i++) {
    // Look at the next word
    const nextIndex = fullCity.lastWordIndex + i;
    // check if it's a state
    if (direction !== 'left' && tokens[nextIndex]) {
      const foundStateRight = findStateMatches(tokens[nextIndex], matches);
      // console.log('Found State Right: ', foundStateRight.length);
      if (foundStateRight.length > 0) {
        direction = 'right';
        foundStateRight.forEach((foundState) => {
          matches[foundState.matchIndex].foundState = true;
          matches[foundState.matchIndex].end = foundState.endCharIndex;
          matches[foundState.matchIndex].lastWordIndex = foundState.lastWordIndex;
        });
      }
      // check if it's a zip
      const foundZipRight = findZipMatches(tokens[nextIndex], matches);
      // console.log('Found Zip Right: ', foundZipRight.length);
      if (foundStateRight.length === 0 && foundZipRight.length > 0) {
        direction = 'right';
        foundZipRight.forEach((foundZip) => {
          matches[foundZip.matchIndex].foundZip = true;
          matches[foundZip.matchIndex].zip = foundZip.zip;
          matches[foundZip.matchIndex].end = foundZip.endCharIndex;
          matches[foundZip.matchIndex].lastWordIndex = foundZip.lastWordIndex;
        });
      }
    }

    // Look at the previous word
    const previousIndex = fullCity.firstWordIndex - i;
    if (direction !== 'right' && tokens[previousIndex]) {
      // check if it's a state
      const foundStateLeft = findStateMatches(tokens[previousIndex], matches);
      // console.log('Found State Left: ', foundStateLeft.length);
      if (foundStateLeft.length > 0) {
        direction = 'left';
        foundStateLeft.forEach((foundState) => {
          matches[foundState.matchIndex].foundState = true;
          matches[foundState.matchIndex].start = foundState.startCharIndex;
        });
      }
      // check if it's a zip
      const foundZipLeft = findZipMatches(tokens[previousIndex], matches);
      // console.log('Found Zip Left: ', foundZipLeft.length);
      if (foundStateLeft.length === 0 && foundZipLeft.length > 0) {
        direction = 'left';
        foundZipLeft.forEach((foundZip) => {
          matches[foundZip.matchIndex].foundZip = true;
          matches[foundZip.matchIndex].zip = foundZip.zip;
          matches[foundZip.matchIndex].start = foundZip.startCharIndex;
        });
      }
    }
  }

  // Finally Return the one with the most matches
  // If nothing has been validated and there is only one match
  // return it as a return by default
  let returnedMatch;
  if (matches.length === 1) {
    [returnedMatch] = matches;
  }
  let foundBoth = false;
  matches.forEach((match) => {
    if (match.foundState && match.foundZip) {
      returnedMatch = Object.assign({}, match);
      foundBoth = true;
    } else if (
      (match.foundState && !foundBoth)
      || (match.foundZip && !foundBoth)
    ) {
      returnedMatch = Object.assign({}, match);
    }
  });

  // Cleanup response
  if (returnedMatch) {
    // If there is only one zip for a city return it even if not found
    if (!returnedMatch.zip && returnedMatch.zips.split('').length === 1) {
      returnedMatch.zip = String(returnedMatch.zips);
    }
    // Don't care about all zips in city just identified one...
    if (returnedMatch.zip) {
      delete returnedMatch.zips;
    }
    // If there was no identified zip we return all possible zips instead...

    // Explicit found indicators
    if (!returnedMatch.foundState) {
      returnedMatch.foundState = false;
    }
    if (!returnedMatch.foundZip) {
      returnedMatch.foundZip = false;
    }

    // Set missing start or end indexes
    if (!returnedMatch.start) {
      returnedMatch.start = fullCity.startCharIndex;
    }
    if (!returnedMatch.end) {
      returnedMatch.end = fullCity.endCharIndex;
    }

    // Ensure lastWordIndex is set
    if (!returnedMatch.lastWordIndex) {
      returnedMatch.lastWordIndex = fullCity.lastWordIndex;
    }
  }

  return returnedMatch;
};

const extract = (input) => {
  // Load database
  loadDatabase();
  // Tokenize the input string
  const tokens = tokenize(input);
  // Results
  const results = [];
  // Loop through the input searching for City Names
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const titleCase = toTitleCase(token.word);
    // Look for matches
    let foundPotential = false;
    citiesArray.forEach((city) => {
      if (
        (city === titleCase && !foundPotential)
        || (city.startsWith(titleCase) && !foundPotential)
      ) {
        foundPotential = true;
        // console.log(`WORD: ${token.word} matched ${city}`);
        const fullCity = identifyFullCity(tokens, token);
        // console.log('Full City: ', fullCity);
        if (fullCity) {
          const fullData = identifyNearByData(tokens, fullCity);
          // console.log('Final Match: ', fullData);
          if (fullData) {
            // To prevent additional matches inside of found cities we advance the index
            i = Number(fullData.lastWordIndex) + 1;
            delete fullData.lastWordIndex;
            results.push(fullData);
          }
        }
      }
    });
  }
  console.log('Results: ', results);

  return results;
};

module.exports = { extract };
