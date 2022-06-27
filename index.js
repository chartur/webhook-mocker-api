const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require('body-parser')
const cors = require('cors');
const subdomain = require('express-subdomain');
const subdomainRouter = require("./routes/subdomain");
const app = express();
const httpServer = http.createServer(app);
const io = new socketIo.Server(httpServer);

app.set("socket", io);
app.set('subdomain offset', 1);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: '*/*' }));
app.use(cors())
app.use(function(req, res, next) {
  if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www')
    return next();
  req.subdomain  = req.subdomains.slice(-1)[0];
  next();
});

app.use(subdomain("*", subdomainRouter))
io.on("connection", (socket) => {
  const subdomain = socket.handshake.query.subdomain;
  socket.join(subdomain);
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log("backend successfully ran on " + port)
});
