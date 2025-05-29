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

export async function saveVideo({ title, description, fileName }: Record<string, string>) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ title, description, fileName }),
      // …
    });
    return await response.json();
  } catch(err) {
    console.log(err)
  }
}