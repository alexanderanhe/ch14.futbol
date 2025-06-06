const cache = new Map();

export function fetchData(url: string, token: string) {
  if (!cache.has(url)) {
    cache.set(url, getData(url, token));
  }
  return cache.get(url);
}

async function getData(url: string, token: string) {
  if (url.startsWith('/video?')) {
    return await getVideoResults(url.slice('/video?'.length), token);
  } else {
    Error('Not implemented');
  }
}

async function getVideoResults(query: string, token: string) {
  const req = await fetch(`${import.meta.env.VITE_API_URL}/video?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  const data = await req.json();
  return data;
}

export async function insertVideo(formData: FormData, token: string | null) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/media/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response;
  } catch(err) {
    console.log(err)
  }
}