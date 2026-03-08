import fs from 'fs';
import https from 'https';

const categories = [
    { name: 'Tractors', query: 'tractor farming' },
    { name: 'Harvesters', query: 'combine harvester' },
    { name: 'Plough', query: 'farming plough' },
    { name: 'Seed Drill', query: 'farming seeder' },
    { name: 'Irrigation', query: 'farm irrigation' },
    { name: 'Rotavator', query: 'tiller soil farming' },
    { name: 'Sprayer', query: 'farm sprayer' },
    { name: 'Cultivator', query: 'cultivator farming' },
    { name: 'Thresher', query: 'threshing machine' }
];

const downloadImages = async () => {
    const results = {};
    for (const cat of categories) {
        console.log(`Fetching for ${cat.name}...`);
        try {
            const url = `https://unsplash.com/napi/search/photos?page=1&query=${encodeURIComponent(cat.query)}&per_page=5`;
            const data = await new Promise((resolve, reject) => {
                https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => resolve(JSON.parse(body)));
                }).on('error', reject);
            });

            if (data && data.results && data.results.length > 0) {
                results[cat.name] = data.results.map(r => r.urls.regular);
            } else {
                console.log(`No results for ${cat.query}, trying generic farm`);
                results[cat.name] = [];
            }
        } catch (err) {
            console.error(err);
        }
    }
    fs.writeFileSync('images_urls.json', JSON.stringify(results, null, 2));
    console.log('Saved to images_urls.json');
};

downloadImages();
