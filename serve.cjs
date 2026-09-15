const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
http
  .createServer((req, res) => {
    const file = path.join(__dirname, "index.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(fs.readFileSync(file));
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("Preview ready at http://127.0.0.1:4173"),
  );
