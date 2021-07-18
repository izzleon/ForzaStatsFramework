// -------------------------    HTTP SERVER    ------------------------- 
const http = require("http");
const fs = require("fs");

var ext_GameData = {}

module.exports = {
    Setup: function (GameData, config) {

        // config
        const host = config.extensions.http.config.host;
        const port = config.extensions.http.config.port;
        const www_dir = config.extensions.http.config.www_dir;
        
        // http | create server
        const http_server = http.createServer(function (req, res) {

            // serve files
            if (req.url == '/index.html' || req.url == '/') {
                fs.readFile(www_dir + '/index.html', function (err, data) {
                    res.end(data);
                });
            } else if (req.url == '/forzastats.js') {
                fs.readFile(www_dir + '/forzastats.js', function (err, data) {
                    res.end(data);
                });
            } else {
                res.end(JSON.stringify(ext_GameData));
            }
        });
        
        // http | listen to port
        http_server.listen(port, host, () => {
            console.log(`HTTTP  | Server is running on http://${host}:${port}`);
        });        
    },
    
    _hook_serve_message: function (GameData) {
        ext_GameData = GameData;
    }
}