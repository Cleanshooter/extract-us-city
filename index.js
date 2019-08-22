/* eslint-disable no-cond-assign */
const fs = require('fs');
// const Fuse = require('fuse.js');

let database;
let citiesArray;
// let fuse;
const loadDatabase = () => {
  const fileData = fs.readFileSync('./city-db.json');
  database = JSON.parse(fileData);
  citiesArray = database.map(data => data.city);
  /*
  fuse = new Fuse(database, {
    shouldSort: true,
    includeScore: true,
    threshold: 0.1,
    location: 0,
    distance: 0,
    maxPatternLength: 33,
    minMatchCharLength: 3,
    keys: ['city', 'state_code'],
  });
  */
};

const extract = (input) => {
  // Load database
  loadDatabase();
  // Tokenize the input string
  const wordsRegex = /\w+/g;
  let currentMatch;
  // The matches array contains the temporary matches made
  // while we try to narrow it down to one.
  const matches = [];
  // Loop through the input searching for City Names
  while ((currentMatch = wordsRegex.exec(input)) !== null) {
    /*
    const search1 = fuse.search(currentMatch[0]);
    if (search1.length > 0) {
      console.log(
        `Search 1 Results for "${currentMatch[0]}": `,
        search1.length,
      );
      if (search1.length > 1) {
        const nextMatch = wordsRegex.exec(input);
        const search2 = fuse.search(`${currentMatch[0]} ${nextMatch[0]}`);
        console.log(
          `Search 2 Results for "${currentMatch[0]} ${nextMatch[0]}": `,
          search2.length,
        );
      }
    }
    */
    // Look for a direct matches - fast match
    let foundAtLeastOne = false;
    let nextMatch;
    citiesArray.forEach((city, index) => {
      if (city.toLowerCase() === currentMatch[0].toLowerCase()) {
        // City identified... verify state and zip
        console.log(city);
        if (!foundAtLeastOne) {
          nextMatch = wordsRegex.exec(input);
          foundAtLeastOne = true;
        }

        // Is State?
        if (
          database[index].state_code === nextMatch[0]
          || database[index].state_name === nextMatch[0]
        ) {
          matches.push({
            ...database[index],
            startIndex: currentMatch.index,
            endIndex: wordsRegex.lastIndex,
            text: input.substring(currentMatch.index, wordsRegex.lastIndex),
          });
        }
      }
    });
  }
  console.log('Matches: ', matches);

  return {};
};

module.exports = { extract };
