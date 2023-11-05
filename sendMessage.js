import BleManager from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";
import React, { useState, useEffect,useRef} from 'react';




export const sendMessage = (data,setLedState) => {
    let peripheralId = "B0:A7:32:15:39:42"; // ID do seu dispositivo periférico
    let serviceUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID do serviço
    let characteristicUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID da característica
    
    
    
    let bytes = stringToBytes(data); // Converte o comando em uma matriz de bytes

    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Modulo ta bao");
    });
    
    BleManager.connect("B0:A7:32:15:39:42")
    
    
.then(() => {
  // Success code
  console.log("Connected");
})
.catch((error) => {
  // Failure code
  console.log(error);
});
    BleManager.write(peripheralId, serviceUUID, characteristicUUID, bytes)
    .then(() => {
      // Sucesso ao escrever o comando
      console.log('Comando enviado');
      setLedState(prevState => !prevState);
    })
      .catch((error) => {
      // Falha ao escrever o comando
      console.log(error);
      
});

}//Fim da função de envio de dados