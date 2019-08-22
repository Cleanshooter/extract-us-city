/* eslint-disable no-irregular-whitespace */
const assert = require('assert');
const extractUsCity = require('./index');

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

assert.deepEqual(extractUsCity.extract(testSample001), {});
assert.deepEqual(extractUsCity.extract(testSample002), {});
assert.deepEqual(extractUsCity.extract(testSample003), {});
