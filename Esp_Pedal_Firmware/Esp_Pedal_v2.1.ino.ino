/*Essa versão implementa uma latching switch, que envia sinais de status para um aplicativo de controle*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLECharacteristic.h>

const int buttonPin = 12;
const int outputPins[] = {25, 26, 27};
const int numPins = 8;
const int pins[numPins] = {2, 4, 5, 18, 19, 21, 22, 23};

int currentOutput = 0;
int buttonState = 0;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
bool outputState[] = {false, false, false};
bool pinStatus[numPins] = {false};

BLEServer *pServer;
BLECharacteristic *pCharacteristicSwitch;
BLECharacteristic *pCharacteristicController;

// Definição dos UUIDs
#define SERVICE_UUID        "abcd1234-ab12-cd34-a123-456789abcdef"
#define CHARACTERISTIC_SWITCH_UUID "bbcd1234-ab12-cd34-a123-456789abcdef"
#define CHARACTERISTIC_CONTROLLER_UUID "abcd1234-ab12-cd34-a123-456789abcdef"

class MySwitchCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    // Se o valor escrito for 1, ligue a saída correspondente
    if (pCharacteristic->getValue().c_str()[0] == '1') {
      outputState[currentOutput] = true;
      digitalWrite(outputPins[currentOutput], HIGH);
    } else {
      outputState[currentOutput] = false;
      digitalWrite(outputPins[currentOutput], LOW);
    }
  }
};

// Classe para manipular as requisições Bluetooth
class MyControllerCallbacks : public BLECharacteristicCallbacks {
public:
  MyControllerCallbacks() {}

  void onWrite(BLECharacteristic *pCharacteristic) {
    std::string value = pCharacteristic->getValue();

    for (int i = 0; i < numPins; i++) {
      if (value == std::to_string(10 * (i+1) + 1)) {
        digitalWrite(pins[i], HIGH);
        pinStatus[i] = true;
      } else if (value == std::to_string(10 * (i+1))) {
        digitalWrite(pins[i], LOW);       
        pinStatus[i] = false;
      }
    }
  }
};

void setup() {
  for (int i = 0; i < 3; i++) {
    pinMode(outputPins[i], OUTPUT);
  }

  for (int i = 0; i < numPins; i++) {
    pinMode(pins[i], OUTPUT);
    digitalWrite(pins[i], LOW);
  }

  pinMode(buttonPin, INPUT_PULLUP);

  BLEDevice::init("ESP32_TESTE");

  pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristicSwitch = pService->createCharacteristic(
  CHARACTERISTIC_SWITCH_UUID,
  BLECharacteristic::PROPERTY_READ |
  BLECharacteristic::PROPERTY_WRITE |
  BLECharacteristic::PROPERTY_NOTIFY
);
  pCharacteristicSwitch->setCallbacks(new MySwitchCallbacks());

  pCharacteristicController = pService->createCharacteristic(
    CHARACTERISTIC_CONTROLLER_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY
  );
  pCharacteristicController->setCallbacks(new MyControllerCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
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
        // Se o botão estiver pressionado, alterne a saída
        outputState[currentOutput] = !outputState[currentOutput];
        digitalWrite(outputPins[currentOutput], outputState[currentOutput]);

        // Desligue a saída anterior
        int previousOutput = (currentOutput + 2) % 3;
        outputState[previousOutput] = false;
        digitalWrite(outputPins[previousOutput], outputState[previousOutput]);

        // Atualize a saída atual para a próxima
        currentOutput = (currentOutput + 1) % 3;

        // Atualize o valor da característica BLE e notifique
        switch (currentOutput) {
          case 0:
            pCharacteristicSwitch->setValue("1");
            pCharacteristicSwitch->notify();
            break;
          case 1:
            pCharacteristicSwitch->setValue("2");
            pCharacteristicSwitch->notify();
            break;
          case 2:
            pCharacteristicSwitch->setValue("3");
            pCharacteristicSwitch->notify();
            break;
        }
        
      }
    }
  }

  lastButtonState = reading;
}
