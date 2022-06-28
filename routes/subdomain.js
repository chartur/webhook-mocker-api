const url = require("url");
const router = require("express").Router();

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

router.all("*", async (req, res, next) => {
  const io = req.app.get('socket');
  const subdomain = req.subdomain;
  const method = req.method.toUpperCase();
  const headers = {
    ...req.headers
  };
  const path = req.url;
  const url = fullUrl(req);
  const headerContentType = req.header('Content-Type');

  const body = req.body instanceof Buffer
    ? req.body.toString().trim()
    : JSON.stringify(req.body);

  const query = req.query;
  let contentType;
  if(headerContentType) {
    contentType = headerContentType.split('/')[1];
    switch (contentType) {
      case "javascript":
        contentType = "js";
        break;
      case "plain":
        contentType = "text";
        break;
    }
  }

  const response = "Ohh, request received. You can see it on you Webhooker dashboard. Thank you!";

  io.in(subdomain).emit("request", {
    method,
    body,
    headers,
    path,
    url,
    contentType,
    query,
    response,
    date: new Date()
  });

  res.send(response)
})

module.exports = router;
