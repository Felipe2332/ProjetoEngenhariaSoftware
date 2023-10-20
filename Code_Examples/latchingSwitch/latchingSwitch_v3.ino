/*Esse código consiste em uma latching switch que ativa portas físicas de um ESP32.
É apresentado o estado atual da porta ativada via requisições Bluetooth, para algum aplicativo de visualização.
Regra de funcionamento:
  porta 25 desligada = 100;
  porta 25 ligada = 101;
  porta 26 desligada = 200;
  porta 26 ligada = 201;
  porta 27 desligada = 300;
  porta 27 ligada = 301;
*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLECharacteristic.h>

const int buttonPin = 12;
const int outputPins[] = {25, 26, 27};
int currentOutput = 0;
int buttonState = 0;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
bool outputState[] = {false, false, false};
BLEServer *pServer = NULL;
BLECharacteristic *pCharacteristic = NULL;

void setup() {
  for (int i = 0; i < 3; i++) {
    pinMode(outputPins[i], OUTPUT);
  }
  pinMode(buttonPin, INPUT_PULLUP);

  // Inicializa o dispositivo BLE com um nome
  BLEDevice::init("ESP32_BLE_Switch");

  // Cria um servidor BLE e um serviço
  pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(BLEUUID("abcd1234-ab12-cd34-a123-456789abcdef")); // Substitua pelo seu UUID de serviço

  // Cria uma característica BLE com propriedades de leitura
  pCharacteristic = pService->createCharacteristic(
    BLEUUID("abcd1234-ab12-cd34-a123-456789abcdef"), BLECharacteristic::PROPERTY_READ
  ); // Substitua pelo seu UUID de característica

  // Inicia o serviço e a publicidade BLE
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
        // Se o botão está pressionado, alterne a saída
        outputState[currentOutput] = !outputState[currentOutput];
        digitalWrite(outputPins[currentOutput], outputState[currentOutput]);

        // Desligue a saída anterior
        int previousOutput = (currentOutput + 2) % 3;
        outputState[previousOutput] = false;
        digitalWrite(outputPins[previousOutput], outputState[previousOutput]);

        // Atualize a saída atual para a próxima
        currentOutput = (currentOutput + 1) % 3;

        // Atualiza o valor da característica BLE e notifica com números
        int outputStatus = (outputPins[currentOutput] * 100) + (outputState[currentOutput] ? 1 : 0);
        pCharacteristic->setValue(outputStatus);
        pCharacteristic->notify();
      }
    }
  }

  lastButtonState = reading;
}
