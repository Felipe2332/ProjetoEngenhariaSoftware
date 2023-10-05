// Definição dos UUIDs para o serviço e característica Bluetooth
#define SERVICE_UUID        "abcd1234-ab12-cd34-a123-456789abcdef"
#define CHARACTERISTIC_UUID "abcd1234-ab12-cd34-a123-456789abcdef"

// Inclusão das bibliotecas necessárias para BLE (Bluetooth Low Energy)
#include <BLEDevice.h>
#include <BLEServer.h>

// Definição dos pinos e status dos LEDs
const int x1 = 2;
const int x2 = 4;
const int x3 = 5;
const int x4 = 18;
const int x5 = 19;
const int x6 = 21;
const int x7 = 22;
const int x8 = 23;

bool x1Status = false;
bool x2Status = false;
bool x3Status = false;
bool x4Status = false;
bool x5Status = false;
bool x6Status = false;
bool x7Status = false;
bool x8Status = false;

// Classe de Callbacks para a característica BLE
class MyCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    // Obtém o valor escrito na característica BLE
    std::string value = pCharacteristic->getValue();

    // Verifica o valor e realiza ação correspondente
    if (value == "11") {
      digitalWrite(x1, HIGH); // Liga o LED conectado ao pino D2
    } else if (value == "10") {
      digitalWrite(x1, LOW); // Desliga o LED conectado ao pino D2
    } else if (value == "21") {
      digitalWrite(x2, HIGH); // Liga o LED conectado ao pino D4
    } else if (value == "20") {
      digitalWrite(x2, LOW); // Desliga o LED conectado ao pino D4
    } else if (value == "31") {
      digitalWrite(x3, HIGH); // Liga o LED conectado ao pino D5
    } else if (value == "30") {
      digitalWrite(x3, LOW); // Desliga o LED conectado ao pino D5
    } else if (value == "41") {
      digitalWrite(x4, HIGH); // Liga o LED conectado ao pino D18
    } else if (value == "40") {
      digitalWrite(x4, LOW); // Desliga o LED conectado ao pino D18
    } else if (value == "51") {
      digitalWrite(x5, HIGH); // Liga o LED conectado ao pino D19
    } else if (value == "50") {
      digitalWrite(x5, LOW); // Desliga o LED conectado ao pino D19
     } else if (value == "61") {
      digitalWrite(x6, HIGH); // Liga o LED conectado ao pino D21
    } else if (value == "60") {
      digitalWrite(x6, LOW); // Desliga o LED conectado ao pino D21
     } else if (value == "71") {
      digitalWrite(x7, HIGH); // Liga o LED conectado ao pino D23
    } else if (value == "70") {
      digitalWrite(x7, LOW); // Desliga o LED conectado ao pino D23
     } else if (value == "81") {
      digitalWrite(x8, HIGH); // Liga o LED conectado ao pino D24
    } else if (value == "80") {
      digitalWrite(x8, LOW); // Desliga o LED conectado ao pino D24
    }
  }
};

void setup() {
  // Configura os pinos como saídas e define o estado inicial como LOW (desligado)
  pinMode(x1, OUTPUT);
  pinMode(x2, OUTPUT);
  pinMode(x3, OUTPUT);
  pinMode(x4, OUTPUT);
  pinMode(x5, OUTPUT);
  pinMode(x6, OUTPUT);
  pinMode(x7, OUTPUT);
  pinMode(x8, OUTPUT);

  digitalWrite(x1, LOW);
  digitalWrite(x2, LOW);
  digitalWrite(x3, LOW);
  digitalWrite(x4, LOW);
  digitalWrite(x5, LOW);
  digitalWrite(x6, LOW);
  digitalWrite(x7, LOW);
  digitalWrite(x8, LOW);

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
