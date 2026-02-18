const https = require('https');
const fs = require('fs');

let key = process.env.RAPIDAPI_KEY || '';
if (!key && fs.existsSync('.env')) {
  const m = fs.readFileSync('.env', 'utf8').match(/^RAPIDAPI_KEY=(.+)$/m);
  key = m && m[1] ? m[1].trim() : '';
}
if (!key) {
  console.error('RAPIDAPI_KEY not found in environment or .env');
  process.exit(2);
}

const options = {
  method: 'GET',
  hostname: 'reuters-api.p.rapidapi.com',
  port: null,
  path: '/category?url=https%3A%2F%2Fwww.reuters.com%2Fworld%2Fafrica%2F',
  headers: {
    'x-rapidapi-key': key,
    'x-rapidapi-host': 'reuters-api.p.rapidapi.com'
  },
  timeout: 15000
};

const req = https.request(options, function (res) {
  console.log('statusCode', res.statusCode);
  const chunks = [];

  res.on('data', function (chunk) {
    chunks.push(chunk);
  });

  res.on('end', function () {
    const body = Buffer.concat(chunks).toString();
    try {
      const json = JSON.parse(body);
      console.log('response keys:', Object.keys(json).slice(0,20));
      // show a small sample if articles-like
      if (json.articles) {
        console.log('sample articles:', JSON.stringify(json.articles.slice(0,3).map(a=>({source:a.source, title:a.title, publishedAt:a.publishedAt})), null, 2));
      } else {
        console.log('body preview:', body.slice(0,1000));
      }
    } catch (err) {
      console.log('non-JSON response preview:', body.slice(0,1000));
    }
  });
});

req.on('error', function (e) {
  console.error('request error', e.message);
});
req.on('timeout', function () {
  req.destroy(new Error('timeout'));
});

req.end();
