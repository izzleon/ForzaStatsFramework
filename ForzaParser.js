const fs = require("fs");

var CarData;

module.exports = {
    parseData: function (message) {

        var forza = {
            car: {
                suspension: {
                    travel: {},
                    normTravel: {},
                },
                tire: {
                    temp: {},
                    slipRatio: {},
                    slipAngle: {},
                    CombinedSlip: {},
                    wheelRotationSpeed: {},
                    wheelOnRumbleStrip: {},
                    wheelInPuddleDepth: {},
                },
                position: {},
                rotation: {},
                acceleration: {},
                velocity: {},
                angularVelocity: {},
            },
            input: {
                surfaceRumble: {},
            },
            race: {},
            misc: {},
        }


        // GAMESTATE
        forza.isRaceOn = message.readInt32LE(0);        // 1 = drive, 0 menu
        forza.timestampMS = message.readUInt32LE(4);    // can overflow to 0


        // CAR STATIC INFO
        forza.car.id = message.readInt32LE(212);
        forza.car.class = convertCarClass(message.readInt32LE(216));
        forza.car.performanceIndex = message.readInt32LE(220);
        forza.car.drivetrainType = convertDrivetrain(message.readInt32LE(224));

        forza.car.numCylinders = message.readInt32LE(228);
        forza.car.engineMaxRpm = message.readFloatLE(8);
        forza.car.engineIdleRpm = message.readFloatLE(12);

        // If numCylinders = 0 electric
        // only works while driving!
        forza.car.isElectric = (forza.car.numCylinders === 0 && forza.isRaceOn === 1) ? true : false;

        model = getCarModelById(message.readInt32LE(212))
        if (model) {
            forza.car.model = model.name
            forza.car.brand = model.brand
        }


        // CAR DYNAMIC INFO
        forza.car.speed = message.readFloatLE(256);             // m/s
        forza.car.currentEngineRpm = message.readFloatLE(16);
        forza.car.power = message.readFloatLE(260);             // w
        forza.car.torque = message.readFloatLE(264);
        forza.car.gear = message.readUInt8(319);                // 0 = reverse, 1 - x = gear
        forza.car.boost = message.readFloatLE(284);
        forza.car.fuel = message.readFloatLE(288);
        forza.car.distanceTraveled = message.readFloatLE(292);


        // INPUT INFO
        forza.input.accel = message.readUInt8(315);
        forza.input.brake = message.readUInt8(316);
        forza.input.clutch = message.readUInt8(317);
        forza.input.handbrake = message.readUInt8(318);
        forza.input.steer = message.readUInt8(320);


        //  POSITION INFO
        // position in meters
        forza.car.position.x = message.readFloatLE(244);
        forza.car.position.y = message.readFloatLE(248);
        forza.car.position.z = message.readFloatLE(252);

        // rotation of car
        forza.car.rotation.yaw = message.readFloatLE(56);
        forza.car.rotation.pitch = message.readFloatLE(60);
        forza.car.rotation.roll = message.readFloatLE(64);

        // x = right, y = up, z = forward
        forza.car.acceleration.x = message.readFloatLE(20);
        forza.car.acceleration.y = message.readFloatLE(24);
        forza.car.acceleration.z = message.readFloatLE(28);

        // x = right, y = up, z = forward
        forza.car.velocity.x = message.readFloatLE(32);
        forza.car.velocity.y = message.readFloatLE(36);
        forza.car.velocity.z = message.readFloatLE(40);

        // x = pitch, y = yaw, z = roll
        forza.car.angularVelocity.x = message.readFloatLE(44);
        forza.car.angularVelocity.y = message.readFloatLE(48);
        forza.car.angularVelocity.z = message.readFloatLE(52);


        // SUSPENSION INFO
        // suspension travel normalized (0 = max stretch, 1 = max compression)
        forza.car.suspension.normTravel.fl = message.readFloatLE(68);
        forza.car.suspension.normTravel.fr = message.readFloatLE(72);
        forza.car.suspension.normTravel.rl = message.readFloatLE(76);
        forza.car.suspension.normTravel.rr = message.readFloatLE(80);
        // suspension travel (meters)
        forza.car.suspension.travel.fl = message.readFloatLE(196);
        forza.car.suspension.travel.fr = message.readFloatLE(200);
        forza.car.suspension.travel.rl = message.readFloatLE(204);
        forza.car.suspension.travel.rr = message.readFloatLE(208);


        // TIRE INFO
        // temp in f
        forza.car.tire.temp.fl = message.readFloatLE(268);
        forza.car.tire.temp.fr = message.readFloatLE(272);
        forza.car.tire.temp.rl = message.readFloatLE(276);
        forza.car.tire.temp.rr = message.readFloatLE(280);

        // normalized slip ratio, 0 = 100% grip, |slip| > 1.0 no grip
        forza.car.tire.slipRatio.fl = message.readFloatLE(84);
        forza.car.tire.slipRatio.fr = message.readFloatLE(88);
        forza.car.tire.slipRatio.rl = message.readFloatLE(92);
        forza.car.tire.slipRatio.rr = message.readFloatLE(96);

        // rotation speed in radians/sec
        forza.car.tire.wheelRotationSpeed.fl = message.readFloatLE(100);
        forza.car.tire.wheelRotationSpeed.fr = message.readFloatLE(104);
        forza.car.tire.wheelRotationSpeed.rl = message.readFloatLE(108);
        forza.car.tire.wheelRotationSpeed.rr = message.readFloatLE(112);

        // 1 when wheel on rumble strip
        forza.car.tire.wheelOnRumbleStrip.fl = message.readFloatLE(116);
        forza.car.tire.wheelOnRumbleStrip.fr = message.readFloatLE(120);
        forza.car.tire.wheelOnRumbleStrip.rl = message.readFloatLE(124);
        forza.car.tire.wheelOnRumbleStrip.rr = message.readFloatLE(128);

        // from 0 to 1, where 1 is the deepest puddle
        forza.car.tire.wheelInPuddleDepth.fl = message.readFloatLE(132);
        forza.car.tire.wheelInPuddleDepth.fr = message.readFloatLE(136);
        forza.car.tire.wheelInPuddleDepth.rl = message.readFloatLE(140);
        forza.car.tire.wheelInPuddleDepth.rr = message.readFloatLE(144);

        // normalized slip angle, 0 = 100% grip, |angle| > 1.0 no grip
        forza.car.tire.slipAngle.fl = message.readFloatLE(164);
        forza.car.tire.slipAngle.fr = message.readFloatLE(168);
        forza.car.tire.slipAngle.rl = message.readFloatLE(172);
        forza.car.tire.slipAngle.rr = message.readFloatLE(176);

        // normalized combined slip, 0 = 100% grip, |slip| > 1.0 no grip
        forza.car.tire.CombinedSlip.fl = message.readFloatLE(180);
        forza.car.tire.CombinedSlip.fr = message.readFloatLE(184);
        forza.car.tire.CombinedSlip.rl = message.readFloatLE(188);
        forza.car.tire.CombinedSlip.rr = message.readFloatLE(192);


        // Race Info
        forza.race.bestLap = message.readFloatLE(296);
        forza.race.lastLap = message.readFloatLE(300);
        forza.race.currentLap = message.readFloatLE(304);
        forza.race.currentRaceTime = message.readFloatLE(308);
        forza.race.lapNumber = message.readUInt16LE(312);
        forza.race.position = message.readUInt8(314);


        // Rumble
        forza.input.surfaceRumble.fl = message.readFloatLE(148); 
        forza.input.surfaceRumble.fr = message.readFloatLE(152);
        forza.input.surfaceRumble.rl = message.readFloatLE(156);
        forza.input.surfaceRumble.rr = message.readFloatLE(160);


        // misc
        forza.misc.normDrivingLine = message.readUInt8(321);
        forza.misc.normAIBrakeDiff = message.readUInt8(322);

        return forza;
    }
}

// -------------------------    helperfunctions    ------------------------- 

/**
 * Gets model (name and brand) info
 * @param {int} id - Forza car id
 */
function getCarModelById(id) {

    // if data isn´t loadet read from json file
    if (!CarData) {
        fs.readFile('./cars.json', function (err, data) {
            CarData = JSON.parse(data);
            return (id) ? CarData[id] : undefined;
        });
    }

    // else return data
    else {
        return (CarData[id]) ? CarData[id] : undefined;
    }
}

/**
 * gets performance class from number
 * @param {int} num - 0 to 6 = (D - X)
 */
function convertCarClass(num) {
    let classes = ['D','C','B','A','S1','S2','X'];
    return classes[num];
}

/**
 * gets drivetrain type from number
 * @param {int} num - 0 = FWD, 1 = RWD, 2 = AWD
 */
function convertDrivetrain(num) {
    let types = ['FWD','RWD','4WD'];
    return types[num];
}