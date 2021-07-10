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
  }
};