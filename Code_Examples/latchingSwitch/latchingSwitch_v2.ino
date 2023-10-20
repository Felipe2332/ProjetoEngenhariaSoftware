const int buttonPin = 12;
const int outputPins[] = {25, 26, 27};
int currentOutput = 0;
int buttonState = 0;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
bool outputState[] = {false, false, false};

void setup() {
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
        // Se o botão está pressionado, alterne a saída
        outputState[currentOutput] = !outputState[currentOutput];
        digitalWrite(outputPins[currentOutput], outputState[currentOutput]);

        // Desligue a saída anterior
        int previousOutput = (currentOutput + 2) % 3;
        outputState[previousOutput] = false;
        digitalWrite(outputPins[previousOutput], outputState[previousOutput]);

        // Atualize a saída atual para a próxima
        currentOutput = (currentOutput + 1) % 3;
      }
    }
  }

  lastButtonState = reading;
}
