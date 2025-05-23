const cache = new Map();

export function fetchData(url: string) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url: string) {
  if (url.startsWith('/video?')) {
    return await getVideoResults(url.slice('/video?'.length));
  } else {
    Error('Not implemented');
  }
}

async function getVideoResults(query: string) {
  const req = await fetch(`${import.meta.env.VITE_API_URL}/video?${query}`)
  const data = await req.json();
  return data;
}