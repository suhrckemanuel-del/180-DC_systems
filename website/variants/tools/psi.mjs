// PageSpeed Insights (Lighthouse) scores for a URL. No API key needed at low volume.
// Usage: node psi.mjs <url> [mobile|desktop]
const [url, strategy = "mobile"] = process.argv.slice(2);
const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
const res = await fetch(api);
if (!res.ok) { console.error(`PSI ${res.status}: ${(await res.text()).slice(0, 300)}`); process.exit(1); }
const j = await res.json();
const cats = j.lighthouseResult.categories;
const out = Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, Math.round(v.score * 100)]));
const audits = j.lighthouseResult.audits;
out.totalByteWeightKB = Math.round((audits["total-byte-weight"]?.numericValue ?? 0) / 1024);
console.log(`${url} [${strategy}]`, JSON.stringify(out));
