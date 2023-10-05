// Definição dos UUIDs para o serviço e característica Bluetooth
#define SERVICE_UUID        "abcd1234-ab12-cd34-a123-456789abcdef"
#define CHARACTERISTIC_UUID "abcd1234-ab12-cd34-a123-456789abcdef"

// Inclusão das bibliotecas necessárias para BLE (Bluetooth Low Energy)
#include <BLEDevice.h>
#include <BLEServer.h>

// Definição dos pinos e status dos LEDs
const int pins[] = {2, 4, 5, 18, 19, 21, 22, 23};
bool pinStatus[] = {false, false, false, false, false, false, false, false};

// Classe de Callbacks para a característica BLE
class MyCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    // Obtém o valor escrito na característica BLE
    std::string value = pCharacteristic->getValue();
    
    for (int i = 0; i < 8; i++) {
      if (value == std::to_string(10 * i + 1)) {
        digitalWrite(pins[i], HIGH);
        pinStatus[i] = true;
      } else if (value == std::to_string(10 * i)) {
        digitalWrite(pins[i], LOW);
        pinStatus[i] = false;
      }
    }
  }
};

void setup() {
  // Configura os pinos como saídas e define o estado inicial como LOW (desligado)
  for (int i = 0; i < 8; i++) {
    pinMode(pins[i], OUTPUT);
    digitalWrite(pins[i], LOW);
  }

  // Inicializa o dispositivo BLE com um nome
  BLEDevice::init("ESP32_TESTE");

  // Cria um servidor BLE e um serviço
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Cria uma característica BLE com propriedades de leitura e escrita
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );

  // Define a função de callback para a característica BLE
  pCharacteristic->setCallbacks(new MyCallbacks());

  // Inicia o serviço e a publicidade BLE
  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
}

void loop() {
  // Nada acontece no loop principal, pois a comunicação BLE é tratada em callbacks
}
