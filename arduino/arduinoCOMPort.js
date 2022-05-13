// -------------------------    SERIAL COM EXTENSION FOR FORZASTATS    ------------------------- 
var rpm_ration = 0;
var arduinoSerialPort
var SERIAL_OPEN = false;

module.exports = {
    Setup: function (GameData, config) {
        var SerialPort = require("serialport");

        // Get Port from config
        let arduinoCOMPort = config.extensions.arduinoCOMPort.config.port;
        
        arduinoSerialPort = new SerialPort(arduinoCOMPort, {
            baudRate: config.extensions.arduinoCOMPort.config.baudRate
        });

        // serial opened
        arduinoSerialPort.on('open', function () {
            console.log('SERIAL | Port ' + arduinoCOMPort + ' is opened and hooked.');
            SERIAL_OPEN = true;
        });
    },
    
    // on new data
    _hook_serve_message: function (GameData) {
        // calc rpm ration
        rpm_ration = Math.floor(GameData.car.currentEngineRpm) / GameData.car.engineMaxRpm;
        msg = rpm_ration.toFixed(2).toString();
        
        // send data
        if (msg != "NaN" && SERIAL_OPEN) {
            arduinoSerialPort.write(msg + "\n");
        }
    }
}