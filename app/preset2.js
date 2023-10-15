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



export default function PresetDois () {

    const navigation = useNavigation();
    const [isLedOn, setIsLedOn] = useState(false);
    const [isRedLedOn, setIsRedLedOn] = useState(false);
    const [isYellowLedOn, setIsYellowLedOn] = useState(false);
    const [isGreenLedOn, setIsGreenLedOn] = useState(false);// comando que você deseja enviar

    const sendMessage = (data) => {
      let peripheralId = "B0:A7:32:15:39:42"; // ID do seu dispositivo periférico
      let serviceUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID do serviço
      let characteristicUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID da característica
      
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
const toggleRedLed = () => {
  let data = isRedLedOn ? '10' : '11'; //Se for 11 liga, se for 10 desliga
  sendMessage(data);
  setIsRedLedOn(!isRedLedOn);
};
const toggleYellowLed = () => {
  let data = isYellowLedOn ? '20' : '21'; 
  sendMessage(data);
  setIsYellowLedOn(!isYellowLedOn);
};
const toggleGreenLed = () => {
  let data = isGreenLedOn ? '30' : '31'; 
  sendMessage(data);
  setIsGreenLedOn(!isGreenLedOn);

};
const toggleRedLed2 = () => {
  let data = isRedLedOn ? '40' : '41'; 
  sendMessage(data);
  setIsRedLedOn(!isRedLedOn);
};

const toggleGreenLed2 = () => {
  let data = isGreenLedOn ? '50' : '51'; 
  sendMessage(data);
  setIsGreenLedOn(!isGreenLedOn);

};
const toggleRedLed3 = () => {
  let data = isRedLedOn ? '60' : '61'; 
  sendMessage(data);
  setIsRedLedOn(!isRedLedOn);
};
const toggleRedLed4 = () => {
  let data = isRedLedOn ? '70' : '71'; 
  sendMessage(data);
  setIsRedLedOn(!isRedLedOn);
};
const toggleGreenLed3 = () => {
  let data = isGreenLedOn ? '80' : '81'; 
  sendMessage(data);
  setIsGreenLedOn(!isGreenLedOn);

};


   

    return(
      <ImageBackground source={require('../assets/peakpx.jpg')} style={styles.imagePresetUm}>

          <Text style={styles.title}>Tela de Preset 2</Text>
            

          <TouchableOpacity onPress={() => {navigation.goBack();}} style={styles.botaoVoltar}><Icon name="arrow-left"/></TouchableOpacity>
          
          <View style={styles.colunas}>
          <View style={styles.leftContainer}>
          <TouchableOpacity style={{backgroundColor:"red",borderRadius:15,marginBottom:30}}onPress={toggleRedLed}><Text style={styles.textoBotaoDentroPreset}>RedLead</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#ffd700',borderRadius:15,marginBottom:30}}onPress={toggleYellowLed}><Text style={styles.textoBotaoDentroPreset}>YellowLed</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#adff2f',borderRadius:15,marginBottom:30}}onPress={toggleGreenLed}><Text style={styles.textoBotaoDentroPreset}>GreenLed</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'red',borderRadius:15,marginBottom:30}}onPress={toggleRedLed2}><Text style={styles.textoBotaoDentroPreset}>RedLed2</Text></TouchableOpacity>
          </View>
          
          
          <View style={styles.rightContainer}>
          <TouchableOpacity style={{backgroundColor:"#adff2f",borderRadius:15,marginBottom:30}}onPress={toggleGreenLed2}><Text style={styles.textoBotaoDentroPreset}>GreenLed2</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'red',borderRadius:15,marginBottom:30}}onPress={toggleRedLed3}><Text style={styles.textoBotaoDentroPreset}>RedLed3</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:"red",borderRadius:15,marginBottom:30}}onPress={toggleRedLed4}><Text style={styles.textoBotaoDentroPreset}>RedLed4</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:"#adff2f",borderRadius:15,marginBottom:30}}onPress={toggleGreenLed3}><Text style={styles.textoBotaoDentroPreset}>GreenLed3</Text></TouchableOpacity>
          </View>
          </View>
      </ImageBackground>
        
    )

};
