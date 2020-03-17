const http = require("http");
const handle_tables = require("./modules/handle_table");
const path = require("path");

global.appRoot = path.resolve(__dirname);

http
  .createServer(function(req, res) {
    if (req.url === "/") {
      handle_tables.class_vise_tables(req, res);
    }
  })
  .listen(3000, function() {
    console.log("server start at port 3000");
    console.log("http://localhost:3000/");
  });
