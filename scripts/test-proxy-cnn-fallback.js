(async () => {
  const base = process.argv[2] || 'https://dexterdexter-expo-project--byvxw6swi3.expo.app';
  const url = `${base}/api/rapid/cnn?q=ukraine&force_fallback=1`;
  try {
    const r = await fetch(url);
    console.log('status', r.status);
    const j = await r.json().catch(() => null);
    console.log('body keys', j ? Object.keys(j) : 'non-json');
    console.log('sample', j && j.articles ? j.articles.slice(0,3).map(a => ({ source: a.source, title: a.title })) : j);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();