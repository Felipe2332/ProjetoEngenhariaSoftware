/*Essa versão implementa uma latching switch, que envia sinais de status para um aplicativo de controle*/

#include <BLEDevice.h>
#include <BLEServer.h>

const int numPins = 8; // Quantidade de pinos usados
const int pins[numPins] = {2, 4, 5, 18, 19, 21, 22, 23}; // Definição de GPIOs
bool pinStatus[numPins] = {false}; // Inicialização de array de status dos pinos

const int buttonPin = 12;           // Pino do botão físico
const int outputPins[] = {25, 26, 27};  // Pinos de saída física
int currentOutput = 0;              // Índice da saída atual
int buttonState = 0;                // Estado atual do botão
int lastButtonState = HIGH;         // Estado anterior do botão
unsigned long lastDebounceTime = 0; // Tempo do último debounce
unsigned long debounceDelay = 50;   // Tempo de debounce (evita ruídos)
bool outputStates[] = {false, false, false}; // Estados das saídas
unsigned long lastToggleTime = 0;   // Tempo da última troca de saída
unsigned long toggleDelay = 500;    // Intervalo de troca de saída em milissegundos

// Definição dos UUIDs para o serviço e característica Bluetooth
#define SERVICE_UUID        "abcd1234-ab12-cd34-a123-456789abcdef"
#define CHARACTERISTIC_UUID "abcd1234-ab12-cd34-a123-456789abcdef"

// Inicialização do dispositivo BLE
BLEServer *pServer;
BLECharacteristic *pCharacteristic;

// Função para alternar as saídas e enviar requisições Bluetooth
void toggleOutput() {
  unsigned long currentMillis = millis();

  if (currentMillis - lastToggleTime >= toggleDelay) {
    outputStates[currentOutput] = !outputStates[currentOutput];
    digitalWrite(outputPins[currentOutput], outputStates[currentOutput]);

    // Adicione aqui o código para enviar a requisição Bluetooth correspondente
    pCharacteristic->setValue(std::to_string(100 * currentOutput + 1));
    pCharacteristic->notify();

    currentOutput = (currentOutput + 1) % 3; // Avança para a próxima saída em sequência

    lastToggleTime = currentMillis;
  }
}

// Classe para manipular as requisições Bluetooth
class MyCallbacks : public BLECharacteristicCallbacks {
public:
  MyCallbacks(BLECharacteristic* pChar) : pCharacteristic(pChar) {}

  void onWrite(BLECharacteristic *pCharacteristic) {
    std::string value = pCharacteristic->getValue();

    for (int i = 0; i < numPins; i++) {
      if (value == std::to_string(10 * (i+1) + 1)) {
        digitalWrite(pins[i], HIGH);
        pinStatus[i] = true;
      } else if (value == std::to_string(10 * (i+1))) {
        digitalWrite(pins[i], LOW);       
      }
    }

    for (int i = 0; i < 3; i++) {
      if (value == std::to_string(100 * (i+1) + 1)) {
        toggleOutput(); // Quando um valor é escrito na característica, troca a saída e envia a requisição Bluetooth
        pCharacteristic->setValue(""); // Limpa o valor da característica após ação
        pCharacteristic->notify();
      }
    }
  }

private:
  BLECharacteristic* pCharacteristic;
};

// Configuração inicial do programa
void setup() {
  // Configura os pinos como saídas e define o estado inicial como LOW (desligado)
  for (int i = 0; i < numPins; i++) {
    pinMode(pins[i], OUTPUT);
    digitalWrite(pins[i], LOW);
  }

  for (int i = 0; i < 3; i++) {
    pinMode(outputPins[i], OUTPUT);
    digitalWrite(outputPins[i], LOW);
  }

  // Inicializa o dispositivo BLE com um nome
  BLEDevice::init("ESP32_TESTE");

  // Cria um servidor BLE e um serviço
  pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Cria uma característica BLE com propriedades de leitura e escrita
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );

  // Define a função de callback para a característica BLE
  pCharacteristic->setCallbacks(new MyCallbacks(pCharacteristic));

  // Inicia o serviço e a publicidade BLE
  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
}

// Loop principal do programa
void loop() {
  int reading = digitalRead(buttonPin);

  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;

      if (buttonState == LOW) {
        toggleOutput(); // Quando o botão é pressionado, troca a saída e envia a requisição Bluetooth
        pCharacteristic->setValue(""); // Limpa o valor da característica após ação
        pCharacteristic->notify();
      }
    }
  }

  lastButtonState = reading;
}
