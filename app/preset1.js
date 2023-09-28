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

    const sendMessage = () => {
      let peripheralId = "8C:79:F5:F6:12:A5"; // ID do seu dispositivo periférico
      let serviceUUID = "00001101-0000-1000-8000-00805F9B34FB"; // UUID do serviço
      let characteristicUUID = "00011101-0000-1000-8000-00805F9B34FB"; // UUID da característica
      let data = '1'; // comando que você deseja enviar
      let bytes = stringToBytes(data); // Converte o comando em uma matriz de bytes
  
      BleManager.connect(peripheralId)
        .then(() => {
          console.log("Connected");
          return BleManager.write(peripheralId, serviceUUID, characteristicUUID, bytes);
        })
        .then(() => {
          console.log('Command sent');
        })
        .catch((error) => {
          console.log(error);
        });
    };

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
