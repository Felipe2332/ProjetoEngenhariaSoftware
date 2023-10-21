# Entendendo o Código do Latching Switch com Bluetooth

## Este documento oferece uma explicação detalhada do código que implementa um latching switch e envia sinais de status via Bluetooth em um dispositivo ESP32.

1. Importação das Bibliotecas
O código começa importando as bibliotecas necessárias para a funcionalidade BLE (Bluetooth Low Energy) e define as constantes que representam os pinos GPIO usados e o número total de pinos.

2. Configuração Inicial
- `buttonPin`: Define o pino do botão.
- `outputPins`: Armazena os pinos GPIO que controlam as saídas.
- `numPins`: Define o número total de pinos GPIO usados.
- `pins`: Armazena os pinos GPIO adicionais usados no dispositivo.
- Variáveis de controle são inicializadas.

3. Criação das Características BLE
- Define os UUIDs para o serviço e as duas características BLE: uma para o latching switch e outra para o controlador.
- Cria o servidor BLE e um serviço.
- Cria uma característica BLE para o latching switch com propriedades de leitura, gravação e notificação.
- Define callbacks para as características BLE do latching switch e do controlador.
- Cria uma característica BLE para o controlador com propriedades de leitura, gravação e notificação.

4. Configuração Inicial do Dispositivo
- Inicializa o dispositivo BLE com um nome.
- Inicializa o servidor e o serviço BLE.
- Inicia a publicidade BLE.

5. Função `loop()`
Este é o loop principal que realiza as seguintes ações:
- Lê o estado do botão e realiza o debounce para evitar leituras falsas.
- Quando o botão é pressionado, alterna a saída atual entre os pinos GPIO definidos, seguindo o padrão de latching switch.
- Atualiza o valor da característica BLE do latching switch para refletir o novo estado.
- Notifica dispositivos Bluetooth conectados sobre a mudança de status.

6. Callbacks para Características BLE
- `MySwitchCallbacks`: Quando um valor é escrito na característica de latching switch, este callback interpreta o valor e controla as saídas GPIO.
- `MyControllerCallbacks`: Quando um valor é escrito na característica do controlador, este callback interpreta o valor e controla os pinos GPIO adicionais.

Este código combina a funcionalidade de um latching switch com a capacidade de controlar e monitorar as saídas via Bluetooth. As características BLE permitem controlar o latching switch e os pinos GPIO adicionais remotamente. Certifique-se de configurar os UUIDs corretamente para o seu projeto e adaptar os pinos GPIO conforme necessário.
