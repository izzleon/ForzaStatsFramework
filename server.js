const http = require("http");
const fs = require("fs");
var udp = require('dgram');
const forza = require('./ForzaParser');

var GameData = {};

var ext = [];

var config = require('./config.js');

_hook_serve_message = function () { };

console.clear()
console.log('----------------------------------------------------------');

// -------------------------    UDP SERVER    ------------------------- 

// udp server | create
var server = udp.createSocket('udp4');

// udp server | error
server.on('error', function (error) {
    console.log('UDP ERR |' + error);
    server.close();
});

// udp server | ready
server.on('listening', function () {
    console.log('UDP    | Server listening at port ' + server.address().port);
});

// udp server | on msg (60x per sec) update DameData
server.on('message', function (msg) {
    GameData = forza.parseData(msg);
    // hook
    for (const key in ext) {
        if (Object.hasOwnProperty.call(ext, key)) {
            const extension = ext[key];
            extension._hook_serve_message(GameData);
        }
    }
});

// udp server | bind to port 9999
server.bind(9999);


// -------------------------    HTTP SERVER    ------------------------- 

const host = 'localhost';
const port = 80;

// http | create server
const http_server = http.createServer(function (req, res) {

    // Serve /web files
    if (req.url == '/index.html' || req.url == '/') {
        fs.readFile('./web/index.html', function (err, data) {
            res.end(data);
        });
    } else if (req.url == '/forzastats.js') {
        fs.readFile('./web/forzastats.js', function (err, data) {
            res.end(data);
        });
    } else {
        res.end(JSON.stringify(GameData));
    }
});

// http | listen to port
http_server.listen(port, host, () => {
    console.log(`HTTTP  | Server is running on http://${host}:${port}`);
});


// -------------------------    EXTENSIONS   ------------------------- 

for (const key in config.extensions) {
    if (Object.hasOwnProperty.call(config.extensions, key)) {
        const extension = config.extensions[key];
        ext[key] = require(extension.file);
        ext[key].Setup(GameData, config);
    }
}
