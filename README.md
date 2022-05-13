# ForzaStats
The ForzaStats Project gives easy access to live data from Forza Horizon 4, 5 or Motorsports 7.

It uses the "data out" feature, which enables the game to output a UDP data stream to a configurable IP address.
Just run this project on a server or localy on you pc and point the UDP stream to it.
(Menue, Settings, Hud and Gameplay, scroll to the bottom, enable data out and configure ip and port)

## Forza Parser

The ForzaParser.js File handels the conversion from the udp-stream message to a usable object.

Tire specific data is selected with .xx

_example: the wheel rotation speed of the front-right wheel would be ```car.tire.wheelRotationSpeed.fr```_

- "fl": front left
- "fr": front right
- "rl": rear left
- "rr": rear right

The cars.json File in the root direcotry contains a list of every cars name and brand. This list doesn´t update automatically yet.

The ForzaParser.js ```parseData()``` method returns the following data:

```js
{
  "isRaceOn": 0,  // 1 = drive, 0 menu
  "timestampMS": 1031551109,  // can overflow to 0

  // CAR
  "car": {
    // car static values
    "id": 0,
    "class": "D",  // D, C, B, A, S1, S2, X
    "performanceIndex": 0,  // 100 - 999
    "drivetrainType": "FWD",  // FWD, RWD, AWD
    "numCylinders": 0,
    "engineMaxRpm": 0,
    "engineIdleRpm": 0,
    "isElectric": false,  // only works while driving!
    // car dynamic values
    "speed": 0,  // m/s
    "currentEngineRpm": 0,
    "power": 0,  // w
    "torque": 0,
    "gear": 0,  // 0 = reverse, 1 - x = gear
    "boost": 0,
    "fuel": 0,
    "distanceTraveled": 0,
    // car suspension
    "suspension": {
      // suspension travel (meters)
      "travel": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      },
      // suspension travel normalized (0 = max stretch, 1 = max compression)
      "normTravel": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      }
    },
    // car tire
    "tire": {
      // temp in f
      "temp": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      },
      // normalized slip ratio, 0 = 100% grip, |slip| > 1.0 no grip
      "slipRatio": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      },
      // normalized slip angle, 0 = 100% grip, |angle| > 1.0 no grip
      "slipAngle": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      },
      // normalized combined slip, 0 = 100% grip, |slip| > 1.0 no grip
      "CombinedSlip": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      },
      // rotation speed in radians/sec
      "wheelRotationSpeed": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      },
      // 1 when wheel on rumble strip
      "wheelOnRumbleStrip": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      },
      // from 0 to 1, where 1 is the deepest puddle
      "wheelInPuddleDepth": {
        "fl": 0,
        "fr": 0,
        "rl": 0,
        "rr": 0
      }
    },
    // car position in meters
    "position": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    // car rotation of car
    "rotation": {
      "yaw": 0,
      "pitch": 0,
      "roll": 0,
    },
    // x = right, y = up, z = forward
    "acceleration": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    // x = right, y = up, z = forward
    "velocity": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    // x = pitch, y = yaw, z = roll
    "angularVelocity": {
      "x": 0,
      "y": 0,
      "z": 0
    },
  },

  // INPUT
  "input": {
    // Rumble
    "surfaceRumble": {
      "fl": 0,
      "fr": 0,
      "rl": 0,
      "rr": 0
    },
    "accel": 0,
    "brake": 0,
    "clutch": 0,
    "handbrake": 0,
    "steer": 0
  },

  // RACE
  "race": {
    "bestLap": 0,
    "lastLap": 0,
    "currentLap": 0,
    "currentRaceTime": 0,
    "lapNumber": 0,
    "position": 0
  },

  // MISC
  "misc": {
    "normDrivingLine": 0,
    "normAIBrakeDiff": 0
  }
}
```


## Extensions
configure your own extensions in config.js

Extension must export functions:
  Setup: function (GameData, config)
  _hook_serve_message: function (GameData)


### HTTP Server Extension
The http server example is a website that shows car statistics.

### Serial COM Extension
The arduino example is a RPM display. The data is sent via serial usb.
