export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing URL', { status: 400 });
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
      },
    });
  }

  const body = req.body ? await req.text() : undefined; // <<< ✨ fix: send body as text

  const proxiedResponse = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'Content-Type': req.headers.get('content-type') || 'application/json',
      'Authorization': req.headers.get('authorization') || '',
      'apikey': req.headers.get('apikey') || '',
    },
    body: body,
  });

  const responseBody = await proxiedResponse.arrayBuffer();

  return new Response(responseBody, {
    status: proxiedResponse.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
      'Content-Type': proxiedResponse.headers.get('content-type') || 'application/json',
    },
  });
}
