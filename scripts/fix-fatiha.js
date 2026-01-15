const fs = require('fs');
const path = 'c:/Users/Yousuf/Dev/noor-recite/public/tafsir-data.json';

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log('Original Al-Fatiha entries:');
for (let i = 1; i <= 7; i++) {
  const key = `1:${i}`;
  const entry = data[key];
  console.log(`${key}: ${typeof entry === 'string' ? 'Pointer to ' + entry : (entry?.text?.length || 0) + ' chars'}`);
}

// 1. Gather all unique text fragments in order
let mergedText = '';
const fatihaKeys = ["1:1", "1:2", "1:3", "1:4", "1:5", "1:6", "1:7"];
const seenPointers = new Set();

fatihaKeys.forEach(key => {
  const entry = data[key];
  if (typeof entry === 'object' && entry !== null && entry.text) {
    mergedText += entry.text;
  }
});

// 2. Create the unified entry
const unifiedEntry = {
  text: mergedText,
  ayah_keys: fatihaKeys
};

// 3. Update data
data["1:1"] = unifiedEntry;
for (let i = 2; i <= 7; i++) {
  data[`1:${i}`] = "1:1";
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('\nSuccess! Al-Fatiha entries merged into 1:1 and pointers created.');
