const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

const updates = {
  // Chains: 1-129, 2-199, 3-139, 4-146, 5-99, 6-79, 7-99, 8-139
  'SPK-CN-201': 129,
  'SPK-CN-202': 199,
  'SPK-CN-203': 139,
  'SPK-CN-204': 146,
  'SPK-CN-205': 99,
  'SPK-CN-206': 79,
  'SPK-CN-207': 99,
  'SPK-CN-208': 139,

  // Necklaces: 1-399, 2-499, 3-399, 4-549, 5-549, 6-549, 7-549, 8-399, 9-549
  'SPK-NK-101': 399,
  'SPK-NK-102': 499,
  'SPK-NK-103': 399,
  'SPK-NK-104': 549,
  'SPK-NK-105': 549,
  'SPK-NK-106': 549,
  'SPK-NK-107': 549,
  'SPK-NK-108': 399,
  'SPK-NK-109': 549,

  // Bracelets: 1-139, 2-299
  'SPK-BR-301': 139,
  'SPK-BR-302': 299,

  // Earrings: 6-49
  'SPK-ER-406': 49,

  // Bangles: 2-129, 3-169, 5-249
  'SPK-BG-502': 129,
  'SPK-BG-503': 169,
  'SPK-BG-505': 249,

  // Canvas: 1-299, 2-299, 3-299, 4-299, 5-249, 6-199, 8-249, 9-249, 10-249, 11-299
  'SPK-CV-001': 299,
  'SPK-CV-002': 299,
  'SPK-CV-003': 299,
  'SPK-CV-004': 299,
  'SPK-CV-005': 249,
  'SPK-CV-006': 199,
  'SPK-CV-008': 249,
  'SPK-CV-009': 249,
  'SPK-CV-010': 249,
  'SPK-CV-011': 299
};

let count = 0;
for (const [id, price] of Object.entries(updates)) {
  const regex = new RegExp('(id:\\s*"' + id + '"[\\s\\S]*?price:\\s*)\\d+');
  if (regex.test(content)) {
    content = content.replace(regex, '$1' + price);
    count++;
  }
}

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log(`Successfully updated ${count} product prices in mockData.js!`);
