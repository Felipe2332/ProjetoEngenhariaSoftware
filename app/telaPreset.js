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

import AsyncStorage from '@react-native-async-storage/async-storage';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
import { sendMessage } from '../sendMessage'


export default function TelaPreset () {
    const navigation = useNavigation();
    let peripheralId = "B0:A7:32:15:39:42"; // ID do seu dispositivo periférico
    let serviceUUID = "abcd1234-ab12-cd34-a123-456789abcdef"; // UUID do serviço
    let characteristicUUID = "bbcd1234-ab12-cd34-a123-456789abcdef"; // UUID da característica

    const [preset1Leds, setPreset1Leds] = useState([false, false, false, false, false, false, false, false]);
    const [preset2Leds, setPreset2Leds] = useState([false, false, false, false, false, false, false, false]);
    const [preset3Leds, setPreset3Leds] = useState([false, false, false, false, false, false, false, false]);

    const [preset1Selected, setPreset1Selected] = useState(false);
    const [preset2Selected, setPreset2Selected] = useState(false);
    const [preset3Selected, setPreset3Selected] = useState(false);

    async function connectAndPrepare(peripheralId, serviceUUID, characteristicUUID) {
      // Connect to device
      await BleManager.connect(peripheralId);
      // Before startNotification you need to call retrieveServices
      await BleManager.retrieveServices(peripheralId);
      // Start notification for this characteristic
      // Por algum motivo, a troca de tela só funciona quando eu coloco start notification e tiro logo em seguida
      
      bleManagerEmitter.addListener(
        "BleManagerDidUpdateValueForCharacteristic",
        ({ value, peripheral, characteristic, service }) => {
          // Convert bytes array to string
          const data = bytesToString(value);
          console.log(`Received ${data} for characteristic ${characteristic}`);
          switch (data) {
            case '1':
              setPreset1Selected(true);
              setPreset2Selected(false);
              setPreset3Selected(false);
              carregarPreset('preset1', setPreset1Leds);
              break;
            case '3':
              setPreset1Selected(false);
              setPreset2Selected(true);
              setPreset3Selected(false);
              carregarPreset('preset2', setPreset2Leds);
              break;
            case '2':
              setPreset1Selected(false);
              setPreset2Selected(false);
              setPreset3Selected(true);
              carregarPreset('preset3', setPreset3Leds);
              break;
            default:
              console.log(`Received unknown data: ${data}`);
          }
        }
      );
      const carregarPreset = async (presetName, setLeds) => {
        try {
          let leds = await AsyncStorage.getItem(presetName);
          if (leds !== null) {
            leds = JSON.parse(leds);
            console.log(`Estado carregado para ${presetName}: ${leds}`);
            setLeds(leds);
      
            // Envia os comandos para o ESP32 para acender os LEDs de acordo com o estado carregado
            for (let i = 0; i < leds.length; i++) {
              if (leds[i]) {
                let command = `${(i + 1) * 10}`; // Assume que o comando para acender o LED é '10', '20', '30', etc.
                sendMessage(data, setIsLedOn, setIsLed1On, setIsLed2On, setIsLed3On, setIsLed4On, setIsLed5On, setIsLed6On, setIsLed7On, setIsLed8On);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      
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

            <Animatable.View animation="fadeInLeftBig" delay={100} style={styles.presetButtonTop}>
            <TouchableOpacity onPress={() => navigation.navigate('preset1')} hitSlop={{ top: 25, bottom: 25, left: 125, right: 125 }} >
              <Text style={styles.textButtonPreset}>Preset 1</Text>
            </TouchableOpacity>
            </Animatable.View>
            
            <Animatable.View animation="fadeInLeftBig" delay={300} style={styles.presetButtonMiddle}>
            <TouchableOpacity onPress={() => navigation.navigate('preset2')} hitSlop={{ top: 25, bottom: 25, left: 125, right: 125 }}>
              <Text style={styles.textButtonPreset}>Preset 2</Text>
            </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation="fadeInLeftBig" delay={500} style={styles.presetButtonBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('preset3')} hitSlop={{ top: 25, bottom: 25, left: 125, right: 125 }}>
              <Animatable.Text style={styles.textButtonPreset} animation="bounceIn" duration={2000}>Preset 3</Animatable.Text>
              </TouchableOpacity>
            </Animatable.View>

          </ImageBackground>
        </View>
    )
};
