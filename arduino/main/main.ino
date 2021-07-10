/**
      This arduino project is a pc-compatible rev led bar for racing games

      Just connect your led´s (and if needet a resistor) to the digital output pins.
      The arduino will light them up depending on the rpm_ratio variable, which can
      be changed via sending a float over serial (2000000 baud).

*/

#define PIN_START 2
#define PIN_END 12

// float between 0 and 1, (calulated on node server and sent via serial, rpm / max-rpm)
float rpm_ratio = 2;

void setup()
{
  for (int i = PIN_START; i <= PIN_END; i++)
  {
    pinMode(i, OUTPUT);
  }

  // Config serial baud
  Serial.begin(2000000);
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
  for (int i = PIN_START; i <= PIN_END; i++)
  {
    digitalWrite(i, LOW);
  }

  // Set Leds based on rpm_ratio
  if (rpm_ratio > 1.9)
  {
    waitAnimation();
  }
  else if (rpm_ratio > 0.92)
  {
    digitalWrite(PIN_END, HIGH);
  } else
  {
    for (int i = PIN_START; i <= (PIN_END * rpm_ratio) + 1; i++)
    {
      digitalWrite(i, HIGH);
    }
  }
}

void waitAnimation() {
  for (int i = PIN_START; i <= PIN_END; i++)
  {
    digitalWrite(i, HIGH);
    delay(100);
  }
  for (int i = PIN_START; i <= PIN_END; i++)
  {
    digitalWrite(i, LOW);
    delay(100);
  }
  for (int i = PIN_END; i >= PIN_START; i--)
  {
    digitalWrite(i, HIGH);
    delay(100);
  }
  for (int i = PIN_END; i >= PIN_START; i--)
  {
    digitalWrite(i, LOW);
    delay(100);
  }
}
