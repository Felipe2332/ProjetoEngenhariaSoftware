import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import BleManager from 'react-native-ble-manager';

import { AsyncStorage } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default function TelaPreset () {
    const navigation = useNavigation();
    let peripheralId = "B0:A7:32:15:39:42"; // ID do seu dispositivo periférico
    let serviceUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID do serviço
    let characteristicUUID = "bbcd1234-ab12-cd34-a123-456789abcdef"; // UUID da característica
    let switchUUID = "gbcd1234-ab12-cd34-a123-456789abcdef";

    useEffect(() => {


      BleManager.retrieveServices(peripheralId).then(
        (peripheralInfo) => {
          // Success code
          console.log("Peripheral info:", peripheralInfo);
        }).catch((error) => {
          // Failure code
          console.log("deu merda parcero");
          console.log(error);
        });
        BleManager.connect(peripheralId)
      .then(() => {
          // Success code
          console.log("Connectedado");
        })
        .catch((error) => {
          // Failure code
          console.log(error);
         });
       
         try {
          BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID, 1234)
            .then(() => {
              console.log("Notification started");
              
              bleManagerEmitter.addListener(
                'BleManagerDidUpdateValueForCharacteristic',
                ({ value, peripheral, characteristic, service }) => {
                  console.log(`Received new value ${value} for characteristic ${characteristic}`);
                  let receivedValue = String.fromCharCode.apply(null, new Uint8Array(value));
        
                  switch (receivedValue) {
                    case '1':
                      console.log('Switching to Preset 1');
                      navigation.navigate('preset1');
                      break;
                    case '2':
                      console.log('Switching to Preset 2');
                      navigation.navigate('preset2');
                      break;
                    case '3':
                      console.log('Switching to Preset 3');
                      navigation.navigate('preset3');
                      break;
                    default:
                      console.log('Unknown value received: ', receivedValue);
                  }
                }
              );
            })
            .catch((error) => {
              console.error("Error in startNotification: ", error);
            });
        } catch (error) {
          console.error("Unexpected error: ", error);
        }
}
)        

    return(
        <View style={styles.containerTelaPreset}>

          <StatusBar style="auto"/>

            <ImageBackground source={require('../assets/peakpx.jpg')} style={styles.image}>
            

            <TouchableOpacity onPress={() => {
            navigation.goBack();}} style={styles.botaoVoltar}>
            <Icon name="arrow-left"/>

            </TouchableOpacity>
            
            <Text style={[styles.title]}>Bem vindo à tela de presets</Text>
            <TouchableOpacity onPress={() => navigation.navigate('preset1')} style={styles.presetButtonTop}><Text style={styles.textButtonPreset}>Preset 1</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('preset2')}style={styles.presetButtonMiddle}><Text style={styles.textButtonPreset}>Preset 2</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('preset3')}style={styles.presetButtonBottom}><Text style={styles.textButtonPreset}>Preset 3</Text></TouchableOpacity>



            
          </ImageBackground>
        </View>
    )

};
