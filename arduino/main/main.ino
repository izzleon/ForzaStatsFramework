/**
      This arduino project is a pc-compatible rev led bar for racing games

      Just connect your led´s (and if needed a resistor) to the digital output pins.
      The arduino will light them up depending on the rpm_ratio variable, which can
      be changed via sending a float over serial (921600 baud).

*/

// LED PINS
int mypins [10] = {15, 2, 4, 17, 5, 18, 19, 21, 22, 23};

// float between 0 and 1, (calulated on node server and sent via serial, rpm / max-rpm)
float rpm_ratio = 1;

void setup()
{
  // set pins to output
  for (int i = 0; i <= sizeof(mypins); i++)
  {
    pinMode(mypins[i], OUTPUT);
  }

  // Config serial baud
  Serial.begin(921600);
  while (!Serial);
}

void loop()
{
  // update rpm_ratio
  if (Serial.available() > 0)
  {
    rpm_ratio = Serial.parseFloat();
  }

  // RESET LEDS
  for (int i = 0; i <= sizeof(mypins); i++)
  {
    digitalWrite(i, LOW);
  }


  // Set Leds based on rpm_ratio
  if (rpm_ratio > 0.92)
  {
    digitalWrite(23, HIGH);
  } else
  {
    for (int i = 0; i <= (11 * rpm_ratio) - 1; i++)
    {
      digitalWrite(mypins[i], HIGH);
    }
  }
  delay(10);
}
