var udp = require('dgram');
const forza = require('./ForzaParser');

var GameData = {};

// load config and extension
var config = require('./config.js');
var ext = [];

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

// -------------------------    EXTENSIONS   ------------------------- 

for (const key in config.extensions) {
    if (Object.hasOwnProperty.call(config.extensions, key)) {
        const extension = config.extensions[key];
        ext[key] = require(extension.file);
        ext[key].Setup(GameData, config);
    }
}
