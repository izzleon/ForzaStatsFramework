module.exports = {

  "extensions": {
    arduinoCOMPort: {
      file: "./arduino/arduinoCOMPort.js",
      config: {
        port: "COM5",
        baudRate: 2000000,
        delayMs: 100,
      }
    },
    http: {
      file: "./web/http_extension.js",
      config: {
        host: "localhost",
        port: 80,
        www_dir: "./web/www",
      }
    },
  }
};