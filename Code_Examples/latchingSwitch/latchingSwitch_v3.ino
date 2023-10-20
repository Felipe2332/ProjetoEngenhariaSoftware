/*Esse código implementa uma latching switch que envia status da porta via Bluetooth, sendo:
  porta 25 desligada = 100;
  porta 25 ligada = 101;
  porta 26 desligada = 200;
  porta 26 ligada = 201;
  porta 27 desligada = 300;
  porta 27 ligada = 301;
*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

const int buttonPin = 12;
const int outputPins[] = {25, 26, 27};
int currentOutput = 0;
int buttonState = 0;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
bool outputState[] = {false, false, false};

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;

class CharacteristicCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    std::string value = pCharacteristic->getValue();
    String statusMessage = "porta " + String(outputPins[currentOutput]) + " ";
    
    if (value == "1") {
      outputState[currentOutput] = true;
      digitalWrite(outputPins[currentOutput], HIGH);
      statusMessage += "ligada = " + String(100 + outputPins[currentOutput]);
    } else if (value == "0") {
      outputState[currentOutput] = false;
      digitalWrite(outputPins[currentOutput], LOW);
      statusMessage += "desligada = " + String(100 + outputPins[currentOutput]);
    }

    currentOutput = (currentOutput + 1) % 3;
    pCharacteristic->setValue(statusMessage.c_str());
    pCharacteristic->notify();
  }
};

void setup() {
  BLEDevice::init("ESP32_BLE_Switch");
  pServer = BLEDevice::createServer();
  
  BLEService* pService = pServer->createService(BLEUUID("abcd1234-ab12-cd34-a123-456789abcdef"));
  pCharacteristic = pService->createCharacteristic(BLEUUID("abcd1234-ab12-cd34-a123-456789abcdef"), BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);

  pCharacteristic->setCallbacks(new CharacteristicCallbacks());
  pService->start();
  BLEAdvertising* pAdvertising = pServer->getAdvertising();
  pAdvertising->start();

  for (int i = 0; i < 3; i++) {
    pinMode(outputPins[i], OUTPUT);
  }
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int reading = digitalRead(buttonPin);
  
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;

      if (buttonState == LOW) {
        outputState[currentOutput] = !outputState[currentOutput];
        digitalWrite(outputPins[currentOutput], outputState[currentOutput]);
        int statusValue = outputState[currentOutput] ? 101 : 100;
        String statusMessage = "porta " + String(outputPins[currentOutput]) + " " + (outputState[currentOutput] ? "ligada = " : "desligada = ") + String(statusValue);
        pCharacteristic->setValue(statusMessage.c_str());
        pCharacteristic->notify();
        currentOutput = (currentOutput + 1) % 3;
      }
    }
  }

  lastButtonState = reading;
}
