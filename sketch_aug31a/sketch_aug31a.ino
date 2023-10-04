#define SERVICE_UUID        "abcd1234-ab12-cd34-a123-456789abcdef"
#define CHARACTERISTIC_UUID "abcd1234-ab12-cd34-a123-456789abcdef"

#include <BLEDevice.h>
#include <BLEServer.h>

const int ledPin = 2;
const int d4Pin = 4; // Porta D4
const int d5Pin = 5; //Porta D5
bool ledStatus = false;
bool d4Status = false;
bool d5Status = false;

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if (value == "1") {
        digitalWrite(ledPin, HIGH);
      } else if (value == "0") {
        digitalWrite(ledPin, LOW);
      } else if (value == "4") {
        digitalWrite(d4Pin, HIGH); // Liga a porta D4
      } else if (value == "10") {
        digitalWrite(d4Pin, LOW); // Desliga a porta D4
      }
      else if(value == "5") {
        digitalWrite(d5Pin, HIGH); // Liga a porta D4
      } else if (value == "11") {
        digitalWrite(d5Pin, LOW); // Desliga a porta D4
      }
    }
};

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(d4Pin, OUTPUT); // Configura a porta D4 como saída
  pinMode(d5Pin, OUTPUT); // Configura a porta D5 como saída
  digitalWrite(ledPin, LOW);
  digitalWrite(d4Pin, LOW);
  digitalWrite(d5Pin, LOW);

  BLEDevice::init("ESP32_TESTE");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setCallbacks(new MyCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
}

void loop() {
  // Seu código aqui
}
