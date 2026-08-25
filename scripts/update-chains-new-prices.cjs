const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

const newChainPrices = {
  'SPK-CN-201': 199,
  'SPK-CN-202': 149,
  'SPK-CN-203': 249,
  'SPK-CN-204': 299,
  'SPK-CN-205': 299,
  'SPK-CN-206': 399,
  'SPK-CN-207': 249,
  'SPK-CN-208': 299
};

let count = 0;
for (const [id, price] of Object.entries(newChainPrices)) {
  const regex = new RegExp('(id:\\s*"' + id + '"[\\s\\S]*?price:\\s*)\\d+');
  if (regex.test(content)) {
    content = content.replace(regex, '$1' + price);
    count++;
  }
}

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log(`Successfully updated ${count} Chains prices in mockData.js!`);
