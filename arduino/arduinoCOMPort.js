// -------------------------    SERIAL COM EXTENSION FOR FORZASTATS    ------------------------- 
var rpm_ration = 0;

module.exports = {
    Setup: function (GameData, config) {
        var SerialPort = require("serialport");

        // Get Port from config
        let arduinoCOMPort = config.extensions.arduinoCOMPort.config.port;

        var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
            baudRate: config.extensions.arduinoCOMPort.config.baudRate
        });

        // serial | when opened, set server on message event
        arduinoSerialPort.on('open', function () {
            console.log('SERIAL | Port ' + arduinoCOMPort + ' is opened and hooked.');

            // serial | send data
            setInterval(() => {
                msg = rpm_ration.toFixed(2).toString();
                arduinoSerialPort.write(msg);
            }, config.extensions.arduinoCOMPort.config.delayMs);
        });
    },
    
    _hook_serve_message: function (GameData) {
        rpm_ration = Math.floor(GameData.car.currentEngineRpm) / GameData.car.engineMaxRpm;
    }
}