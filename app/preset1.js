import React, { useState } from 'react';
import { View, Text, TouchableOpacity,ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';


import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { stringToBytes } from "convert-string";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);



export default function PresetUm () {

    const navigation = useNavigation();
    const [isLedOn, setIsLedOn] = useState(false);

    const sendMessage = () => {
      let peripheralId = "B0:A7:32:15:39:42"; // ID do seu dispositivo periférico
      let serviceUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID do serviço
      let characteristicUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID da característica
      let data = isLedOn ? '0' : '1'; // comando que você deseja enviar
      let bytes = stringToBytes(data); // Converte o comando em uma matriz de bytes
      BleManager.start({ showAlert: false }).then(() => {
        // Success code
        console.log("Modulo ta bao");
      });
      BleManager.scan([], 5, true).then(() => {
        // Success code
        console.log("Scan started");
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
        setIsLedOn(!isLedOn);
      })
        .catch((error) => {
        // Falha ao escrever o comando
        console.log(error);
  });
      

    }
   

    return(
        <View style={styles.containerTelaPreset}>
          <ImageBackground source={require('../assets/imagemFundoMinimalista.jpg')} style={styles.image}>

            <Text style={styles.title}>Tela de Preset 1</Text>
            

            <TouchableOpacity onPress={() => {
          navigation.goBack();}} style={styles.botaoVoltar}>
            <Icon name="arrow-left"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={sendMessage}><Text style={{color:"white",alignItems:"center",justifyContent:"center",fontSize:35}}>Clique aqui para acender o led</Text></TouchableOpacity>
          </ImageBackground>
        </View>
        
    )

};
