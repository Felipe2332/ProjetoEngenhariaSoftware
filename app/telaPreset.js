import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/styles'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import BleManager from 'react-native-ble-manager';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
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
  const AnimatedButton = ({ navigation }) => {
    let animationRef = useRef(null);
  
    const handlePress = (route) => {
      animationRef.fadeOut().then(endState => navigation.navigate(route));
    };}  

    return(
        <View style={styles.containerTelaPreset}>

          <StatusBar style="auto"/>

            <ImageBackground source={require('../assets/peakpx.jpg')} style={styles.image}>
            
            <TouchableOpacity onPress={() => {
            navigation.goBack();}} style={styles.botaoVoltar}>
            <Icon name="arrow-left"/>
            </TouchableOpacity>
            
            
            <Animatable.Text style={styles.title} animation="flipInX" duration={2000} direction="alternate">Bem vindo à tela de presets</Animatable.Text>

            <Animatable.View animation="fadeInLeft" delay={100} style={styles.presetButtonTop}>
            <TouchableOpacity onPress={() => navigation.navigate('preset1')} >
              <Text style={styles.textButtonPreset}>Preset 1</Text>
            </TouchableOpacity>
            </Animatable.View>
            
            <Animatable.View animation="fadeInLeft" delay={300} style={styles.presetButtonMiddle}>
            <TouchableOpacity onPress={() => navigation.navigate('preset2')}>
              <Text style={styles.textButtonPreset}>Preset 2</Text>
            </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation="fadeInLeftBig" delay={500} style={styles.presetButtonBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('preset3')}>
              <Animatable.Text style={styles.textButtonPreset} animation="bounceIn" duration={2000}>Preset 3</Animatable.Text>
              </TouchableOpacity>
            </Animatable.View>

          </ImageBackground>
        </View>
    )
};
