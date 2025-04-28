export default async (req, res) => {
    const targetUrl = req.query.url;
    const method = req.method;
    const headers = {
      ...req.headers,
      'accept-encoding': 'identity'
    };
    delete headers['host'];
  
    const response = await fetch(targetUrl, {
      method: method,
      headers: headers,
      body: req.body ? req.body : undefined
    });
  
    const body = await response.text();
    res.status(response.status).send(body);
  };
  