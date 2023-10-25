import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import BleManager from 'react-native-ble-manager';

import { stringToBytes } from "convert-string";

import { AsyncStorage } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default function TelaPreset () {
    const navigation = useNavigation();
    let peripheralId = "B0:A7:32:15:39:42"; // ID do seu dispositivo periférico
    let serviceUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID do serviço
    let characteristicUUID = "bbcd1234-ab12-cd34-a123-456789abcdef"; // UUID da característica



    async function connectAndPrepare(peripheralId, serviceUUID, characteristicUUID) {
      // Connect to device
      await BleManager.connect(peripheralId);
      // Before startNotification you need to call retrieveServices
      await BleManager.retrieveServices(peripheralId);
      // Start notification for this characteristic
      // Por algum motivo, a troca de tela só funciona quando eu coloco start notification e tiro logo em seguida
      BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID);
      bleManagerEmitter.addListener(
        "BleManagerDidUpdateValueForCharacteristic",
        ({ value, peripheral, characteristic, service }) => {
          // Convert bytes array to string
          const data = bytesToString(value);
          console.log(`Received ${data} for characteristic ${characteristic}`);
          switch (data) {
            case '1':
              navigation.navigate('preset1');
              break;
            case '3':
              navigation.navigate('preset2');
              break;
            case '2':
              navigation.navigate('preset3');
              break;
            default:
              console.log(`Received unknown data: ${data}`);
          }
        }
      );
      // Actions triggereng BleManagerDidUpdateValueForCharacteristic event
      function bytesToString(bytes) {
        return bytes.map(byte => String.fromCharCode(byte)).join('');
    }
    }

    //Vai rodar quando entrar na tela
    useEffect(() => {
      connectAndPrepare(peripheralId, serviceUUID, characteristicUUID)
      .catch(error => {
          console.error("An error occurred: ", error);
      });
      
  }, []);

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
