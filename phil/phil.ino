#include "Servo.h"

Servo servo;
char ison = 'f';

void setup() {
  Serial.begin(9600);
  servo.attach(13);
}

void loop() {
  if(Serial.available() > 0){
    ison = Serial.read();
  }
  if(ison == 't'){
    servo.write(45);
    delay(500);
    servo.write(0);
    delay(500);
  }
  if(ison == 'f'){
    servo.write(45);
    delay(1000);
  }
}
