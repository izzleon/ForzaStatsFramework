module.exports = {

  // Server Configuration
  server:{
    port: 9999
  },

  // EXTENNSTION
  extensions: {
    // rpm display
    arduinoCOMPort: {
      file: "./arduino/arduinoCOMPort.js",
      config: {
        port: "COM3",
        baudRate: 921600,
        delayMs: 10,
      }
    },
    // statistics website
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
