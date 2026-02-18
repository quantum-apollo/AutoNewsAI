(async () => {
  const url = process.argv[2] || 'https://dexterdexter-expo-project--cs5bz8mvsz.expo.app';
  try {
    const res = await fetch(`${url}/api/rapid/cnn?q=ukraine`);
    console.log('status', res.status);
    const json = await res.json().catch(() => null);
    if (!json) {
      const txt = await res.text().catch(() => '');
      console.log('raw body:', txt.slice(0, 1000));
      return;
    }
    console.log('response keys:', Object.keys(json).slice(0, 20));
    if (json.articles) console.log('sample article titles:', json.articles.slice(0,3).map(a=>a.title));
    if (json.fallback) console.log('fallback used:', json.fallback, 'error:', json.error);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();