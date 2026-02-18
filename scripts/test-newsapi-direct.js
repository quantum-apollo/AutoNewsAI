(async () => {
  const fs = require('fs');
  let key = process.env.NEWS_API_KEY || '';
  if (!key && fs.existsSync('.env')) {
    const m = fs.readFileSync('.env', 'utf8').match(/^NEWS_API_KEY=(.+)$/m);
    key = m && m[1] ? m[1].trim() : '';
  }
  if (!key) { console.error('NEWS_API_KEY missing'); process.exit(2); }

  const q = 'ukraine';
  const sources = ['associated-press','reuters','cnn'].join(',');
  const url = `https://newsapi.org/v2/everything?sources=${sources}&q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${key}`;
  const r = await fetch(url);
  console.log('status', r.status);
  const j = await r.json();
  console.log('totalResults', j.totalResults);
  if (j.articles && j.articles.length) console.log('sample', j.articles.slice(0,3).map(a=> ({source: a.source && a.source.name, title: a.title} )));
  else console.log('no articles');
})();