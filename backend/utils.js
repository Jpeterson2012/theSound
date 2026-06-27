const asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next);

async function spotifyRequest(path, token, options = {}) {    
  const BASE_URL = "https://api.spotify.com/v1/";

  const url = path.startsWith("https://") ? path : `${BASE_URL}${path}`;        

  const response = await fetch(url, {
    method: options?.method ?? 'GET',
    ...options,
    headers: {
      ...(token ? {Authorization: 'Bearer ' + token} : {}),
      ...(options?.body != null ? {"Content-Type": "application/json"} : {}),
      ...(options?.headers ?? {}),            
    },                        
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`Spotify error: ${response.status}: ${text}`);
  };

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

module.exports = {
  asyncHandler,    
  spotifyRequest,
};