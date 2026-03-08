import fs from 'fs';

const data = JSON.parse(fs.readFileSync('images_urls.json', 'utf8'));
let seedContent = fs.readFileSync('seed.js', 'utf8');

// Match the entire machinery array block. We can just evaluate it, update, and stringify
// Let's use a simpler approach: regex replace image_url
const categories = ['Tractors', 'Harvesters', 'Plough', 'Seed Drill', 'Irrigation', 'Rotavator', 'Sprayer', 'Cultivator', 'Thresher'];
const iterators = {};
for (const cat of categories) {
    iterators[cat] = 0;
}

const updated = seedContent.replace(/(category:\s*'([^']+)',[\s\S]*?image_url:\s*)'[^']+'/g, (match, p1, cat) => {
    if (data[cat] && data[cat][iterators[cat]]) {
        const newUrl = data[cat][iterators[cat]];
        iterators[cat]++;
        return p1 + "'" + newUrl + "'";
    }
    return match;
});

fs.writeFileSync('seed.js', updated);
console.log('seed.js updated with new Unsplash urls!');
