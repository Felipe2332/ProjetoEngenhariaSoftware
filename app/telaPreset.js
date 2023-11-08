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
    const [isLedOn, setIsLedOn] = useState(false);
    const [isLed1On, setIsLed1On] = useState(false);
    const [isLed2On, setIsLed2On] = useState(false);
    const [isLed3On, setIsLed3On] = useState(false);
    const [isLed4On, setIsLed4On] = useState(false);
    const [isLed5On, setIsLed5On] = useState(false);
    const [isLed6On, setIsLed6On] = useState(false);
    const [isLed7On, setIsLed7On] = useState(false);
    const [isLed8On, setIsLed8On] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    

    async function connectAndPrepare(peripheralId, serviceUUID, characteristicUUID) {
      if (isSending) {
        // Já estamos enviando um comando, então retornamos imediatamente
        return;
      }
      setIsSending(true);
      await BleManager.connect(peripheralId);

      await BleManager.retrieveServices(peripheralId);
      //Falta desligar os leds quando entra na tela de preset para configurá-los
      
      // Por algum motivo, a troca de tela só funciona quando eu coloco start notification e tiro logo em seguida
      BleManager.startNotification(peripheralId,serviceUUID,characteristicUUID)
  
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
              if (!isLoading) {
                setIsLoading(true);
                carregarPreset('preset1', setPreset1Leds);
              }
              break;
            case '3':
              setPreset1Selected(false);
              setPreset2Selected(true);
              setPreset3Selected(false);
              if (!isLoading) {
                setIsLoading(true);
                carregarPreset('preset2', setPreset2Leds);
              }
              break;
            case '2':
              setPreset1Selected(false);
              setPreset2Selected(false);
              setPreset3Selected(true);
              if (!isLoading) {
                setIsLoading(true);
                carregarPreset('preset3', setPreset3Leds);
              }
              break;
            default:
              console.log(`Received unknown data: ${data}`);
          }
        });

      const toggleRedLed = () => {
        let data = isLed1On ? '10' : '11';
        sendMessage(data,setIsLed1On);
        setIsLed1On(!isLed1On);
        console.log(`isLed1On: ${!isLed1On}`);
      };
      const toggleYellowLed = () => {
        let data = isLed2On ? '20' : '21'; 
        sendMessage(data,setIsLed2On);
        setIsLed2On(!isLed2On);
      };
      const toggleGreenLed = () => {
        let data = isLed3On ? '30' : '31'; 
        sendMessage(data,setIsLed3On);
        setIsLed3On(!isLed3On);
      
      };
      const toggleRedLed2 = () => {
        let data = isLed4On ? '40' : '41'; 
        sendMessage(data,setIsLed4On);
        setIsLed4On(!isLed4On);
      };
      
      const toggleGreenLed2 = () => {
        let data = isLed5On ? '50' : '51'; 
        sendMessage(data,setIsLed5On);
        setIsLed5On(!isLed5On);
      
      };
      const toggleRedLed3 = () => {
        let data = isLed6On ? '60' : '61'; 
        sendMessage(data,setIsLed6On);
        setIsLed6On(!isLed6On);
      };
      const toggleRedLed4 = () => {
        let data = isLed7On ? '70' : '71'; 
        sendMessage(data,setIsLed7On);
        setIsLed7On(!isLed7On);
      };
      const toggleGreenLed3 = () => {
        let data = isLed8On ? '80' : '81'; 
        sendMessage(data,setIsLed8On);
        setIsLed8On(!isLed8On);
      };

      const desligarTodosLeds = () => {
        let data = '10'; 
        sendMessage(data,setIsLed1On);
        setIsLed1On(false);
      
        data = '20'; 
        sendMessage(data,setIsLed2On);
        setIsLed2On(false);

        data = '30';
        sendMessage (data,setIsLed3On);
        setIsLed3On(false);

        data = '40';
        sendMessage(data,setIsLed4On);
        setIsLed4On(false);

        data = '50';
        sendMessage(data,setIsLed5On);
        setIsLed5On(false);

        data = '60';
        sendMessage(data,setIsLed6On);
        setIsLed6On(false);

        data = '70';
        sendMessage(data,setIsLed7On);
        setIsLed7On(false);

        data = '80';
        sendMessage(data,setIsLed8On);
        setIsLed8On(false);
      };

      const carregarPreset = async (presetName) => {
        try {
          let leds = await AsyncStorage.getItem(presetName);
          if (leds !== null) {
            leds = JSON.parse(leds);
            console.log(`Estado carregado para ${presetName}: ${leds}`);

            desligarTodosLeds();
      
            if (leds[0]) toggleRedLed();
            if (leds[1]) toggleYellowLed();
            if (leds[2]) toggleGreenLed();
            if (leds[3]) toggleRedLed2();
            if (leds[4]) toggleGreenLed2();
            if (leds[5]) toggleRedLed3();
            if (leds[6]) toggleRedLed4();
            if (leds[7]) toggleGreenLed3();
          }
        } catch (error) {
          console.log(error);
        }finally {
          setIsLoading(false);
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
