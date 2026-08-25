const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

const clipUpdates = {
  'SPK-HC-001': 129,
  'SPK-HC-002': 139,
  'SPK-HC-003': 139,
  'SPK-HC-004': 149,
  'SPK-HC-005': 99,
  'SPK-HC-006': 79,
  'SPK-HC-007': 99,
  'SPK-HC-008': 139
};

let count = 0;
for (const [id, price] of Object.entries(clipUpdates)) {
  const regex = new RegExp('(id:\\s*"' + id + '"[\\s\\S]*?price:\\s*)\\d+');
  if (regex.test(content)) {
    content = content.replace(regex, '$1' + price);
    count++;
  }
}

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log(`Successfully updated ${count} Clips prices in mockData.js!`);
